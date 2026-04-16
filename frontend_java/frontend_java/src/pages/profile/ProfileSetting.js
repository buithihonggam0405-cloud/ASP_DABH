import React from 'react';
import ProfileSidebar from './ProfileSidebar';

const ProfileSetting = () => {
    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <ProfileSidebar />
                    <main className="col-md-9">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <form className="row">
                                    <div className="col-md-9">
                                        <div className="form-row">
                                            <div className="col form-group">
                                                <label>Tên</label>
                                                <input type="text" className="form-control" defaultValue="Vosidiy" />
                                            </div>
                                            <div className="col form-group">
                                                <label>Email</label>
                                                <input type="email" className="form-control" defaultValue="vosidiy@gmail.com" />
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

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Zip Code</label>
                                                <input type="text" className="form-control" defaultValue="123009" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Số điện thoại</label>
                                                <input type="text" className="form-control" defaultValue="+123456789" />
                                            </div>
                                        </div>

                                        <button className="btn btn-primary mr-2">Lưu thay đổi</button>
                                        <button className="btn btn-light border">Đổi mật khẩu</button>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center">
                                            <img src={require('../../asset/images/avatars/avatar1.jpg')} className="img-md rounded-circle border mb-3" alt="User" />
                                            <button className="btn btn-sm btn-outline-secondary">Đổi ảnh</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProfileSetting;