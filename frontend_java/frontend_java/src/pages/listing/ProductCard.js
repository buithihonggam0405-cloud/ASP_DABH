import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { star, cartOutline } from "ionicons/icons";
import { ADD_TO_CART, GET_CART_BY_USER_ID, GET_IMG, GET_USER_BY_EMAIL, getUserEmail } from "../../config/apiService";

const ProductCard = ({ product, className = "col-xl-3 col-lg-3 col-md-4 col-6 mb-4" }) => {
    const {
        productId,
        productName,
        image,
        price,
        specialPrice,
        discount,
    } = product;

    const imgUrl = image ? GET_IMG("products/image", image) : null;

    const renderStars = (rating = 4) => (
        <ul className="rating-stars mb-1 d-flex list-unstyled" style={{ color: "#ffc107" }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} style={i < rating ? undefined : { color: "#ccc" }}>
                    <IonIcon icon={star} />
                </li>
            ))}
        </ul>
    );

    const formatVND = (n) => Number(n ?? 0).toLocaleString("vi-VN") + "đ";

    const handleAddToCart = async () => {
        try {
            const email = getUserEmail();
            if (!email) {
                alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
                return;
            }

            // Sử dụng email làm sessionId cho Backend
            await ADD_TO_CART(email, productId, 1);
            window.dispatchEvent(new Event("cartUpdated"));
            alert("Đã thêm sản phẩm vào giỏ hàng!");
        } catch (e) {
            console.error("Add to cart error:", e);
            alert("Thêm vào giỏ thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className={className}>
            <div className="card card-product-grid h-100">
                <Link to={`/product-detail/${productId}`} className="img-wrap">
                    <img
                        src={imgUrl || "https://via.placeholder.com/300"}
                        alt={productName}
                        onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300";
                        }}
                    />
                </Link>

                <div className="info-wrap">
                    {renderStars(4)}

                    <div className="fix-height">
                        <Link to={`/product-detail/${productId}`} className="title">
                            {productName}
                        </Link>

                        <div className="price-wrap mt-2">
                            {specialPrice ? (
                                <>
                                    <span className="price">{formatVND(specialPrice)}</span>
                                    <small className="text-muted ml-2" style={{ textDecoration: "line-through" }}>
                                        {formatVND(price)}
                                    </small>
                                    {discount ? <small className="text-danger ml-2">-{discount}%</small> : null}
                                </>
                            ) : (
                                <span className="price">{formatVND(price)}</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-block btn-primary btn-sm mt-3 d-flex align-items-center justify-content-center"
                        onClick={handleAddToCart}
                    >
                        <IonIcon icon={cartOutline} className="mr-2" /> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
