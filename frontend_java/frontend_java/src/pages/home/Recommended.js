import ProductCard from "../listing/ProductCard";


const Recommended = ({ products = [], title }) => {
    if (!products.length) {
        return (
            <section className="padding-bottom-sm">
                <header className="section-heading mb-4 mt-4">
                    <h3 className="title-section">{title}</h3>
                </header>
                <div className="text-muted">Chưa có sản phẩm để hiển thị.</div>
            </section>
        );
    }

    return (
        <section className="padding-bottom-sm">
            <header className="section-heading mb-4 mt-4">
                <h3 className="title-section">{title}</h3>
            </header>

            <div className="row row-sm">
                {products.map((p) => (
                    <ProductCard key={p.productId} product={p} />
                ))}
            </div>
        </section>
    );
};

export default Recommended;
