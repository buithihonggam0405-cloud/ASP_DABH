import React, { useEffect, useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import { IonIcon } from '@ionic/react';
import {
    locationOutline,
    createOutline,
    bagCheckOutline,
    heartCircleOutline,
    timeOutline,
    checkmarkDoneOutline,
    calendarOutline
} from 'ionicons/icons';
import { GET_ORDERS_BY_EMAIL, getUserEmail, GET_IMG } from '../../config/apiService';

const ProfileMain = () => {
    const [orders, setOrders] = useState([]);
    const email = getUserEmail();

    useEffect(() => {
        const fetchOrders = async () => {
            if (email) {
                try {
                    const data = await GET_ORDERS_BY_EMAIL(email);
                    setOrders(data?.slice(0, 2) || []);
                } catch (e) {
                    console.error("Lỗi lấy đơn hàng profile:", e);
                }
            }
        };
        fetchOrders();
    }, [email]);

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <ProfileSidebar />
                    <main className="col-md-9">
                        <article className="card mb-3 shadow-sm border-0">
                            <div className="card-body">
                                <figure className="icontext">
                                    <div className="icon">
                                        <div className="rounded-circle img-sm border bg-light d-flex align-items-center justify-content-center">
                                            <IonIcon icon={heartCircleOutline} />
                                        </div>
                                    </div>
                                    <div className="text">
                                        <strong> {email || 'Người dùng'} </strong> <br />
                                        <p className="mb-2 text-muted"> {email} </p>
                                        <a href="#" className="btn btn-light btn-sm px-3">
                                            <IonIcon icon={createOutline} style={{ verticalAlign: 'middle' }} /> Sửa
                                        </a>
                                    </div>
                                </figure>
                                <hr />
                                <p>
                                    <IonIcon icon={locationOutline} className="text-muted mr-2" />
                                    Địa chỉ mặc định: Việt Nam &nbsp;
                                    <a href="#" className="btn-link"> Chỉnh sửa</a>
                                </p>

                                <article className="card-group card-stat mt-4">
                                    <figure className="card bg-light border-0 mr-2 rounded p-3">
                                        <div className="p-2 d-flex align-items-center">
                                            <div className="mr-3 text-primary"><IonIcon icon={bagCheckOutline} size="large" /></div>
                                            <div>
                                                <h4 className="title">{orders.length}</h4>
                                                <span>Đơn hàng</span>
                                            </div>
                                        </div>
                                    </figure>
                                    <figure className="card bg-light border-0 mr-2 rounded p-3">
                                        <div className="p-2 d-flex align-items-center">
                                            <div className="mr-3 text-danger"><IonIcon icon={heartCircleOutline} size="large" /></div>
                                            <div>
                                                <h4 className="title">0</h4>
                                                <span>Yêu thích</span>
                                            </div>
                                        </div>
                                    </figure>
                                    <figure className="card bg-light border-0 rounded p-3">
                                        <div className="p-2 d-flex align-items-center">
                                            <div className="mr-3 text-warning"><IonIcon icon={timeOutline} size="large" /></div>
                                            <div>
                                                <h4 className="title">0</h4>
                                                <span>Đang chờ</span>
                                            </div>
                                        </div>
                                    </figure>
                                </article>
                            </div>
                        </article>

                        <article className="card mb-3 shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Đơn hàng gần đây</h5>
                                <div className="row">
                                    {orders.length > 0 ? orders.map((order) => (
                                        <div className="col-md-6" key={order.id}>
                                            <figure className="itemside mb-3">
                                                <div className="aside">
                                                    <div className="border img-sm rounded bg-light d-flex align-items-center justify-content-center" style={{width: 80, height: 80}}>
                                                        📦
                                                    </div>
                                                </div>
                                                <figcaption className="info">
                                                    <time className="text-muted small">
                                                        <IonIcon icon={calendarOutline} className="mr-1" /> {new Date(order.createdDate).toLocaleDateString()}
                                                    </time>
                                                    <p className="mb-1 font-weight-bold">Đơn hàng #{order.id} </p>
                                                    <span className="text-success small">
                                                        <IonIcon icon={checkmarkDoneOutline} className="mr-1" /> {order.status}
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </div>
                                    )) : <div className="col-12 text-muted">Chưa có đơn hàng nào.</div>}
                                </div>
                                <a href="/orders" className="btn btn-outline-primary btn-block mt-3"> Xem tất cả đơn hàng </a>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProfileMain;