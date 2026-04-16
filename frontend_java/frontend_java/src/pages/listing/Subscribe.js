import React from 'react';
import { IonIcon } from '@ionic/react';
import { mailOutline } from 'ionicons/icons';

const Subscribe = () => {
    return (
        <section className="padding-y-lg bg-light border-top">
            <div className="container">
                <p className="pb-2 text-center h5 font-weight-light">Nhận thông tin xu hướng sản phẩm mới nhất qua email</p>
                <div className="row justify-content-md-center">
                    <div className="col-lg-5 col-sm-8">
                        <form className="form-row align-items-center">
                            <div className="col-8">
                                <input className="form-control" placeholder="Email của bạn" type="email" />
                            </div>
                            <div className="col-4">
                                <button type="submit" className="btn btn-block btn-warning d-flex align-items-center justify-content-center">
                                    <IonIcon icon={mailOutline} className="mr-2" /> Đăng ký
                                </button>
                            </div>
                        </form>
                        <small className="form-text text-muted text-center mt-2">Chúng tôi cam kết bảo mật thông tin của bạn.</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Subscribe;