import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { flashOutline, homeOutline, chevronForwardOutline } from 'ionicons/icons';

const DealDescription = () => {
    return (
        <section className="section-pagetop bg-light">
            <div className="container">
                <h2 className="title-page d-flex align-items-center text-danger">
                    <IonIcon icon={flashOutline} className="mr-2" />
                    Săn Deal Hot & Khuyến Mãi
                </h2>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 pl-0 bg-transparent">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-muted"><IonIcon icon={homeOutline} style={{ verticalAlign: '-2px' }} /></Link>
                        </li>
                        <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
                            <IonIcon icon={chevronForwardOutline} className="mx-1 text-muted" style={{ fontSize: '0.8rem' }} />
                            Khuyến mãi
                        </li>
                    </ol>
                </nav>
            </div>
        </section>
    );
};

export default DealDescription;