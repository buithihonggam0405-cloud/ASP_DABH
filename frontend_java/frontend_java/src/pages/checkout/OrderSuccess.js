import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, homeOutline, bagCheckOutline } from 'ionicons/icons';

const OrderSuccess = () => {
    return (
        <section className="section-content padding-y bg-light" style={{ minHeight: '80vh' }}>
            <div className="container">
                <div className="card shadow-sm border-0 text-center mx-auto" style={{ maxWidth: '600px', marginTop: '50px' }}>
                    <div className="card-body p-5">
                        <div className="mb-4 text-success">
                            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '80px' }} />
                        </div>
                        <h3 className="card-title mb-4">Đặt hàng thành công!</h3>
                        <p className="text-muted mb-4">
                            Cảm ơn bạn đã mua sắm. Đơn hàng <strong>#123456</strong> của bạn đang được xử lý. <br />
                            Chúng tôi đã gửi email xác nhận đến hộp thư của bạn.
                        </p>

                        <div className="d-flex justify-content-center">
                            <Link to="/profile/orders" className="btn btn-outline-primary mr-2">
                                <IonIcon icon={bagCheckOutline} className="mr-2" /> Xem đơn hàng
                            </Link>
                            <Link to="/" className="btn btn-primary">
                                <IonIcon icon={homeOutline} className="mr-2" /> Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default OrderSuccess;