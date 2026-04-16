import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductContent from "../pages/detail/ProductContent";
import ProductDescription from "../pages/detail/ProductDescription";
import Subscribe from "../pages/listing/Subscribe";

import { GET_ID } from "../config/apiService"; // hoặc GET_PRODUCT_DETAIL bạn tự đặt

const Detail = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        document.title = product ? product.productName : "Chi tiết sản phẩm";
    }, [product]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            // Ví dụ endpoint: public/products/{id}
            const data = await GET_ID("public/products", productId);

            // Nếu apiService bạn trả axios response thì dùng data.data
            const p = data?.productId ? data : data?.data;

            setProduct(p || null);
            setQty(1);
        } catch (e) {
            console.error("Fetch product error:", e);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    if (loading) {
        return (
            <>
                <section className="py-3 bg-light">
                    <div className="container">
                        <div className="text-muted">Đang tải sản phẩm...</div>
                    </div>
                </section>
            </>
        );
    }

    if (!product) {
        return (
            <section className="py-5 bg-light">
                <div className="container">
                    <h4 className="mb-2">Không tìm thấy sản phẩm</h4>
                    <Link to="/" className="btn btn-primary">Về trang chủ</Link>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Breadcrumb động theo category */}
            <section className="py-3 bg-light">
                <div className="container">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        {product?.category ? (
                            <li className="breadcrumb-item">
                                <Link to={`/category/${product.category.categoryId}`}>
                                    {product.category.categoryName}
                                </Link>
                            </li>
                        ) : null}
                        <li className="breadcrumb-item active" aria-current="page">
                            {product.productName}
                        </li>
                    </ol>
                </div>
            </section>

            <ProductContent
                product={product}
                quantity={qty}
                setQuantity={setQty}
            />

            <ProductDescription product={product} />

            <Subscribe />
        </>
    );
};

export default Detail;
