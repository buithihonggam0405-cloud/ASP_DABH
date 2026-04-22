import React from "react";
import { IonIcon } from "@ionic/react";
import { informationCircleOutline, checkmarkCircle } from "ionicons/icons";

const ProductDescription = ({ product }) => {
    const formatVND = (n) => Number(n ?? 0).toLocaleString("vi-VN") + "đ";

    return (
        <section className="section-name padding-y bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            <h5 className="title-description font-weight-bold mb-3">
                                <IonIcon icon={informationCircleOutline} className="mr-2 text-primary" />
                                Mô tả sản phẩm
                            </h5>

                            <p className="mb-4">{product.description}</p>

                            <h5 className="title-description font-weight-bold mb-3">Thông tin</h5>
                            <table className="table table-striped table-bordered mb-0">
                                <tbody>
                                    <tr>
                                        <td>Danh mục</td>
                                        <td>
                                            <IonIcon icon={checkmarkCircle} className="text-success mr-2" />
                                            {product?.category?.categoryName ?? "—"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Giá gốc</td>
                                        <td>{formatVND(product.price)}</td>
                                    </tr>
                                    <tr>
                                        <td>Giá ưu đãi</td>
                                        <td>{product.specialPrice ? formatVND(product.specialPrice) : "—"}</td>
                                    </tr>
                                    <tr>
                                        <td>Giảm giá</td>
                                        <td>{product.discount ? `${product.discount}%` : "—"}</td>
                                    </tr>
                                    <tr>
                                        <td>Tồn kho</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                    <tr>
                                        <td>Mã sản phẩm</td>
                                        <td>#{product.productId}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDescription;
