import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { homeOutline } from 'ionicons/icons';

const NotFound = () => {
    return (
        <section className="section-content padding-y bg-white" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="container text-center">
                <h1 className="display-1 text-muted font-weight-bold">404</h1>
                <h4 className="mb-4">Oops! Không tìm thấy trang này.</h4>
                <p className="text-muted mb-4">
                    Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc đường dẫn không đúng.
                </p>
                <Link to="/" className="btn btn-primary btn-lg shadow-sm">
                    <IonIcon icon={homeOutline} className="mr-2" /> Quay lại trang chủ
                </Link>
            </div>
        </section>
    );
}
export default NotFound;