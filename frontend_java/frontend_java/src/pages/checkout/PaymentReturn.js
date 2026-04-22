import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PLACE_ORDER } from "../../config/apiService";

const API_BASE = "http://localhost:5000/api";

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

                // Gửi toàn bộ query về Backend để kiểm tra chữ ký VNPay
                const qs = location.search || "";
                const res = await fetch(`${API_BASE}/Payment/vnpay-return${qs}`);
                const data = await res.json();

                if (data.status === "Success") {
                    setSuccess(true);
                    setMessage("Thanh toán VNPAY thành công 🎉. Đơn hàng của bạn đã được ghi nhận!");
                } else {
                    setSuccess(false);
                    setMessage(data.message || "Thanh toán thất bại hoặc chữ ký không hợp lệ ❌");
                }
            } catch (e) {
                console.error("verify error:", e);
                setSuccess(false);
                setMessage("Không thể kết nối máy chủ để xác thực.");
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
