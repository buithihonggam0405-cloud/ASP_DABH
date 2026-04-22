import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <section className="padding-bottom">
            <div className="row">
                <aside className="col-md-6 mb-3 mb-md-0">
                    <div className="card card-banner-lg bg-dark h-100 overlay-gradient">
                        <img src="/assets/images/banners/banner4.png" className="card-img opacity" alt="Thời trang nam" style={{ height: '280px', objectFit: 'cover' }} />
                        <div className="card-img-overlay text-white d-flex flex-column justify-content-end">
                            <h2 className="card-title">Siêu Sale Công Nghệ</h2>
                            <p className="card-text" style={{ maxWidth: '80%' }}>Giảm giá lên đến 50% cho các mẫu điện thoại mới nhất.</p>
                            <div>
                                <Link to="/deals" className="btn btn-light btn-sm font-weight-bold">Khám phá ngay</Link>
                            </div>
                        </div>
                    </div>
                </aside>
                <div className="col-md-6">
                    <div className="card card-banner-lg bg-dark h-100 overlay-gradient">
                        <img src="/assets/images/banners/banner5.png" className="card-img opacity" alt="Phụ kiện" style={{ height: '280px', objectFit: 'cover' }} />
                        <div className="card-img-overlay text-white d-flex flex-column justify-content-end">
                            <h2 className="card-title">Combo Phụ Kiện</h2>
                            <p className="card-text" style={{ maxWidth: '80%' }}>Mua laptop tặng kèm chuột không dây chính hãng.</p>
                            <div>
                                <Link to="/deals" className="btn btn-light btn-sm font-weight-bold">Xem chi tiết</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner;