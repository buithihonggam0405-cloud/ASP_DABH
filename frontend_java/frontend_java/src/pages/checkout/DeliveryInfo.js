import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { airplaneOutline, bicycleOutline, locationOutline, callOutline, mailOutline, personOutline } from 'ionicons/icons';

const DeliveryInfo = () => {
    // State để quản lý lựa chọn giao hàng
    const [deliveryMethod, setDeliveryMethod] = useState('standard');

    return (
        <div className="card mb-4 shadow-sm border-0 rounded-lg">
            <div className="card-body">
                <h4 className="card-title mb-4">Thông tin giao hàng</h4>

                {/* Phần chọn phương thức vận chuyển */}
                <div className="form-row mb-4">
                    <div className="form-group col-sm-6">
                        <div
                            className={`border rounded p-3 cursor-pointer ${deliveryMethod === 'standard' ? 'border-primary bg-light' : ''}`}
                            onClick={() => setDeliveryMethod('standard')}
                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            <label className="custom-control custom-radio mb-0 w-100" style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="dostavka"
                                    className="custom-control-input"
                                    checked={deliveryMethod === 'standard'}
                                    onChange={() => setDeliveryMethod('standard')}
                                />
                                <div className="custom-control-label">
                                    <h6 className="title mb-1 d-flex align-items-center">
                                        <IonIcon icon={bicycleOutline} className="mr-2 text-primary" /> Tiêu chuẩn
                                    </h6>
                                    <p className="text-muted mb-0 small">Miễn phí, giao trong 20 ngày</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <div
                            className={`border rounded p-3 cursor-pointer ${deliveryMethod === 'fast' ? 'border-primary bg-light' : ''}`}
                            onClick={() => setDeliveryMethod('fast')}
                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            <label className="custom-control custom-radio mb-0 w-100" style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="dostavka"
                                    className="custom-control-input"
                                    checked={deliveryMethod === 'fast'}
                                    onChange={() => setDeliveryMethod('fast')}
                                />
                                <div className="custom-control-label">
                                    <h6 className="title mb-1 d-flex align-items-center">
                                        <IonIcon icon={airplaneOutline} className="mr-2 text-danger" /> Hỏa tốc
                                    </h6>
                                    <p className="text-muted mb-0 small">Phí $20, giao trong 5 ngày</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form nhập thông tin */}
                <div className="form-row">
                    <div className="col form-group">
                        <label>Họ</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-white"><IonIcon icon={personOutline} /></span>
                            </div>
                            <input type="text" className="form-control" placeholder="Nguyễn" />
                        </div>
                    </div>
                    <div className="col form-group">
                        <label>Tên</label>
                        <input type="text" className="form-control" placeholder="Văn A" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="col form-group">
                        <label>Email</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-white"><IonIcon icon={mailOutline} /></span>
                            </div>
                            <input type="email" className="form-control" placeholder="example@gmail.com" />
                        </div>
                    </div>
                    <div className="col form-group">
                        <label>Số điện thoại</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-white"><IonIcon icon={callOutline} /></span>
                            </div>
                            <input type="text" className="form-control" placeholder="+84..." />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Quốc gia</label>
                        <select id="inputState" className="form-control" defaultValue="Vietnam">
                            <option>Vietnam</option>
                            <option>United States</option>
                            <option>Russia</option>
                            <option>Uzbekistan</option>
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label>Thành phố</label>
                        <input type="text" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Địa chỉ chi tiết</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-white"><IonIcon icon={locationOutline} /></span>
                        </div>
                        <textarea className="form-control" rows="2" placeholder="Số nhà, tên đường..."></textarea>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DeliveryInfo;