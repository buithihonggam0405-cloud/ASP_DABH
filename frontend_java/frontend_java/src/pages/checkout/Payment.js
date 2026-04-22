import React from 'react';
import { IonIcon } from '@ionic/react';
// Import các icon có thực trong danh sách bạn gửi
import {
    cardOutline,
    helpCircleOutline,
    walletOutline,
    cashOutline,
    personOutline,
    calendarOutline
} from 'ionicons/icons';

const Payment = () => {
    return (
        <div className="card mb-4 shadow-sm border-0 rounded-lg">
            <div className="card-body">
                <h4 className="card-title mb-4 d-flex align-items-center">
                    <IonIcon icon={walletOutline} className="mr-2" /> Thanh toán
                </h4>
                <form role="form" style={{ maxWidth: '450px' }}>
                    <div className="form-group">
                        <label htmlFor="username">Tên trên thẻ</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-white border-right-0">
                                    <IonIcon icon={personOutline} />
                                </span>
                            </div>
                            <input type="text" className="form-control border-left-0" name="username" placeholder="Ex. NGUYEN VAN A" required="" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cardNumber">Số thẻ</label>
                        <div className="input-group">
                            <input type="text" className="form-control border-right-0" name="cardNumber" placeholder="0000 0000 0000 0000" />
                            <div className="input-group-append">
                                <span className="input-group-text bg-white border-left-0">
                                    {/* Vì không có logo Visa/Mastercard, dùng generic icon cardOutline */}
                                    <IonIcon icon={cardOutline} className="text-muted" style={{ fontSize: '1.4rem' }} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Hết hạn</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-white px-2">
                                            <IonIcon icon={calendarOutline} />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="MM/YY" style={{ maxWidth: '120px' }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label data-toggle="tooltip" title="3 số bí mật mặt sau thẻ">
                                    Mã CVV <IonIcon icon={helpCircleOutline} style={{ verticalAlign: 'middle', fontSize: '1rem' }} />
                                </label>
                                <input className="form-control" required="" type="password" placeholder="***" maxLength="3" />
                            </div>
                        </div>
                    </div>

                    <button className="subscribe btn btn-primary btn-block btn-lg shadow-sm mt-3 d-flex justify-content-center align-items-center" type="button">
                        <IonIcon icon={cashOutline} className="mr-2" /> Xác nhận thanh toán
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;