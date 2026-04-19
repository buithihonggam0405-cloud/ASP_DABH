import React, { useMemo, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
    star,
    starOutline,
    checkmarkCircleOutline,
    cartOutline,
    addOutline,
    removeOutline,
    heartOutline,
} from "ionicons/icons";
import { GET_IMG, ADD_TO_CART, GET_CART_BY_USER_ID, GET_USER_BY_EMAIL, getUserEmail } from "../../config/apiService";

const ProductContent = ({ product, quantity, setQuantity }) => {
    // ảnh chính từ backend
    const mainImageUrl = product?.image
        ? GET_IMG("products/image", product.image)
        : require("../../asset/images/items/15.jpg");

    const [mainImage, setMainImage] = useState(mainImageUrl);

    // mỗi lần product đổi, mainImage cũng nên đổi theo
    React.useEffect(() => {
        setMainImage(mainImageUrl);
    }, [mainImageUrl]);

    const maxStock = product?.quantity ?? 0;

    const priceInfo = useMemo(() => {
        const price = product?.price ?? 0;
        const special = product?.specialPrice ?? null;
        const discount = product?.discount ?? null;
        return { price, special, discount };
    }, [product]);

    const formatVND = (n) => Number(n ?? 0).toLocaleString("vi-VN") + "đ";

    const handleQuantityChange = (type) => {
        if (type === "increase") {
            if (quantity < maxStock) setQuantity(quantity + 1);
        } else {
            if (quantity > 1) setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            const email = getUserEmail();
            if (!email) {
                alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
                return;
            }

            // Sử dụng email làm sessionId cho Backend
            await ADD_TO_CART(email, product.productId, quantity);
            alert("Đã thêm vào giỏ hàng thành công!");
        } catch (e) {
            console.error("Add to cart error:", e);
            alert("Thêm vào giỏ thất bại. Vui lòng thử lại sau!");
        }
    };

    return (
        <section className="section-content bg-white padding-y">
            <div className="container">
                <div className="row">
                    {/* GALLERY */}
                    <aside className="col-md-6 mb-4 mb-md-0">
                        <div className="card shadow-sm border-0">
                            <article className="gallery-wrap p-3">
                                <div className="img-big-wrap text-center mb-3">
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{ height: 450, background: "#f8f9fa", borderRadius: 8 }}
                                    >
                                        <img src={mainImage} alt="main" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                    </div>
                                </div>

                                {/* Thumb: vì API hiện chỉ trả 1 image -> show 1 thumb */}
                                <div className="thumbs-wrap text-center">
                                    <span
                                        className={`item-thumb border rounded mx-1 d-inline-block ${mainImage === mainImageUrl ? "border-primary" : ""}`}
                                        onClick={() => setMainImage(mainImageUrl)}
                                        style={{ cursor: "pointer", padding: 2 }}
                                    >
                                        <img
                                            src={mainImageUrl}
                                            alt="thumb"
                                            style={{ width: 60, height: 60, objectFit: "cover" }}
                                            onError={(e) => {
                                                e.currentTarget.src = require("../../asset/images/items/15.jpg");
                                            }}
                                        />
                                    </span>
                                </div>
                            </article>
                        </div>
                    </aside>

                    {/* INFO */}
                    <main className="col-md-6">
                        <article className="product-info-aside pl-md-4">
                            <h2 className="title mt-3 font-weight-bold">{product.productName}</h2>

                            <div className="rating-wrap my-3 d-flex align-items-center">
                                <ul className="rating-stars list-unstyled d-flex mb-0 mr-3 text-warning">
                                    <li><IonIcon icon={star} /></li>
                                    <li><IonIcon icon={star} /></li>
                                    <li><IonIcon icon={star} /></li>
                                    <li><IonIcon icon={star} /></li>
                                    <li className="text-muted"><IonIcon icon={starOutline} /></li>
                                </ul>

                                <small className="label-rating text-success">
                                    <IonIcon icon={checkmarkCircleOutline} style={{ verticalAlign: "-2px" }} /> Còn {maxStock} sản phẩm
                                </small>
                            </div>

                            <div className="mb-3">
                                <var className="price h3 text-danger font-weight-bold mr-2">
                                    {formatVND(priceInfo.special ?? priceInfo.price)}
                                </var>

                                {priceInfo.special ? (
                                    <>
                                        <span className="text-muted mr-2"><del>{formatVND(priceInfo.price)}</del></span>
                                        {priceInfo.discount ? (
                                            <span className="badge badge-danger">-{priceInfo.discount}%</span>
                                        ) : null}
                                    </>
                                ) : null}
                            </div>

                            <p className="mb-4">{product.description}</p>

                            <hr />

                            <div className="form-row mt-4 align-items-center">
                                {/* Qty */}
                                <div className="form-group col-md flex-grow-0">
                                    <div className="input-group input-spinner mb-3">
                                        <div className="input-group-prepend">
                                            <button className="btn btn-light" type="button" onClick={() => handleQuantityChange("decrease")}>
                                                <IonIcon icon={removeOutline} />
                                            </button>
                                        </div>

                                        <input type="text" className="form-control text-center bg-white" value={quantity} readOnly />

                                        <div className="input-group-append">
                                            <button
                                                className="btn btn-light"
                                                type="button"
                                                onClick={() => handleQuantityChange("increase")}
                                                disabled={quantity >= maxStock}
                                            >
                                                <IonIcon icon={addOutline} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="form-group col-md">
                                    <button type="button" className="btn btn-primary btn-lg mr-2 mb-2" onClick={handleAddToCart}>
                                        <IonIcon icon={cartOutline} className="mr-1" /> Thêm vào giỏ
                                    </button>

                                    <button type="button" className="btn btn-light btn-lg mb-2" title="Yêu thích">
                                        <IonIcon icon={heartOutline} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProductContent;
