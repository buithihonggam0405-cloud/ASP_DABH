import React, { useEffect, useMemo, useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { IonIcon } from "@ionic/react";
import {
    addOutline,
    checkmarkCircle,
    createOutline,
    trashOutline,
    closeOutline,
    saveOutline,
} from "ionicons/icons";

import {
    getUserEmail,
    GET_USER_BY_EMAIL,
    GET_USER_ADDRESSES,
    CREATE_USER_ADDRESS,
    DELETE_ID,
    callApi,
} from "../../config/apiService";

/**
 * NOTE:
 * - Backend address fields của bạn có thể là:
 *   buildingName, street, city, state, pincode, country, mobileNumber...
 * - Bạn chỉnh mapping hiển thị dưới đây cho đúng field BE bạn đang dùng.
 */

const emptyForm = {
    buildingName: "",
    street: "",
    city: "",
    state: "",
    country: "Vietnam",
    pincode: "",
    mobileNumber: "",
    // isDefault: false, // nếu BE có
};

const ProfileAddress = () => {
    const email = getUserEmail();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [userId, setUserId] = useState(null);
    const [addresses, setAddresses] = useState([]);

    // modal
    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState("create"); // create | edit
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    // default selection (nếu BE không có field isDefault thì dùng state)
    const defaultId = useMemo(() => {
        const found = addresses.find((a) => a?.isDefault === true);
        return found?.addressId ?? found?.id ?? null;
    }, [addresses]);

    const safe = (v) => (v === null || v === undefined ? "" : String(v));

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError("");

            if (!email) {
                setError("Bạn chưa đăng nhập.");
                setUserId(null);
                setAddresses([]);
                return;
            }

            // 1) get user -> userId
            const user = await GET_USER_BY_EMAIL(email);
            const uid = user?.userId ?? user?.id;
            if (!uid) {
                setError("Không lấy được thông tin userId.");
                setUserId(null);
                setAddresses([]);
                return;
            }
            setUserId(uid);

            // 2) get addresses by userId
            const data = await GET_USER_ADDRESSES(uid);

            // data có thể là [] hoặc {addresses: []} tùy BE
            const list =
                Array.isArray(data) ? data :
                    Array.isArray(data?.addresses) ? data.addresses :
                        Array.isArray(data?.content) ? data.content :
                            [];

            // sort: default lên trước (nếu có)
            const sorted = [...list].sort((a, b) => {
                const ad = a?.isDefault ? 1 : 0;
                const bd = b?.isDefault ? 1 : 0;
                return bd - ad;
            });

            setAddresses(sorted);
        } catch (e) {
            console.error("Fetch addresses error:", e?.response || e);
            setError("Không tải được danh sách địa chỉ.");
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ================= MODAL HELPERS ================= */
    const openCreate = () => {
        setMode("create");
        setEditingId(null);
        setForm(emptyForm);
        setOpenModal(true);
    };

    const openEdit = (addr) => {
        const id = addr?.addressId ?? addr?.id;
        setMode("edit");
        setEditingId(id);
        setForm({
            buildingName: safe(addr?.buildingName),
            street: safe(addr?.street),
            city: safe(addr?.city),
            state: safe(addr?.state),
            country: safe(addr?.country || "Vietnam"),
            pincode: safe(addr?.pincode),
            mobileNumber: safe(addr?.mobileNumber),
        });
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const onChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    /* ================= CREATE / UPDATE ================= */
    const handleSave = async () => {
        try {
            if (!userId) return;

            // validate nhẹ
            if (!form.buildingName || !form.street || !form.city) {
                alert("Vui lòng nhập Building, Street và City.");
                return;
            }

            if (mode === "create") {
                await CREATE_USER_ADDRESS(userId, form);
                alert("Thêm địa chỉ thành công!");
            } else {
                // TODO: bạn cần endpoint update address, ví dụ:
                // PUT /api/public/users/{userId}/addresses/{addressId}
                // Mình để sẵn callApi để bạn chỉ đổi endpoint.
                //
                // await callApi(`public/users/${userId}/addresses/${editingId}`, "PUT", form);
                //
                alert("Bạn chưa có API update địa chỉ. Gửi mình endpoint update để mình nối.");
                return;
            }

            closeModal();
            fetchAll();
        } catch (e) {
            console.error("Save address error:", e?.response || e);
            alert("Không lưu được địa chỉ.");
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (addr) => {
        try {
            const id = addr?.addressId ?? addr?.id;
            if (!id) return;

            const ok = window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?");
            if (!ok) return;

            // TODO: bạn cần endpoint delete address. Ví dụ thường gặp:
            // DELETE /api/public/users/{userId}/addresses/{addressId}
            //
            // await callApi(`public/users/${userId}/addresses/${id}`, "DELETE");
            //
            // Nếu backend bạn có endpoint khác, gửi mình endpoint để đổi đúng 1 dòng.
            alert("Bạn chưa có API delete địa chỉ. Gửi mình endpoint delete để mình nối.");
        } catch (e) {
            console.error("Delete address error:", e?.response || e);
            alert("Không xóa được địa chỉ.");
        }
    };

    /* ================= SET DEFAULT ================= */
    const handleSetDefault = async (addr) => {
        try {
            const id = addr?.addressId ?? addr?.id;
            if (!id) return;

            // Nếu BE có isDefault:
            // TODO endpoint ví dụ:
            // PUT /api/public/users/{userId}/addresses/{addressId}/default
            //
            // await callApi(`public/users/${userId}/addresses/${id}/default`, "PUT");
            //
            // Còn hiện tại: fallback client-side để UI đổi ngay
            setAddresses((prev) =>
                prev.map((a) => {
                    const aid = a?.addressId ?? a?.id;
                    return { ...a, isDefault: aid === id };
                })
            );

            alert("Đã đặt làm mặc định (client-side). Nếu bạn có API set default, gửi mình để nối BE.");
        } catch (e) {
            console.error("Set default error:", e?.response || e);
            alert("Không đặt mặc định được.");
        }
    };

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <ProfileSidebar />

                    <main className="col-md-9">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <button
                                className="btn btn-outline-primary shadow-sm"
                                type="button"
                                onClick={openCreate}
                            >
                                <IonIcon
                                    icon={addOutline}
                                    className="mr-2"
                                    style={{ verticalAlign: "-2px" }}
                                />
                                Thêm địa chỉ mới
                            </button>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                type="button"
                                onClick={fetchAll}
                            >
                                Tải lại
                            </button>
                        </div>

                        {error ? <div className="alert alert-danger">{error}</div> : null}
                        {loading ? <div className="text-muted">Đang tải địa chỉ...</div> : null}

                        {!loading && addresses.length === 0 ? (
                            <div className="card card-body text-muted">Bạn chưa có địa chỉ nào.</div>
                        ) : null}

                        <div className="row">
                            {addresses.map((addr) => {
                                const id = addr?.addressId ?? addr?.id;
                                const isDefault = addr?.isDefault === true || (defaultId && defaultId === id);

                                return (
                                    <div className="col-md-6" key={id}>
                                        <article
                                            className={`box mb-4 border-0 shadow-sm rounded p-3 position-relative ${isDefault ? "bg-light" : "bg-white"
                                                }`}
                                        >
                                            <h6 className="font-weight-bold mb-1">
                                                {addr?.city ? `${addr.city}, ${addr?.country || ""}` : "Địa chỉ"}
                                            </h6>

                                            <p className="text-muted small mb-0">
                                                Building: {safe(addr?.buildingName, "—")} <br />
                                                Street: {safe(addr?.street, "—")} <br />
                                                State: {safe(addr?.state, "—")} <br />
                                                Phone: {safe(addr?.mobileNumber, "—")}
                                            </p>

                                            <div className="mt-3 d-flex flex-wrap align-items-center">
                                                {isDefault ? (
                                                    <button className="btn btn-sm btn-success disabled mr-2" type="button">
                                                        <IonIcon icon={checkmarkCircle} className="mr-1" /> Mặc định
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary mr-2"
                                                        type="button"
                                                        onClick={() => handleSetDefault(addr)}
                                                    >
                                                        Đặt làm mặc định
                                                    </button>
                                                )}

                                                <button
                                                    className="btn btn-sm btn-light mr-2 border"
                                                    type="button"
                                                    onClick={() => openEdit(addr)}
                                                    title="Sửa"
                                                >
                                                    <IonIcon icon={createOutline} />
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-light border"
                                                    type="button"
                                                    onClick={() => handleDelete(addr)}
                                                    title="Xóa"
                                                >
                                                    <IonIcon icon={trashOutline} className="text-danger" />
                                                </button>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>
            </div>

            {/* ================= MODAL ADD/EDIT ================= */}
            {openModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {mode === "create" ? "Thêm địa chỉ" : "Sửa địa chỉ"}
                                </h5>
                                <button className="close" onClick={closeModal} type="button">
                                    <IonIcon icon={closeOutline} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Building name</label>
                                    <input
                                        className="form-control"
                                        value={form.buildingName}
                                        onChange={(e) => onChange("buildingName", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Street</label>
                                    <input
                                        className="form-control"
                                        value={form.street}
                                        onChange={(e) => onChange("street", e.target.value)}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>City</label>
                                        <input
                                            className="form-control"
                                            value={form.city}
                                            onChange={(e) => onChange("city", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>State</label>
                                        <input
                                            className="form-control"
                                            value={form.state}
                                            onChange={(e) => onChange("state", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Country</label>
                                        <input
                                            className="form-control"
                                            value={form.country}
                                            onChange={(e) => onChange("country", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Postal code</label>
                                        <input
                                            className="form-control"
                                            value={form.pincode}
                                            onChange={(e) => onChange("pincode", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        className="form-control"
                                        value={form.mobileNumber}
                                        onChange={(e) => onChange("mobileNumber", e.target.value)}
                                    />
                                </div>

                                {mode === "edit" ? (
                                    <div className="alert alert-warning small mb-0">
                                        Bạn chưa có API update địa chỉ. Nếu bạn gửi endpoint update/delete/default
                                        mình nối BE giúp bạn trong 1 phút.
                                    </div>
                                ) : null}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={closeModal} type="button">
                                    Hủy
                                </button>
                                <button className="btn btn-primary" onClick={handleSave} type="button">
                                    <IonIcon icon={saveOutline} className="mr-2" />
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfileAddress;
