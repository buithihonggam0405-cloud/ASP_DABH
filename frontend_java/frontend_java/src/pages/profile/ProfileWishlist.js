import React from 'react';
import ProfileSidebar from './ProfileSidebar';

const ProfileWishlist = () => {
    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <ProfileSidebar />
                    <main className="col-md-9">
                        <article className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title">Sản phẩm yêu thích</h5>
                                <p className="text-muted">Bạn chưa có sản phẩm yêu thích nào.</p>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProfileWishlist;