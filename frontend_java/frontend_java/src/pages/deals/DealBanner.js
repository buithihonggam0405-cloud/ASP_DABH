import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowForwardOutline, watchOutline } from 'ionicons/icons';

const DealBanner = () => {
    return (
        <div className="row">
            <div className="col-md-8 mb-3 mb-md-0">
                <div className="card-banner overlay-gradient rounded-lg shadow-sm h-100"
                    style={{
                        minHeight: '320px',
                        backgroundImage: `url(${require('../../asset/images/banners/banner1.jpg')})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div className="card-img-overlay white d-flex flex-column justify-content-end p-4">
                        <h3 className="card-title font-weight-bold">Combo Tiết Kiệm chỉ 99k <br /> Mua sắm thả ga </h3>
                        <p className="card-text" style={{ maxWidth: '400px' }}>
                            Săn ngay các deal hời nhất trong tháng này. Số lượng có hạn, đừng bỏ lỡ!
                        </p>
                        <div>
                            <Link to="/deals" className="btn btn-warning btn-lg font-weight-bold shadow-sm">
                                Xem ngay <IonIcon icon={arrowForwardOutline} style={{ verticalAlign: 'middle' }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card-banner rounded-lg shadow-sm h-100"
                    style={{
                        minHeight: '320px',
                        backgroundImage: `url(${require('../../asset/images/banners/banner8.jpg')})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <article className="caption bottom p-3" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)' }}>
                        <h5 className="card-title text-primary d-flex align-items-center">
                            <IonIcon icon={watchOutline} className="mr-2" /> Đồng hồ hiệu
                        </h5>
                        <p className="small mb-0 text-muted">Đẳng cấp doanh nhân, nâng tầm phong cách của bạn.</p>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default DealBanner;