const Slider = () => {
    return (
        <section className="section-intro pt-3">
            <div className="container">
                <div id="carousel1_indicator" className="slider-home-banner carousel slide shadow-sm rounded overflow-hidden" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#carousel1_indicator" data-slide-to="0" className="active"></li>
                        <li data-target="#carousel1_indicator" data-slide-to="1"></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/assets/images/banners/banner1.png" className="d-block w-100" alt="First slide" style={{ minHeight: '300px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="/assets/images/banners/banner2.png" className="d-block w-100" alt="Second slide" style={{ minHeight: '300px', objectFit: 'cover' }} />
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carousel1_indicator" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carousel1_indicator" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Slider;