import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
    searchOutline,
    personOutline,
    cartOutline,
    receiptOutline,
    logOutOutline,
    settingsOutline,
} from "ionicons/icons";
import Navbar from "../pages/navbar/Navbar";
import { GET_CATEGORIES, removeToken, removeEmail, getUserEmail, getToken } from "../config/apiService";

const Header = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const menuRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [categories, setCategories] = useState([]);

    // ===== search state =====
    const [searchText, setSearchText] = useState("");

    const toggleMenu = () => setIsMenuOpen((s) => !s);

    /* ================= AUTH ================= */
    const checkAuth = () => {
        const token = getToken();
        setIsLoggedIn(!!token);
        setEmail(getUserEmail() || "");
    };

    /* ================= FETCH CATEGORY ================= */
    const fetchCategories = async () => {
        try {
            const data = await GET_CATEGORIES(0, 100, "categoryId", "asc");
            // NOTE: tuỳ backend categories trả dạng gì
            // nếu bạn trả {content: []} thì giữ như cũ
            const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
            setCategories(list);
        } catch (e) {
            console.error("Lỗi load category:", e);
            setCategories([]);
        }
    };

    useEffect(() => {
        checkAuth();
        fetchCategories();

        const onStorage = () => checkAuth();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    /* ================= SYNC INPUT SEARCH THEO URL (tuỳ chọn) ================= */
    useEffect(() => {
        // nếu đang ở trang /search?q=... thì set lên input luôn
        const q = (searchParams.get("q") || "").trim();
        setSearchText(q);
    }, [searchParams]);

    /* ================= CLICK OUTSIDE ================= */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ================= LOGOUT ================= */
    const handleLogout = () => {
        removeToken();
        removeEmail();
        setUserMenuOpen(false);
        checkAuth();
        alert("Đăng xuất thành công!");
        navigate("/login", { replace: true });
    };

    /* ================= SUBMIT SEARCH ================= */
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        const kw = (searchText || "").trim();
        if (!kw) return; // không tìm nếu rỗng
        navigate(`/search?q=${encodeURIComponent(kw)}`);
    };

    return (
        <header className="section-header sticky-top">
            {/* ================= TOP HEADER ================= */}
            <section className="header-main border-bottom bg-white py-3">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Logo */}
                        <div className="col-lg-3 col-sm-4 col-12">
                            <Link to="/" className="brand-wrap">
                                <img
                                    src={require("../asset/images/logo.png")}
                                    alt="logo"
                                    height={40}
                                />
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="col-lg-5 col-xl-6 col-sm-8 col-12">
                            <form className="search-header" onSubmit={handleSubmitSearch}>
                                <div className="input-group w-100">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Bạn đang tìm gì?"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary px-3" type="submit" aria-label="Search">
                                            <IonIcon icon={searchOutline} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Right icons */}
                        <div className="col-lg-4 col-xl-3 col-12">
                            <div className="d-flex justify-content-end align-items-center mt-3 mt-lg-0">
                                {/* USER */}
                                {!isLoggedIn ? (
                                    <div className="widget-header mr-3">
                                        <Link to="/login" className="widget-view">
                                            <div className="icon-area">
                                                <IonIcon icon={personOutline} />
                                            </div>
                                            <small className="text">Đăng nhập</small>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="widget-header mr-3 position-relative" ref={menuRef}>
                                        <button
                                            className="widget-view btn p-0 border-0 bg-transparent"
                                            onClick={() => setUserMenuOpen((s) => !s)}
                                            type="button"
                                        >
                                            <div className="icon-area">
                                                <IonIcon icon={personOutline} />
                                            </div>
                                            <small className="text">{email || "Tài khoản"}</small>
                                        </button>

                                        {userMenuOpen && (
                                            <div className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
                                                <Link className="dropdown-item" to="/profile" onClick={() => setUserMenuOpen(false)}>
                                                    <IonIcon icon={settingsOutline} className="mr-2" />
                                                    Thông tin cá nhân
                                                </Link>
                                                <button className="dropdown-item text-danger" onClick={handleLogout} type="button">
                                                    <IonIcon icon={logOutOutline} className="mr-2" />
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Orders & Cart */}
                                <div className="widget-header mr-3">
                                    {isLoggedIn && (
                                        <Link to="/orders" className="widget-view">
                                            <IonIcon icon={receiptOutline} />
                                            <small className="text">Đơn hàng</small>
                                        </Link>
                                    )}
                                </div>
                                <div className="widget-header">
                                    <Link to="/cart" className="widget-view">
                                        <IonIcon icon={cartOutline} />
                                        <small className="text">Giỏ hàng</small>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= NAVBAR ================= */}
            <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} categories={categories} />
        </header>
    );
};

export default Header;
