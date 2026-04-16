import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { mailOutline, arrowBackOutline } from 'ionicons/icons';

const ForgotPassword = () => {
    return (
        <section className="section-content padding-y" style={{ minHeight: '70vh' }}>
            <div className="card mx-auto shadow-sm border-0 rounded-lg" style={{ maxWidth: '400px', marginTop: '60px' }}>
                <div className="card-body text-center">
                    <h4 className="card-title mb-4">Quên mật khẩu?</h4>
                    <p className="text-muted mb-4">Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
                    <form>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light border-right-0">
                                        <IonIcon icon={mailOutline} />
                                    </span>
                                </div>
                                <input name="" className="form-control border-left-0" placeholder="Email đăng ký" type="email" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Gửi yêu cầu </button>
                        </div>
                    </form>
                    <Link to="/login" className="btn btn-light mt-2 btn-sm">
                        <IonIcon icon={arrowBackOutline} className="mr-1" /> Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </section>
    );
};
export default ForgotPassword;