import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET_PRODUCT, GET_IMG } from "../../config/apiService";

const Daily = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy 6 sản phẩm mới nhất từ API ASP.NET
                const data = await GET_PRODUCT(0, 6);
                setProducts(data?.products || []);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm Daily:", error);
            }
        };
        fetchData();
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="padding-bottom-sm">
            <header className="section-heading mb-4 mt-4 d-flex justify-content-between align-items-center">
                <h3 className="title-section">Giảm giá trong ngày</h3>
                <Link to="/listing" className="btn btn-outline-primary btn-sm">Xem tất cả</Link>
            </header>

            <div className="row row-sm">
                {products.map((item) => (
                    <div key={item.productId} className="col-xl-2 col-lg-3 col-md-4 col-6">
                        <div className="card card-sm card-product-grid">
                            <Link to={`/product-detail/${item.productId}`} className="img-wrap">
                                <b className="badge badge-danger mr-1 position-absolute" style={{ top: 10, left: 10 }}> -20% </b>
                                <img src={GET_IMG(item.image)} alt={item.productName} />
                            </Link>
                            <div className="info-wrap p-2 text-center">
                                <Link to={`/product-detail/${item.productId}`} className="title text-truncate d-block">
                                    {item.productName}
                                </Link>
                                <div className="price-wrap mt-1">
                                    <span className="price">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Daily;