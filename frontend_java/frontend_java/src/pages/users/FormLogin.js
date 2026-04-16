import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
    logoFacebook,
    logoGoogle,
    personOutline,
    lockClosedOutline,
    eyeOutline,
    eyeOffOutline,
} from "ionicons/icons";
import { GET_USER_BY_EMAIL, POST_LOGIN } from "../../config/apiService"; // chỉnh path cho đúng

const FormLogin = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        remember: true,
    });

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!form.email.trim() || !form.password) {
            setErrorMsg("Vui lòng nhập email và mật khẩu.");
            return;
        }

        try {
            setLoading(true);
            await POST_LOGIN(form.email.trim(), form.password);
            alert("Đăng nhập thành công!");
            navigate("/", { replace: true });
        } catch (err) {
            const serverMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.";
            setErrorMsg(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: "84vh", backgroundColor: "#f8f9fa" }}>
            <div className="card mx-auto shadow-sm border-0 rounded-lg" style={{ maxWidth: "400px", marginTop: "60px" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4 text-center font-weight-bold">Đăng nhập</h4>

                    {errorMsg ? (
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit}>
                        {/* Social login demo (chưa implement) */}
                        <button
                            type="button"
                            className="btn btn-facebook btn-block mb-2 d-flex align-items-center justify-content-center"
                            onClick={() => alert("Chưa tích hợp Facebook login")}
                        >
                            <IonIcon icon={logoFacebook} className="mr-2" style={{ fontSize: "1.2rem" }} /> Đăng nhập với Facebook
                        </button>

                        <button
                            type="button"
                            className="btn btn-google btn-block mb-4 d-flex align-items-center justify-content-center border"
                            onClick={() => alert("Chưa tích hợp Google login")}
                        >
                            <IonIcon icon={logoGoogle} className="mr-2 text-danger" style={{ fontSize: "1.2rem" }} /> Đăng nhập với Google
                        </button>

                        <div className="text-center mb-3 text-muted small">hoặc sử dụng tài khoản</div>

                        {/* Email */}
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light border-right-0">
                                        <IonIcon icon={personOutline} />
                                    </span>
                                </div>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="form-control border-left-0"
                                    placeholder="Email"
                                    type="email"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light border-right-0">
                                        <IonIcon icon={lockClosedOutline} />
                                    </span>
                                </div>

                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={onChange}
                                    className="form-control border-left-0"
                                    placeholder="Mật khẩu"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="current-password"
                                />

                                <div className="input-group-append">
                                    <button
                                        type="button"
                                        className="input-group-text bg-white border-left-0"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPass((s) => !s)}
                                        aria-label="Toggle password"
                                    >
                                        <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} className="text-muted" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group d-flex justify-content-between align-items-center">
                            <label className="custom-control custom-checkbox mb-0">
                                <input
                                    name="remember"
                                    type="checkbox"
                                    className="custom-control-input"
                                    checked={form.remember}
                                    onChange={onChange}
                                />
                                <div className="custom-control-label"> Ghi nhớ </div>
                            </label>

                            <button type="button" className="btn btn-link p-0 small text-muted">
                                Quên mật khẩu?
                            </button>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <p className="text-center mt-4">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="font-weight-bold">
                    Đăng ký ngay
                </Link>
            </p>
            <br />
            <br />
        </section>
    );
};

export default FormLogin;
