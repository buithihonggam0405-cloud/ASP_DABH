import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, cardOutline, pricetagOutline, trashOutline } from "ionicons/icons";
import {
    DELETE_FROM_CART,
    GET_CART_BY_USER_ID,
    GET_USER_BY_EMAIL,
    UPDATE_CART_QUANTITY,
    getUserEmail,
} from "../config/apiService";
import CartItem from "../pages/cart/CartItem";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Giỏ hàng của bạn";
    }, []);

    // ---- format tiền VND (giống RN) ----
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

    // ---- fetch cart giống RN ----
    const fetchCartData = async () => {
        try {
            setLoading(true);

            const email = getUserEmail();
            if (!email) {
                setCartItems([]);
                setCartId(null);
                return;
            }

            const userRes = await GET_USER_BY_EMAIL(email);
            const userId = userRes?.userId ?? userRes?.data?.userId; // tuỳ apiService bạn đang trả data hay axios res

            const cartRes = await GET_CART_BY_USER_ID(userId);
            const cartData = cartRes?.cartId ? cartRes : cartRes?.data; // tuỳ apiService

            if (!cartData) {
                setCartItems([]);
                setCartId(null);
                return;
            }

            setCartId(cartData.cartId);

            // map dữ liệu giống RN
            const mappedItems = (cartData.cartItems ?? []).map((ci) => ({
                productId: ci.product?.productId,
                productName: ci.product?.productName,
                image: ci.product?.image,
                quantity: ci.quantity,
                maxStock: ci.product?.quantity ?? 0,
                isChecked: true,

                // backend đã tính giá trong giỏ:
                unitPrice: ci.productPrice ?? ci.product?.specialPrice ?? ci.product?.price ?? 0,

                // giữ thêm để debug nếu cần
                cartItemId: ci.cartItemId,
                discount: ci.discount ?? ci.product?.discount,
                rawProduct: ci.product,
            }));

            setCartItems(mappedItems);
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
            setCartItems([]);
            setCartId(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // ---- toggle check từng item ----
    const handleToggleCheck = (productId) => {
        setCartItems((prev) =>
            prev.map((it) => (it.productId === productId ? { ...it, isChecked: !it.isChecked } : it))
        );
    };

    // ---- toggle all ----
    const handleToggleAll = () => {
        const allChecked = cartItems.every((it) => it.isChecked);
        setCartItems((prev) => prev.map((it) => ({ ...it, isChecked: !allChecked })));
    };

    const checkedCount = useMemo(
        () => cartItems.filter((it) => it.isChecked).length,
        [cartItems]
    );

    const allChecked = cartItems.length > 0 && cartItems.every((it) => it.isChecked);

    // ---- update quantity giống RN ----
    const handleQuantityChange = async (productId, newQuantity) => {
        const current = cartItems.find((it) => it.productId === productId);
        if (current && current.maxStock && newQuantity > current.maxStock) {
            alert(`Kho chỉ còn ${current.maxStock} sản phẩm.`);
            return;
        }

        // optimistic update
        setCartItems((prev) =>
            prev.map((it) => (it.productId === productId ? { ...it, quantity: newQuantity } : it))
        );

        try {
            await UPDATE_CART_QUANTITY(cartId, productId, newQuantity);
            // đồng bộ lại totalPrice từ backend (nếu muốn)
            await fetchCartData();
        } catch (error) {
            console.error("Lỗi update:", error);
            await fetchCartData();
        }
    };

    // ---- delete 1 item giống RN ----
    const handleDeleteItem = async (productId) => {
        const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
        if (!ok) return;

        // optimistic remove
        setCartItems((prev) => prev.filter((it) => it.productId !== productId));

        try {
            await DELETE_FROM_CART(cartId, productId);
            await fetchCartData();
        } catch (error) {
            console.error("Lỗi xóa:", error);
            await fetchCartData();
        }
    };

    // ---- delete selected giống RN ----
    const handleDeleteSelected = async () => {
        const itemsToDelete = cartItems.filter((it) => it.isChecked);
        if (itemsToDelete.length === 0) return;

        const ok = window.confirm(`Xóa ${itemsToDelete.length} sản phẩm đã chọn?`);
        if (!ok) return;

        try {
            await Promise.all(itemsToDelete.map((it) => DELETE_FROM_CART(cartId, it.productId)));
            await fetchCartData();
        } catch (error) {
            console.error("Lỗi xóa nhiều:", error);
            alert("Có lỗi khi xóa");
        }
    };

    // ---- subtotal/total giống RN (chỉ tính item checked) ----
    const { subtotal, totalAmount } = useMemo(() => {
        const checkedItems = cartItems.filter((it) => it.isChecked);
        const sub = checkedItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
        const total = Math.max(0, sub);
        return { subtotal: sub, totalAmount: total };
    }, [cartItems]);

    if (loading) {
        return (
            <section className="section-content padding-y bg-light">
                <div className="container">
                    <div className="text-center text-muted py-5">Đang tải giỏ hàng...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="section-content padding-y bg-light">
            <div className="container">
                <div className="row">
                    <main className="col-md-9">
                        <div className="card shadow-sm border-0">
                            <div className="card-body border-bottom d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Chọn tất cả</strong>{" "}
                                    <small className="text-muted">
                                        ({checkedCount}/{cartItems.length})
                                    </small>
                                </div>

                                <div className="d-flex align-items-center">
                                    <label className="mb-0 mr-3 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            checked={allChecked}
                                            onChange={handleToggleAll}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <span className="ml-2">Tất cả</span>
                                    </label>

                                    {checkedCount > 0 ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={handleDeleteSelected}
                                        >
                                            <IonIcon icon={trashOutline} className="mr-1" /> Xóa đã chọn
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <table className="table table-borderless table-shopping-cart mb-0">
                                <thead className="text-muted">
                                    <tr className="small text-uppercase">
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col" width="120">Số lượng</th>
                                        <th scope="col" width="140">Giá</th>
                                        <th scope="col" className="text-right" width="200"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartItems.length ? (
                                        cartItems.map((item) => (
                                            <CartItem
                                                key={item.cartItemId ?? item.productId}
                                                item={item}
                                                onToggle={handleToggleCheck}
                                                onQuantityChange={handleQuantityChange}
                                                onDelete={handleDeleteItem}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">
                                                Giỏ hàng trống
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="card-body border-top">
                                <Link to="/checkout" className="btn btn-primary float-md-right">
                                    Thanh toán <IonIcon icon={cardOutline} className="ml-2" />
                                </Link>
                                <Link to="/" className="btn btn-light">
                                    <IonIcon icon={arrowBackOutline} className="mr-2" /> Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>

                        <div className="alert alert-success mt-3 shadow-sm border-0">
                            <p className="icontext mb-0">
                                <IonIcon icon={pricetagOutline} className="icon text-success mr-2" /> Miễn phí vận chuyển trong vòng 1-2 tuần
                            </p>
                        </div>
                    </main>

                    <aside className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <dl className="dlist-align">
                                    <dt>Tạm tính:</dt>
                                    <dd className="text-right">{formatCurrency(subtotal)}</dd>
                                </dl>

                                <dl className="dlist-align">
                                    <dt>Tổng cộng:</dt>
                                    <dd className="text-right h5">
                                        <strong>{formatCurrency(totalAmount)}</strong>
                                    </dd>
                                </dl>

                                <hr />
                                <p className="text-center mb-3">
                                    <img src={require("../asset/images/misc/payments.png")} height="26" alt="payments" />
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default Cart;
