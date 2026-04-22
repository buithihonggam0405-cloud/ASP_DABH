import React, { useEffect, useMemo, useState } from "react";
import ProfileSidebar from "../pages/profile/ProfileSidebar";
import { IonIcon } from "@ionic/react";
import { receiptOutline, chevronForwardOutline } from "ionicons/icons";
import { Link, useNavigate } from "react-router-dom";

import { GET_ORDERS_BY_EMAIL, getUserEmail } from "../config/apiService";

const PAGE_SIZE = 5;

const formatMoney = (v) => {
    const n = Number(v || 0);
    return n.toLocaleString("vi-VN") + " đ";
};

const formatDate = (s) => {
    if (!s) return "—";
    const d = new Date(s);
    if (isNaN(d.getTime())) return String(s);
    return d.toLocaleDateString("vi-VN");
};

// mapping mềm để không lệch field
const getOrderId = (o) => o?.orderId ?? o?.id ?? o?.orderNumber ?? "—";
const getOrderDate = (o) => o?.createdDate ?? o?.orderDate ?? o?.createdAt ?? o?.date ?? null;
const getOrderTotal = (o) => o?.totalAmount ?? o?.total ?? o?.orderTotal ?? o?.amount ?? 0;
const getOrderStatus = (o) => o?.orderStatus ?? o?.status ?? "—";
const getOrderItems = (o) => o?.orderItems || [];

const Order = () => {
    const navigate = useNavigate();
    const email = getUserEmail();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            if (!email) {
                setOrders([]);
                setError("Bạn chưa đăng nhập.");
                return;
            }

            // ✅ APIService đã return res.data => data là JSON luôn
            const data = await GET_ORDERS_BY_EMAIL(email);

            // ✅ list có thể là [] hoặc {orders: []} hoặc {content: []}
            const list =
                Array.isArray(data) ? data :
                    Array.isArray(data?.orders) ? data.orders :
                        Array.isArray(data?.content) ? data.content :
                            [];

            const sorted = [...list].sort((a, b) => {
                const da = new Date(getOrderDate(a) || 0).getTime();
                const db = new Date(getOrderDate(b) || 0).getTime();
                return db - da;
            });

            setOrders(sorted);
            setPage(0);
        } catch (e) {
            console.error("Fetch orders error:", e);
            const msg = e.response?.data || e.message || "Không tải được lịch sử đơn hàng.";
            setError(typeof msg === 'string' ? msg : "Lỗi hệ thống khi tải đơn hàng.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil((orders?.length || 0) / PAGE_SIZE)),
        [orders]
    );

    const pageOrders = useMemo(() => {
        const start = page * PAGE_SIZE;
        return (orders || []).slice(start, start + PAGE_SIZE);
    }, [orders, page]);

    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div>

                    <main>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="mb-0">
                                <IonIcon icon={receiptOutline} className="mr-2" />
                                Lịch sử đơn hàng
                            </h5>

                            <button className="btn btn-outline-secondary btn-sm" onClick={fetchOrders} type="button">
                                Tải lại
                            </button>
                        </div>

                        {error ? <div className="alert alert-danger">{error}</div> : null}

                        {loading ? (
                            <div className="text-muted">Đang tải đơn hàng...</div>
                        ) : pageOrders.length === 0 ? (
                            <div className="card card-body text-muted">Bạn chưa có đơn hàng nào.</div>
                        ) : (
                            <>
                                <div className="card shadow-sm border-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light text-muted">
                                                <tr>
                                                    <th>Mã đơn</th>
                                                    <th>Sản phẩm</th>
                                                    <th>Ngày đặt</th>
                                                    <th>Trạng thái</th>
                                                    <th className="text-right">Tổng tiền</th>
                                                    <th className="text-right">Chi tiết</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {pageOrders.map((o) => {
                                                    const id = getOrderId(o);
                                                    const items = getOrderItems(o);
                                                    return (
                                                        <tr
                                                            key={id}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => navigate(`/orders/${id}`)}
                                                        >
                                                            <td className="font-weight-bold">#{id}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {items.length > 0 ? (
                                                                        <>
                                                                            <span className="text-truncate" style={{maxWidth: '150px'}}>
                                                                                {items[0].productName}
                                                                                {items.length > 1 ? ` (+${items.length - 1} món)` : ''}
                                                                            </span>
                                                                        </>
                                                                    ) : <span className="text-muted small italic">Không có dữ liệu SP</span>}
                                                                </div>
                                                            </td>
                                                            <td>{formatDate(getOrderDate(o))}</td>
                                                            <td>
                                                                <span className={`badge badge-pill ${
                                                                    getOrderStatus(o) === 'Pending' ? 'badge-warning' : 
                                                                    getOrderStatus(o) === 'Completed' ? 'badge-success' : 'badge-light'
                                                                }`}>
                                                                    {getOrderStatus(o)}
                                                                </span>
                                                            </td>
                                                            <td className="text-right font-weight-bold text-primary">{formatMoney(getOrderTotal(o))}</td>
                                                            <td className="text-right">
                                                                <Link
                                                                    to={`/orders/${id}`}
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    Xem <IonIcon icon={chevronForwardOutline} className="ml-1" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={!canPrev}
                                        onClick={() => setPage((p) => p - 1)}
                                        type="button"
                                    >
                                        Trang trước
                                    </button>

                                    <div className="text-muted">
                                        Trang {page + 1}/{totalPages}
                                    </div>

                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={!canNext}
                                        onClick={() => setPage((p) => p + 1)}
                                        type="button"
                                    >
                                        Trang sau
                                    </button>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
};

export default Order;
