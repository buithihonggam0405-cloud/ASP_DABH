import React from 'react';
import ProfileSidebar from './ProfileSidebar';

const ProfileSeller = () => {
    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <ProfileSidebar />
                    <main className="col-md-9">
                        <article className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title">Kênh Người Bán</h5>
                                <p className="text-muted">Tính năng đang được phát triển.</p>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProfileSeller;