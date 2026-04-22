import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PLACE_ORDER } from "../../config/apiService";

const API_BASE = "http://localhost:2005";

const PaymentReturn = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("Đang xác thực thanh toán...");

    useEffect(() => {
        const verify = async () => {
            try {
                setLoading(true);

                // query params trả về từ VNPAY
                const qs = location.search?.replace(/^\?/, "") || "";
                const res = await fetch(`${API_BASE}/vnpay/verify?${qs}`);
                const data = await res.json();

                if (!data?.success) {
                    setSuccess(false);
                    setMessage("Thanh toán thất bại hoặc chữ ký không hợp lệ ❌");
                    return;
                }

                // verify ok -> place order bằng pending info đã lưu
                const pendingRaw = localStorage.getItem("pending-vnpay-order");
                if (!pendingRaw) {
                    setSuccess(false);
                    setMessage("Không tìm thấy thông tin đơn hàng chờ thanh toán.");
                    return;
                }

                const pending = JSON.parse(pendingRaw);
                const { email, cartId, addressId } = pending || {};

                if (!email || !cartId || !addressId) {
                    setSuccess(false);
                    setMessage("Thiếu thông tin để tạo đơn hàng.");
                    return;
                }

                await PLACE_ORDER(email, cartId, addressId, "VNPAY");

                // clear pending
                localStorage.removeItem("pending-vnpay-order");

                setSuccess(true);
                setMessage("Thanh toán VNPAY thành công 🎉");
            } catch (e) {
                console.error("verify error:", e);
                setSuccess(false);
                setMessage("Không thể xác thực thanh toán");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [location.search]);

    return (
        <section className="section-content padding-y bg-light" style={{ minHeight: "80vh" }}>
            <div className="container">
                <div className="card shadow-sm border-0 text-center mx-auto" style={{ maxWidth: 600, marginTop: 50 }}>
                    <div className="card-body p-5">
                        <h3 className="mb-3">Kết quả thanh toán</h3>

                        {loading ? (
                            <div className="text-muted">Đang xác thực thanh toán…</div>
                        ) : (
                            <>
                                <div className={`h5 mb-3 ${success ? "text-success" : "text-danger"}`}>
                                    {success ? "THÀNH CÔNG" : "THẤT BẠI"}
                                </div>
                                <p className="text-muted">{message}</p>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(success ? "/order-success" : "/checkout", { replace: true })}
                                >
                                    {success ? "Xem kết quả" : "Quay lại thanh toán"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentReturn;
