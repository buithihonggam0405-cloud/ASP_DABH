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
import { GET_CATEGORIES, removeToken, removeEmail, getUserEmail, getToken, GET_CART_BY_USER_ID } from "../config/apiService";

const Header = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const menuRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [categories, setCategories] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    // ===== search state =====
    const [searchText, setSearchText] = useState("");

    const toggleMenu = () => setIsMenuOpen((s) => !s);

    /* ================= AUTH ================= */
    const checkAuth = () => {
        const token = getToken();
        setIsLoggedIn(!!token);
        setEmail(getUserEmail() || "");
    };

    /* ================= FETCH CART COUNT ================= */
    const fetchCartCount = async () => {
        const email = getUserEmail();
        if (!email) {
            setCartCount(0);
            return;
        }
        try {
            const res = await GET_CART_BY_USER_ID(email);
            const items = res?.items || res?.data?.items || [];
            const count = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
            setCartCount(count);
        } catch (e) {
            console.error("Lỗi lấy số lượng giỏ hàng:", e);
            setCartCount(0);
        }
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
        fetchCartCount();

        const onStorage = () => {
            checkAuth();
            fetchCartCount();
        };
        
        window.addEventListener("storage", onStorage);
        window.addEventListener("cartUpdated", fetchCartCount);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("cartUpdated", fetchCartCount);
        };
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
                        <div className="col-lg-2 col-md-2 col-12">
                            <Link to="/" className="brand-wrap">
                                <img
                                    src={require("../asset/images/logo.png")}
                                    alt="logo"
                                    height={40}
                                />
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="col-lg-6 col-md-6 col-12">
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
                        <div className="col-lg-4 col-md-4 col-12">
                            <div className="d-flex justify-content-end align-items-center mt-3 mt-lg-0">
                                {/* USER / ACCOUNT */}
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
                                            className="widget-view btn p-0 border-0 bg-transparent d-flex flex-column align-items-center"
                                            onClick={() => setUserMenuOpen((s) => !s)}
                                            type="button"
                                        >
                                            <div className="icon-area">
                                                <IonIcon icon={personOutline} />
                                            </div>
                                            <small className="text text-truncate" style={{ maxWidth: '80px' }}>
                                                {email.split('@')[0] || "Tài khoản"}
                                            </small>
                                        </button>

                                        {userMenuOpen && (
                                            <div className="dropdown-menu show shadow-sm" style={{ right: 0, left: "auto", borderRadius: '8px', marginTop: '10px', minWidth: '180px' }}>
                                                <div className="dropdown-item-text text-muted small border-bottom mb-1 pb-2">
                                                    Xin chào, <br/><b className="text-dark">{email}</b>
                                                </div>
                                                <Link className="dropdown-item d-flex align-items-center py-2" to="/profile" onClick={() => setUserMenuOpen(false)}>
                                                    <IonIcon icon={settingsOutline} className="mr-2" style={{fontSize: '1.2rem'}} />
                                                    Thông tin cá nhân
                                                </Link>
                                                <button className="dropdown-item text-danger d-flex align-items-center py-2" onClick={handleLogout} type="button">
                                                    <IonIcon icon={logOutOutline} className="mr-2" style={{fontSize: '1.2rem'}} />
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ORDERS (Only when logged in) */}
                                {isLoggedIn && (
                                    <div className="widget-header mr-3">
                                        <Link to="/orders" className="widget-view">
                                            <div className="icon-area">
                                                <IonIcon icon={receiptOutline} />
                                            </div>
                                            <small className="text">Đơn hàng</small>
                                        </Link>
                                    </div>
                                )}

                                {/* CART */}
                                <div className="widget-header">
                                    <Link to="/cart" className="widget-view">
                                        <div className="icon-area" style={{ position: 'relative', display: 'inline-block' }}>
                                            <IonIcon icon={cartOutline} />
                                            {cartCount > 0 && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-8px',
                                                    backgroundColor: '#ff0000',
                                                    color: '#ffffff',
                                                    borderRadius: '50%',
                                                    width: '15px',
                                                    height: '15px',
                                                    fontSize: '9px',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid white',
                                                    zIndex: 10
                                                }}>
                                                    {cartCount}
                                                </span>
                                            )}
                                        </div>
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
