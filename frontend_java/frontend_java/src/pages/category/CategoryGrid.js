import React from "react";
import ProductCard from "../listing/ProductCard";

const CategoryGrid = ({ products = [] }) => {
    if (!products.length) {
        return <div className="text-muted">Danh mục này chưa có sản phẩm.</div>;
    }

    return (
        <div className="row row-sm">
            {products.map((p) => (
                <ProductCard key={p.productId} product={p} />
            ))}
        </div>
    );
};

export default CategoryGrid;
