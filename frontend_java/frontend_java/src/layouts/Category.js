import React, { useEffect, useState } from "react";
import CategoryGrid from "../pages/category/CategoryGrid";
import Subscribe from "../pages/listing/Subscribe";
import { IonIcon } from "@ionic/react";
import { gridOutline } from "ionicons/icons";
import { GET_PRODUCTS_BY_CATEGORY } from "../config/apiService";
import { useParams } from "react-router-dom";

const Category = () => {
    const { categoryId } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Danh mục sản phẩm";
    }, []);


    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await GET_PRODUCTS_BY_CATEGORY(categoryId, 0, 6, "productId", "desc");
            setProducts(data?.products ?? []);
        } catch (e) {
            console.error("Lỗi lấy sản phẩm theo danh mục:", e);
            setProducts([]);
            setError("Không tải được sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) fetchProducts();
    }, [categoryId]);

    return (
        <>
            <section className="section-pagetop bg-light">
                <div className="container">
                    <h2 className="title-page d-flex align-items-center">
                        <IonIcon icon={gridOutline} className="mr-2" />
                        Danh mục sản phẩm
                    </h2>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 pl-0 bg-transparent">
                            <li className="breadcrumb-item">
                                <a href="/">Trang chủ</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Danh mục #{categoryId}
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="section-content padding-y">
                <div className="container">
                    {loading ? (
                        <div className="text-muted">Đang tải...</div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <CategoryGrid products={products} /> // <- truyền products (đúng nghĩa)
                    )}
                </div>
            </section>

            <Subscribe />
        </>
    );
};

export default Category;
