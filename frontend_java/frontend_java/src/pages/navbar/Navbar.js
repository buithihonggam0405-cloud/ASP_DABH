import React from "react";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";

const Navbar = ({ toggleMenu, isMenuOpen, categories = [] }) => {
    return (
        <nav className="navbar navbar-main navbar-expand-lg navbar-light border-bottom py-2">
            <div className="container">
                {/* Mobile toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMenu}
                >
                    <IonIcon icon={menuOutline} style={{ fontSize: "1.5rem" }} />
                </button>

                <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
                    <ul className="navbar-nav">
                        {/* Trang chủ */}
                        <li className="nav-item">
                            <Link className="nav-link pl-0 font-weight-bold" to="/">
                                Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link pl-0 font-weight-bold" to="/listing">
                                Danh sách sản phẩm
                            </Link>
                        </li>

                        {/* Categories từ Header truyền xuống */}
                        {categories.map((c) => (
                            <li className="nav-item" key={c.categoryId}>
                                <Link
                                    className="nav-link"
                                    to={`/category/${c.categoryId}`}
                                >
                                    {c.categoryName}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
