import React from "react";
import { Carousel } from "react-bootstrap";

const Slider = () => {
    return (
        <section className="section-intro pt-3">
            <div className="container">
                <Carousel 
                    id="carousel1_indicator" 
                    className="slider-home-banner shadow-sm rounded overflow-hidden"
                    indicators={true}
                    interval={3000} // Tự động chuyển sau 3 giây
                >
                    {/* Slide 1 */}
                    <Carousel.Item>
                        <img
                            src="/assets/images/banners/banner1.png"
                            className="d-block w-100"
                            alt="First slide"
                            style={{ minHeight: "300px", objectFit: "cover" }}
                        />
                    </Carousel.Item>

                    {/* Slide 2 */}
                    <Carousel.Item>
                        <img
                            src="/assets/images/banners/banner2.png"
                            className="d-block w-100"
                            alt="Second slide"
                            style={{ minHeight: "300px", objectFit: "cover" }}
                        />
                    </Carousel.Item>

                    {/* Slide 3 */}
                    <Carousel.Item>
                        <img
                            src="/assets/images/banners/banner3.png.webp"
                            className="d-block w-100"
                            alt="Third slide"
                            style={{ minHeight: "300px", objectFit: "cover" }}
                        />
                    </Carousel.Item>

                    {/* Slide 4 */}
                    <Carousel.Item>
                        <img
                            src="/assets/images/banners/banner4.png"
                            className="d-block w-100"
                            alt="Fourth slide"
                            style={{ minHeight: "300px", objectFit: "cover" }}
                        />
                    </Carousel.Item>

                    {/* Slide 5 */}
                    <Carousel.Item>
                        <img
                            src="/assets/images/banners/banner5.png"
                            className="d-block w-100"
                            alt="Fifth slide"
                            style={{ minHeight: "300px", objectFit: "cover" }}
                        />
                    </Carousel.Item>
                </Carousel>
            </div>
        </section>
    );
};

export default Slider;