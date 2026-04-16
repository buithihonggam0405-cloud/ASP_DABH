import React, { useEffect, useMemo, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
    bagCheckOutline,
    locationOutline,
    cardOutline,
    cashOutline,
    chevronDownOutline,
    carOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";

import {
    GET_USER_BY_EMAIL,
    GET_CART_BY_USER_ID,
    GET_USER_ADDRESSES,
    PLACE_ORDER,
    getUserEmail,
    GET_IMG,
} from "../config/apiService";

import { spxCalcFee, spxMapToAdminFromUserAddress } from "../config/spx";

const API_BASE = "http://localhost:2005";

const PAYMENT_METHODS = [
    { id: "CASH_ON_DELIVERY", type: "CASH_ON_DELIVERY", detail: "Thanh toán khi nhận hàng" },
    { id: "VNPAY", type: "VNPAY", detail: "Thanh toán qua VNPAY" },
    { id: "PAYPAL", type: "PAYPAL", detail: "Demo PayPal" },
];

const Checkout = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    // user/cart
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    // addresses
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // payment
    const [selectedMethod, setSelectedMethod] = useState("CASH_ON_DELIVERY");
    const [methodOpen, setMethodOpen] = useState(false);

    // ✅ SPX shipping states
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [edt, setEdt] = useState(null);
    const [spxMappedText, setSpxMappedText] = useState("");

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

    useEffect(() => {
        document.title = "Thanh toán";
    }, []);

    // ---- FETCH ALL: user -> cart + addresses ----
    const fetchCheckoutData = async () => {
        try {
            setLoading(true);

            const savedEmail = getUserEmail();
            if (!savedEmail) {
                navigate("/login", { replace: true });
                return;
            }
            setEmail(savedEmail);

            const user = await GET_USER_BY_EMAIL(savedEmail);
            const _userId = user?.userId ?? user?.data?.userId;
            if (!_userId) throw new Error("Không lấy được userId");
            setUserId(_userId);

            // cart
            const cartRes = await GET_CART_BY_USER_ID(_userId);
            const cartData = cartRes?.cartId ? cartRes : cartRes?.data;

            setCartId(cartData?.cartId ?? null);

            const mappedCartItems = (cartData?.cartItems ?? []).map((ci) => {
                const p = ci.product || {};
                return {
                    productId: p.productId,
                    productName: p.productName,
                    image: p.image,
                    quantity: ci.quantity,
                    unitPrice: ci.productPrice ?? p.specialPrice ?? p.price ?? 0,
                };
            });
            setCartItems(mappedCartItems);

            // addresses
            const addrRes = await GET_USER_ADDRESSES(_userId);
            const addrList =
                Array.isArray(addrRes) ? addrRes :
                    Array.isArray(addrRes?.addresses) ? addrRes.addresses :
                        addrRes?.data || [];
            setAddresses(addrList);

            // select address
            const savedAddrId = localStorage.getItem("selected-address-id");
            if (savedAddrId && addrList.some((a) => a.addressId === Number(savedAddrId))) {
                setSelectedAddressId(Number(savedAddrId));
            } else {
                setSelectedAddressId(addrList?.[0]?.addressId ?? null);
            }
        } catch (e) {
            console.error("Checkout load error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCheckoutData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedAddress = useMemo(() => {
        return addresses.find((a) => a.addressId === selectedAddressId) || null;
    }, [addresses, selectedAddressId]);

    const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    }, [cartItems]);

    // ✅ giống RN: weight = 1kg * tổng quantity (bạn có thể đổi nếu có weight product)
    const totalWeightKg = useMemo(() => {
        return 1 * cartItems.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    }, [cartItems]);

    const grandTotal = useMemo(() => totalAmount + (shippingFee || 0), [totalAmount, shippingFee]);

    const handleSelectAddress = (id) => {
        setSelectedAddressId(id);
        localStorage.setItem("selected-address-id", String(id));
        const addrObj = addresses.find((a) => a.addressId === id);
        if (addrObj) localStorage.setItem("selected-address-data", JSON.stringify(addrObj));
    };

    // ✅ Calc shipping giống RN
    const calcShipping = async (addr, weightKg) => {
        try {
            setShippingLoading(true);
            setSpxMappedText("");

            if (!addr?.state || !addr?.city || !addr?.street) {
                setShippingFee(0);
                setEdt(null);
                return;
            }

            const toAdmin = await spxMapToAdminFromUserAddress({
                state: addr.state,
                city: addr.city,
                street: addr.street,
            });

            setSpxMappedText(`${toAdmin[0].label} / ${toAdmin[1].label} / ${toAdmin[2].label}`);

            const result = await spxCalcFee({
                weightKg,
                toAdmin,
                productId: 53001,
            });

            setShippingFee(result.fee);
            setEdt({ min: result.edt_min, max: result.edt_max });
        } catch (e) {
            console.error("SPX fee error:", e?.message || e);
            setShippingFee(0);
            setEdt(null);
            setSpxMappedText("");
        } finally {
            setShippingLoading(false);
        }
    };

    // ✅ Re-calc shipping khi đổi address hoặc weight
    useEffect(() => {
        if (selectedAddress) {
            calcShipping(selectedAddress, totalWeightKg);
        } else {
            setShippingFee(0);
            setEdt(null);
            setSpxMappedText("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAddressId, totalWeightKg]);

    const handleConfirmPayment = async () => {
        if (!selectedAddressId) {
            alert("Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        if (!selectedAddress?.state || !selectedAddress?.city || !selectedAddress?.street) {
            alert("Địa chỉ chưa đủ state/city/street để tính phí vận chuyển.");
            return;
        }
        if (!cartId) {
            alert("Không tìm thấy giỏ hàng");
            return;
        }
        if (!selectedMethod) {
            alert("Vui lòng chọn phương thức thanh toán");
            return;
        }

        const ok = window.confirm(
            `Xác nhận đặt hàng?\nTiền hàng: ${formatCurrency(totalAmount)}\nPhí ship: ${formatCurrency(shippingFee)}\nTổng: ${formatCurrency(grandTotal)}\nPhương thức: ${selectedMethod}`
        );
        if (!ok) return;

        if (selectedMethod === "VNPAY") {
            try {
                setLoading(true);

                const pending = {
                    email,
                    cartId,
                    addressId: selectedAddressId,
                    amount: grandTotal, // ✅ tổng có ship
                    shippingFee,
                    createdAt: Date.now(),
                };
                localStorage.setItem("pending-vnpay-order", JSON.stringify(pending));

                const returnUrl = `${window.location.origin}/payment-return`;

                const res = await fetch(`${API_BASE}/payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: grandTotal, // ✅ tổng có ship
                        orderInfo: `Thanh toan don hang cho ${cartId}`,
                        returnUrl,
                    }),
                });

                if (!res.ok) throw new Error("Không tạo được link VNPAY");
                const data = await res.json();
                if (!data?.url) throw new Error("Thiếu url từ server");

                window.location.href = data.url;
            } catch (e) {
                console.error("VNPAY create url error:", e);
                alert("Không thể tạo thanh toán VNPAY. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
            return;
        }

        // COD / PAYPAL (demo) -> place order
        try {
            setLoading(true);
            // Nếu backend bạn muốn lưu shippingFee vào order, bạn cần thêm field trong PLACE_ORDER.
            // Hiện tại API của bạn: PLACE_ORDER(email, cartId, addressId, paymentMethod)
            await PLACE_ORDER(email, cartId, selectedAddressId, selectedMethod);
            navigate("/order-success", { replace: true });
        } catch (e) {
            console.error("Place order error:", e);
            alert(e?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <section className="section-pagetop bg-light">
                    <div className="container">
                        <h2 className="title-page d-flex align-items-center">
                            <IonIcon icon={bagCheckOutline} className="mr-2" />
                            Thanh toán
                        </h2>
                    </div>
                </section>
                <section className="section-content padding-y">
                    <div className="container" style={{ maxWidth: 720 }}>
                        <div className="text-center text-muted py-5">Đang tải dữ liệu thanh toán...</div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section className="section-pagetop bg-light">
                <div className="container">
                    <h2 className="title-page d-flex align-items-center">
                        <IonIcon icon={bagCheckOutline} className="mr-2" />
                        Thanh toán
                    </h2>
                </div>
            </section>

            <section className="section-content padding-y">
                <div className="container" style={{ maxWidth: 720 }}>
                    {/* ADDRESS */}
                    <div className="card mb-4 shadow-sm border-0 rounded-lg">
                        <div className="card-body">
                            <h4 className="card-title mb-3 d-flex align-items-center">
                                <IonIcon icon={locationOutline} className="mr-2" /> Địa chỉ giao hàng
                            </h4>

                            {addresses.length === 0 ? (
                                <div className="text-muted">
                                    Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ trước.
                                </div>
                            ) : (
                                <div className="list-group">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr.addressId}
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${addr.addressId === selectedAddressId ? "active" : ""
                                                }`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleSelectAddress(addr.addressId)}
                                        >
                                            <div>
                                                <div className="font-weight-bold">
                                                    {addr.buildingName || "Địa chỉ"}{" "}
                                                    <small className={addr.addressId === selectedAddressId ? "text-white-50" : "text-muted"}>
                                                        (#{addr.addressId})
                                                    </small>
                                                </div>

                                                <div className={addr.addressId === selectedAddressId ? "text-white-50" : "text-muted"}>
                                                    {addr.street}, {addr.city}, {addr.state}, {addr.country} {addr.pincode}
                                                </div>

                                                {addr.addressId === selectedAddressId ? (
                                                    <div className="mt-1 small text-white-50">
                                                        Quy ước SPX: street=phường/xã • city=quận/huyện • state=tỉnh/tp
                                                    </div>
                                                ) : null}
                                            </div>

                                            <input
                                                type="radio"
                                                name="address"
                                                checked={addr.addressId === selectedAddressId}
                                                onChange={() => handleSelectAddress(addr.addressId)}
                                                style={{ marginTop: 4 }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PRODUCTS */}
                    <div className="card mb-4 shadow-sm border-0 rounded-lg">
                        <div className="card-body">
                            <h4 className="card-title mb-3">Sản phẩm ({cartItems.length})</h4>

                            {cartItems.length === 0 ? (
                                <div className="text-muted">Giỏ hàng trống.</div>
                            ) : (
                                <div className="list-group">
                                    {cartItems.map((p) => {
                                        const imgUrl = p.image ? GET_IMG("products/image", p.image) : null;
                                        return (
                                            <div key={p.productId} className="list-group-item d-flex align-items-center">
                                                <img
                                                    src={imgUrl || "https://via.placeholder.com/80"}
                                                    alt={p.productName}
                                                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://via.placeholder.com/80";
                                                    }}
                                                />
                                                <div className="ml-3 flex-grow-1">
                                                    <div className="font-weight-bold">{p.productName}</div>
                                                    <div className="text-muted small">
                                                        SL: {p.quantity} • Đơn giá: {formatCurrency(p.unitPrice)}
                                                    </div>
                                                </div>
                                                <div className="font-weight-bold">
                                                    {formatCurrency(p.unitPrice * p.quantity)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✅ SHIPPING (SPX) */}
                    <div className="card mb-4 shadow-sm border-0 rounded-lg">
                        <div className="card-body">
                            <h4 className="card-title mb-3 d-flex align-items-center">
                                <IonIcon icon={carOutline} className="mr-2" /> Vận chuyển (SPX)
                            </h4>

                            {!selectedAddress ? (
                                <div className="text-muted">Vui lòng chọn địa chỉ để tính phí vận chuyển.</div>
                            ) : !selectedAddress?.state || !selectedAddress?.city || !selectedAddress?.street ? (
                                <div className="alert alert-warning mb-0">
                                    Địa chỉ chưa đủ <b>state/city/street</b> để tính ship (SPX).
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted">
                                            {shippingLoading ? "Đang tính phí..." : "Phí ship"}
                                        </div>
                                        <div className="font-weight-bold">
                                            {shippingLoading ? "..." : formatCurrency(shippingFee)}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <div className="text-muted">Dự kiến</div>
                                        <div>
                                            {edt?.min && edt?.max ? `${edt.min}-${edt.max} ngày` : "—"}
                                        </div>
                                    </div>

                                    {spxMappedText ? (
                                        <div className="small text-muted mt-2">
                                            Map SPX: {spxMappedText}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="card mb-4 shadow-sm border-0 rounded-lg">
                        <div className="card-body">
                            <h4 className="card-title mb-3 d-flex align-items-center">
                                <IonIcon icon={cardOutline} className="mr-2" /> Phương thức thanh toán
                            </h4>

                            <div className="position-relative" style={{ maxWidth: 520 }}>
                                <button
                                    type="button"
                                    className="btn btn-light btn-block d-flex justify-content-between align-items-center"
                                    onClick={() => setMethodOpen((s) => !s)}
                                >
                                    <span>
                                        <strong>{selectedMethod}</strong>{" "}
                                        <span className="text-muted ml-2">
                                            {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.detail}
                                        </span>
                                    </span>
                                    <IonIcon icon={chevronDownOutline} />
                                </button>

                                {methodOpen ? (
                                    <div className="list-group position-absolute w-100" style={{ zIndex: 20 }}>
                                        {PAYMENT_METHODS.map((m) => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                className={`list-group-item list-group-item-action ${m.id === selectedMethod ? "active" : ""
                                                    }`}
                                                onClick={() => {
                                                    setSelectedMethod(m.id);
                                                    setMethodOpen(false);
                                                }}
                                            >
                                                <div className="d-flex justify-content-between">
                                                    <span className="font-weight-bold">{m.type}</span>
                                                    <span className={m.id === selectedMethod ? "text-white-50" : "text-muted"}>
                                                        {m.detail}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div className="mt-3 text-muted small">
                                {selectedMethod === "VNPAY"
                                    ? "Bạn sẽ được chuyển sang cổng VNPAY để thanh toán."
                                    : selectedMethod === "CASH_ON_DELIVERY"
                                        ? "Thanh toán khi nhận hàng."
                                        : "Thanh toán PayPal (demo)."}
                            </div>
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="card mb-5 shadow-sm border-0 rounded-lg">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tiền hàng:</span>
                                <span className="font-weight-bold">{formatCurrency(totalAmount)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Phí ship (SPX):</span>
                                <span className="font-weight-bold">
                                    {shippingLoading ? "..." : formatCurrency(shippingFee)}
                                </span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted">Tổng thanh toán</div>
                                    <div className="h4 mb-0">{formatCurrency(grandTotal)}</div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg d-flex align-items-center"
                                    onClick={handleConfirmPayment}
                                    disabled={cartItems.length === 0 || shippingLoading}
                                >
                                    <IonIcon icon={cashOutline} className="mr-2" />
                                    Thanh toán ngay
                                </button>
                            </div>

                            {shippingLoading ? (
                                <div className="small text-muted mt-2">Đang tính phí ship, vui lòng chờ...</div>
                            ) : null}
                        </div>
                    </div>

                    <br />
                </div>
            </section>
        </>
    );
};

export default Checkout;
