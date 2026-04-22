import React from "react";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { star, checkmarkCircleOutline } from "ionicons/icons";
import { GET_IMG } from "../../config/apiService";

const ProductItem = ({ product, viewMode = "grid" }) => {
    const imgUrl = product?.image ? GET_IMG("products/image", product.image) : null;

    const price = product?.price ?? 0;
    const special = product?.specialPrice ?? null;
    const discount = product?.discount ?? null;

    const formatVND = (n) => Number(n ?? 0).toLocaleString("vi-VN") + "đ";

    return (
        <article className="card card-product-list mb-3 shadow-sm border-0 rounded-lg hover-shadow">
            <div className="row no-gutters">
                <aside className="col-md-3">
                    <Link
                        to={`/product-detail/${product.productId}`}
                        className="img-wrap h-100 bg-light rounded-left d-flex align-items-center justify-content-center"
                    >
                        {discount ? (
                            <span className="badge badge-danger" style={{ position: "absolute", top: 10, left: 10 }}>
                                -{discount}%
                            </span>
                        ) : null}

                        <img
                            src={imgUrl || require("../../asset/images/items/1.jpg")}
                            alt={product.productName}
                            style={{ maxHeight: 180 }}
                            onError={(e) => {
                                e.currentTarget.src = require("../../asset/images/items/1.jpg");
                            }}
                        />
                    </Link>
                </aside>

                <div className="col-md-6">
                    <div className="info-main p-4">
                        <Link to={`/product-detail/${product.productId}`} className="h5 title text-dark font-weight-bold">
                            {product.productName}
                        </Link>

                        <div className="rating-wrap mb-2 d-flex align-items-center">
                            <ul className="rating-stars list-unstyled d-flex mb-0 mr-2 text-warning">
                                <li><IonIcon icon={star} /></li>
                                <li><IonIcon icon={star} /></li>
                                <li><IonIcon icon={star} /></li>
                                <li><IonIcon icon={star} /></li>
                                <li className="text-muted"><IonIcon icon={star} /></li>
                            </ul>
                            <div className="label-rating text-muted small">4/5</div>
                        </div>

                        <p className="text-muted">
                            {product?.description || "Không có mô tả"}
                        </p>

                        <p className="text-muted small mb-0">
                            <span className="tag mr-2">
                                <IonIcon icon={checkmarkCircleOutline} className="text-success" /> Còn {product?.quantity ?? 0}
                            </span>
                            {product?.category?.categoryName ? (
                                <span className="tag">Danh mục: {product.category.categoryName}</span>
                            ) : null}
                        </p>
                    </div>
                </div>

                <aside className="col-sm-3 border-left">
                    <div className="info-aside p-4 h-100 d-flex flex-column justify-content-center">
                        <div className="price-wrap mb-2">
                            {special ? (
                                <>
                                    <span className="h5 price text-primary font-weight-bold">{formatVND(special)}</span>
                                    <small className="text-muted d-block">
                                        <del>{formatVND(price)}</del>
                                    </small>
                                </>
                            ) : (
                                <>
                                    <span className="h5 price text-primary font-weight-bold">{formatVND(price)}</span>
                                    <small className="text-muted d-block">/sản phẩm</small>
                                </>
                            )}
                        </div>

                        <Link to={`/product-detail/${product.productId}`} className="btn btn-primary btn-block">
                            Xem chi tiết
                        </Link>
                    </div>
                </aside>
            </div>
        </article>
    );
};

export default ProductItem;
