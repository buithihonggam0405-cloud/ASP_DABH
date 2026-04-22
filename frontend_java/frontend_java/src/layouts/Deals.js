import React, { Component } from 'react';
import DealDescription from '../pages/deals/DealDescription';
import DealBanner from '../pages/deals/DealBanner';
import DealList from '../pages/deals/DealList';

class Deals extends Component {
    render() {
        return (
            <>
                <DealDescription />
                <section className="section-content bg-white padding-y">
                    <div className="container">
                        <DealBanner />
                        <br />
                        <DealList />
                    </div>
                </section>
            </>
        );
    }
}

export default Deals;