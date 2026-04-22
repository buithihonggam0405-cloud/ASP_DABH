// src/services/spx.js
export const PROXY_URL = "https://divine-firefly-0b2b.ltcnguyen25.workers.dev";

const API_LOC = "https://spx.vn/shipment/merchant/open/location/get_sub_location_layer_info";
const API_FEE = "https://spx.vn/shipment/order/open/order/batch_check_order";

function buildProxyUrl(target) {
    return `${PROXY_URL}?url=${encodeURIComponent(target)}`;
}

/** SPX: lấy sub locations theo parentId (0 => provinces) */
export async function spxGetSubLocations(parentId = 0) {
    const target = `${API_LOC}?country=VN&sub_level=1${parentId ? `&location_id=${parentId}` : ""}`;
    const res = await fetch(buildProxyUrl(target));
    const json = await res.json();

    if (json?.retcode !== 0) {
        throw new Error(json?.message || "SPX location error");
    }

    const list = json?.data?.sub_location_info || [];
    return list.map((x) => ({
        label: x.name,
        value: Number(x.location_id),
        latitude: String(x.latitude ?? ""),
        longitude: String(x.longitude ?? ""),
    }));
}

/** Tạo address_id ổn định */
export function spxStableAddressId(adminArr) {
    const raw = adminArr.map((x) => x?.value || 0).join("-");
    let h = 0;
    for (let i = 0; i < raw.length; i++) {
        h = ((h << 5) - h) + raw.charCodeAt(i);
        h |= 0;
    }
    h = Math.abs(h);
    const base = String(h).padStart(10, "0");
    return ("5749" + base + "0000").slice(0, 16);
}

/** FROM cố định: Phước Long B / Thủ Đức / TP.HCM */
export const SPX_FROM_FIXED = [
    { label: "TP. Hồ Chí Minh", value: 6000088, latitude: "10.823099", longitude: "106.629664" },
    { label: "Thành Phố Thủ Đức", value: 6032403, latitude: "10.849409", longitude: "106.753706" },
    { label: "Phường Phước Long B", value: 6032412, latitude: "10.814708", longitude: "106.779494" },
];

function normalizeName(s) {
    return (s || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(
            /^(tỉnh|tp\.|tp|thành phố|quan|quận|huyen|huyện|thi xa|thị xã|phuong|phường|xa|xã|thi tran|thị trấn)\s+/g,
            ""
        );
}

function findBestMatch(list, input) {
    const key = normalizeName(input);
    if (!key) return null;

    for (const item of list) {
        if (normalizeName(item.label) === key) return item;
    }
    for (const item of list) {
        const n = normalizeName(item.label);
        if (n.includes(key) || key.includes(n)) return item;
    }
    return null;
}

/**
 * ✅ Map address user (state/city/street) sang SPX toAdmin
 * Quy ước của bạn:
 *  - state  = province
 *  - city   = district
 *  - street = ward
 */
export async function spxMapToAdminFromUserAddress(addr) {
    const provinces = await spxGetSubLocations(0);
    const p = findBestMatch(provinces, addr.state);
    if (!p) throw new Error(`Không map được Tỉnh/TP (state): "${addr.state}"`);

    const districts = await spxGetSubLocations(p.value);
    const d = findBestMatch(districts, addr.city);
    if (!d) throw new Error(`Không map được Quận/Huyện (city): "${addr.city}" trong "${p.label}"`);

    const wards = await spxGetSubLocations(d.value);
    const w = findBestMatch(wards, addr.street);
    if (!w) throw new Error(`Không map được Phường/Xã (street): "${addr.street}" trong "${d.label}"`);

    return [p, d, w];
}

/** ✅ Call SPX batch_check_order */
export async function spxCalcFee(params) {
    const {
        weightKg,
        toAdmin,
        productId = 53001,
        pickupTime = Math.floor(Date.now() / 1000) + 86400,
        addressId,
    } = params;

    const fromAdmin = SPX_FROM_FIXED;
    const addrId = addressId || spxStableAddressId(fromAdmin);

    const payload = {
        list: [
            {
                parcel_weight: weightKg,
                from: { post_code: "", admin_address: fromAdmin, detail_address: "" },
                to: { post_code: "", admin_address: toAdmin, detail_address: "" },

                sender_info: {
                    sender_country: "VN",
                    sender_post_code: "",
                    sender_admin_address: fromAdmin,
                    sender_detail_address: "",
                    sender_state: fromAdmin[0].label,
                    sender_state_location_id: fromAdmin[0].value,
                    sender_city: fromAdmin[1].label,
                    sender_city_location_id: fromAdmin[1].value,
                    sender_district: fromAdmin[2].label,
                    sender_district_location_id: fromAdmin[2].value,
                    sender_latitude: fromAdmin[2].latitude,
                    sender_longitude: fromAdmin[2].longitude,
                    sender_address_id: addrId,
                },

                deliver_info: {
                    deliver_country: "VN",
                    deliver_post_code: "",
                    deliver_admin_address: toAdmin,
                    deliver_detail_address: "",
                    deliver_state: toAdmin[0].label,
                    deliver_state_location_id: toAdmin[0].value,
                    deliver_city: toAdmin[1].label,
                    deliver_city_location_id: toAdmin[1].value,
                    deliver_district: toAdmin[2].label,
                    deliver_district_location_id: toAdmin[2].value,
                    deliver_latitude: toAdmin[2].latitude,
                    deliver_longitude: toAdmin[2].longitude,
                    deliver_address_id: addrId,
                },

                parcel_info: { parcel_weight: [weightKg], parcel_category: 0, parcel_item_quantity: 1 },
                fulfillment_info: {
                    pickup_time: pickupTime,
                    pickup_time_range_id: 1,
                    collect_type: 1,
                    cod_collection: 0,
                    payment_role: 1,
                    insurance_collection: 1,
                    deliver_type: 1,
                    is_pickup_weight: 1,
                },
                base_info: { product_id: productId, order_type: 1 },
            },
        ],
    };

    const res = await fetch(buildProxyUrl(API_FEE), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    const feeInfo = json?.data?.list?.[0]?.fee_info?.[0];
    const edtInfo = json?.data?.list?.[0]?.edt_info;

    if (json?.retcode !== 0 || feeInfo?.retcode !== 0) {
        throw new Error(json?.message || feeInfo?.message || "SPX fee error");
    }

    return {
        fee: Number(feeInfo.estimated_shipping_fee || 0),
        edt_min: edtInfo?.edt_min,
        edt_max: edtInfo?.edt_max,
        snapshot_id: edtInfo?.snapshot_id,
        raw: json,
    };
}
