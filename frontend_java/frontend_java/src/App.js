import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Import Routes và Route

// Import CSS
import "./asset/sass/bootstrap.scss";
import "./asset/sass/responsive.scss";
import "./asset/sass/_variables-custom.scss";
import "./asset/sass/ui.scss";
import "./asset/css/modern-ui.css";

// Import Components
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Home from './layouts/Home';
import Listing from './layouts/Listing';
import Detail from './layouts/Detail';
import Category from './layouts/Category';
import Deals from './layouts/Deals';
import Checkout from './layouts/Checkout';
import ProfileMain from './pages/profile/ProfileMain';
import ProfileAddress from './pages/profile/ProfileAddress';
import Order from './layouts/Order';
import ProfileWishlist from './pages/profile/ProfileWishlist';
import ProfileSeller from './pages/profile/ProfileSeller';
import ProfileSetting from './pages/profile/ProfileSetting';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Cart from './layouts/Cart';
import ForgotPassword from './pages/users/ForgotPassword';
import NotFound from './pages/error/NotFound';
import OrderSuccess from './pages/checkout/OrderSuccess';
import Contact from './pages/info/Contact';
import PaymentReturn from './pages/checkout/PaymentReturn';
import SearchListing from './layouts/SearchListing';
import OrderDetail from './layouts/OrderDetail';
import ChatWidget from './layouts/ChatbotAI';

function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />

        <Route path="/product-detail/:productId" element={<Detail />} />
        <Route path="/search" element={<SearchListing />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment-return" element={<PaymentReturn />} />

        <Route path="/profile" element={<ProfileMain />} />
        <Route path="/profile/address" element={<ProfileAddress />} />
        <Route path="/profile/wishlist" element={<ProfileWishlist />} />
        <Route path="/profile/seller" element={<ProfileSeller />} />
        <Route path="/profile/setting" element={<ProfileSetting />} />

        <Route path="/orders" element={<Order />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatWidget />
      <Footer />
    </div>
  );
}

export default App;