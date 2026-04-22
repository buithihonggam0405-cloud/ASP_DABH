import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { cartOutline, pricetagOutline } from 'ionicons/icons';

const DealList = () => {
    // Component con hiển thị từng item để code gọn hơn
    const DealItem = ({ img, title, price, oldPrice, save }) => (
        <div className="col-xl-3 col-lg-4 col-md-6 col-6 mb-4">
            <article className="card card-product-grid shadow-sm h-100 border-0">
                <Link to="/product-detail" className="img-wrap" style={{ height: '200px' }}>
                    <span className="badge badge-danger mr-1 d-flex align-items-center" style={{ position: 'absolute', top: 10, left: 10 }}>
                        <IonIcon icon={pricetagOutline} className="mr-1" style={{ fontSize: '0.8rem' }} /> -{save}%
                    </span>
                    <img src={img} alt={title} style={{ objectFit: 'contain' }} />
                </Link>
                <div className="info-wrap p-3 d-flex flex-column">
                    <Link to="/product-detail" className="title text-truncate font-weight-bold text-dark mb-2">
                        {title}
                    </Link>
                    <div className="price-wrap mb-3">
                        <span className="price text-danger font-weight-bold h5 mr-2">${price}</span>
                        <del className="price-old text-muted small">${oldPrice}</del>
                    </div>

                    {/* Nút Order đẩy xuống dưới cùng của card */}
                    <div className="mt-auto">
                        <Link to="/cart" className="btn btn-block btn-outline-primary d-flex align-items-center justify-content-center">
                            <IonIcon icon={cartOutline} className="mr-2" /> Đặt hàng
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );

    return (
        <div className="row">
            <DealItem
                img={require('../../asset/images/items/1.jpg')}
                title="Đồng hồ thông minh Apple Watch" price="45" oldPrice="90" save="50"
            />
            <DealItem
                img={require('../../asset/images/items/3.jpg')}
                title="Áo khoác nam thời trang" price="45" oldPrice="90" save="20"
            />
            <DealItem
                img={require('../../asset/images/items/4.jpg')}
                title="Sách hướng dẫn ReactJS" price="45" oldPrice="90" save="10"
            />
            <DealItem
                img={require('../../asset/images/items/5.jpg')}
                title="Túi xách du lịch chống nước" price="45" oldPrice="90" save="15"
            />

            {/* Hàng 2 */}
            <DealItem
                img={require('../../asset/images/items/7.jpg')}
                title="Laptop Gaming Asus ROG" price="45" oldPrice="90" save="30"
            />
            <DealItem
                img={require('../../asset/images/items/8.jpg')}
                title="Tai nghe Bluetooth Sony" price="65" oldPrice="190" save="40"
            />
            <DealItem
                img={require('../../asset/images/items/9.jpg')}
                title="Tai nghe chụp tai JBL" price="245" oldPrice="390" save="10"
            />
            <DealItem
                img={require('../../asset/images/items/10.jpg')}
                title="Loa Bluetooth Mini" price="45" oldPrice="90" save="25"
            />
        </div>
    );
};

export default DealList;