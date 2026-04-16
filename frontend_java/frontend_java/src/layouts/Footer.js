import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    locationOutline,
    mailOutline,
    callOutline,
    timeOutline,
    logoFacebook,
    logoTwitter,
    logoInstagram,
    logoYoutube
} from 'ionicons/icons';

const Footer = () => {
    return (
        <footer className="section-footer bg-secondary text-white">
            <div className="container">
                <section className="footer-top padding-y-lg">
                    <div className="row">
                        <aside className="col-md-4 col-12">
                            <article className="mr-md-4">
                                <h5 className="title">Liên hệ</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                <ul className="list-icon">
                                    <li className="d-flex align-items-center mb-2">
                                        <IonIcon icon={locationOutline} className="mr-2" style={{ fontSize: '1.2rem' }} />
                                        <span>542 Fake Street, Cityname 10021</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                        <IonIcon icon={mailOutline} className="mr-2" style={{ fontSize: '1.2rem' }} />
                                        <span>info@example.com</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                        <IonIcon icon={callOutline} className="mr-2" style={{ fontSize: '1.2rem' }} />
                                        <span>(800) 060-0730</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                        <IonIcon icon={timeOutline} className="mr-2" style={{ fontSize: '1.2rem' }} />
                                        <span>Mon-Sat 10:00pm - 7:00pm</span>
                                    </li>
                                </ul>
                            </article>
                        </aside>
                        <aside className="col-md col-6">
                            <h5 className="title">Thông tin</h5>
                            <ul className="list-unstyled">
                                <li> <Link to="/about">Về chúng tôi</Link></li>
                                <li> <Link to="/career">Tuyển dụng</Link></li>
                                <li> <Link to="/store">Tìm cửa hàng</Link></li>
                                <li> <Link to="/rules">Điều khoản</Link></li>
                                <li> <Link to="/sitemap">Sitemap</Link></li>
                            </ul>
                        </aside>
                        <aside className="col-md col-6">
                            <h5 className="title">Tài khoản</h5>
                            <ul className="list-unstyled">
                                <li> <Link to="/contact">Liên hệ hỗ trợ</Link></li>
                                <li> <Link to="/refund">Hoàn tiền</Link></li>
                                <li> <Link to="/orders">Trạng thái đơn</Link></li>
                                <li> <Link to="/shipping">Giao hàng</Link></li>
                            </ul>
                        </aside>
                        <aside className="col-md-4 col-12">
                            <h5 className="title">Đăng ký nhận tin</h5>
                            <p>Nhận thông báo về các ưu đãi mới nhất.</p>
                            <form className="form-inline mb-3">
                                <input type="text" placeholder="Email" className="border-0 w-auto form-control" name="" />
                                <button className="btn ml-2 btn-warning"> Đăng ký</button>
                            </form>
                            <p className="text-white-50 mb-2">Theo dõi chúng tôi</p>
                            <div>
                                <a href="#" className="btn btn-icon btn-outline-light mr-1"><IonIcon icon={logoFacebook} /></a>
                                <a href="#" className="btn btn-icon btn-outline-light mr-1"><IonIcon icon={logoTwitter} /></a>
                                <a href="#" className="btn btn-icon btn-outline-light mr-1"><IonIcon icon={logoInstagram} /></a>
                                <a href="#" className="btn btn-icon btn-outline-light"><IonIcon icon={logoYoutube} /></a>
                            </div>
                        </aside>
                    </div>
                </section>
                <section className="footer-bottom text-center">
                    <p className="text-muted"> &copy; 2024 Company name, All rights reserved </p>
                </section>
            </div>
        </footer>
    );
}

export default Footer;