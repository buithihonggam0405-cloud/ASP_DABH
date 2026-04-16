import React from 'react';
import { IonIcon } from '@ionic/react';
import { locationOutline, callOutline, mailOutline, sendOutline } from 'ionicons/icons';

const Contact = () => {
    return (
        <section className="section-content padding-y bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h4 className="card-title mb-4">Gửi tin nhắn cho chúng tôi</h4>
                                <form>
                                    <div className="form-row">
                                        <div className="col form-group">
                                            <label>Họ tên</label>
                                            <input type="text" className="form-control" placeholder="" />
                                        </div>
                                        <div className="col form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Nội dung</label>
                                        <textarea className="form-control" rows="4"></textarea>
                                    </div>
                                    <button className="btn btn-primary btn-block">
                                        <IonIcon icon={sendOutline} className="mr-2" /> Gửi ngay
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <aside className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="mb-3">Thông tin liên hệ</h5>
                                <p>
                                    <IonIcon icon={locationOutline} className="mr-2 text-primary" />
                                    Tòa nhà ABC, Phường Bến Nghé, Quận 1, TP.HCM
                                </p>
                                <p>
                                    <IonIcon icon={callOutline} className="mr-2 text-primary" />
                                    +84 909 123 456
                                </p>
                                <p>
                                    <IonIcon icon={mailOutline} className="mr-2 text-primary" />
                                    support@ecommerce.com
                                </p>
                                <hr />
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=..."
                                    width="100%" height="200" frameBorder="0" style={{ border: 0 }} allowFullScreen="" aria-hidden="false" tabIndex="0"
                                    title="map"
                                ></iframe>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
export default Contact;