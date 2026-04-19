
import Slider from '../pages/home/Slider';
import Recommended from '../pages/home/Recommended';
import Banner from '../pages/home/Banner';
import Daily from '../pages/home/Daily';
import BannerBottom from '../pages/home/BannerBottom';
import { useEffect, useState } from 'react';
import { GET_PRODUCT, GET_PRODUCTS_BY_CATEGORY } from '../config/apiService';

const Home = () => {
    useEffect(() => {
        document.title = 'Home Page';
    }, []);

    const [recommendedData, setRecommendedData] = useState([]);

    const fetchDataRecommended = async () => {
        try {
            const data = await GET_PRODUCT(0, 4, "productId", "desc");
            setRecommendedData(data?.products ?? []);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
            setRecommendedData([]);
        }
    };

    const [productCategory, setProductCategory] = useState([]);

    const fetchDataProductCategory = async () => {
        try {
            const data = await GET_PRODUCTS_BY_CATEGORY(2, 0, 4, "productId", "desc");
            setProductCategory(data?.products ?? []);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
            setProductCategory([]);
        }
    };

    const [productCategory2, setProductCategory2] = useState([]);

    const fetchDataProductCategory2 = async () => {
        try {
            const data = await GET_PRODUCTS_BY_CATEGORY(3, 0, 4, "productId", "desc");
            setProductCategory2(data?.products ?? []);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
            setProductCategory2([]);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Lấy sản phẩm mới
                const resNew = await GET_PRODUCT(1, 4);
                setRecommendedData(resNew?.products || []);

                // Lấy Điện thoại (Giả định ID 1)
                const resPhone = await GET_PRODUCTS_BY_CATEGORY(1, 1, 4);
                setProductCategory(resPhone?.products || []);

                // Lấy Laptop (Giả định ID 2)
                const resLaptop = await GET_PRODUCTS_BY_CATEGORY(2, 1, 4);
                setProductCategory2(resLaptop?.products || []);

            } catch (error) {
                console.error("Lỗi lấy sản phẩm tổng quát:", error);
            }
        };
        fetchAll();
    }, []);
    return (
        <>
            <Slider />
            <div className="container">
                <Recommended products={recommendedData} title="Sản phẩm mới" />
                <Recommended products={productCategory} title="Điện thoại" />
                <Recommended products={productCategory2} title="Laptop" />
                <Banner />
                <Daily />
                <BannerBottom />
            </div>
        </>
    );
}

export default Home;