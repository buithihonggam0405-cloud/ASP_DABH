import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
    mailOutline,
    lockClosedOutline,
    locationOutline,
    globeOutline,
    personOutline,
} from "ionicons/icons";
import { POST_ADD } from "../../config/apiService"; // chỉnh path cho đúng

const FormRegister = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        street: "",
        buildingName: "",
        city: "",
        state: "",
        country: "Vietnam",
        pincode: "",
        agree: true,
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const roleAdmin = useMemo(
        () => [{ roleId: 2, roleName: "ADMIN" }],
        []
    );

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return "Vui lòng nhập họ và tên.";
        if (!form.email.trim()) return "Vui lòng nhập email.";
        if (!form.password) return "Vui lòng nhập mật khẩu.";
        if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
        if (form.password !== form.confirmPassword) return "Mật khẩu nhập lại không khớp.";
        if (!form.agree) return "Bạn cần đồng ý điều khoản sử dụng.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        const msg = validate();
        if (msg) {
            setErrorMsg(msg);
            return;
        }

        const payload = {
            userId: 0,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            mobileNumber: form.mobileNumber.trim(),
            email: form.email.trim(),
            password: form.password,
            roles: roleAdmin,
            address: {
                addressId: 0,
                street: form.street.trim(),
                buildingName: form.buildingName.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                country: form.country,
                pincode: form.pincode.trim(),
            },
        };

        try {
            setLoading(true);
            await POST_ADD("register", payload);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");

            navigate("/login", { replace: true });
        } catch (err) {
            const serverMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Đăng ký thất bại. Vui lòng thử lại.";
            setErrorMsg(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-content padding-y" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="card mx-auto shadow-sm border-0 rounded-lg" style={{ maxWidth: "550px", marginTop: "40px" }}>
                <article className="card-body">
                    <header className="mb-4 text-center">
                        <h4 className="card-title font-weight-bold">Đăng ký tài khoản</h4>
                        <small className="text-muted">Điền thông tin bên dưới để tạo tài khoản mới</small>
                    </header>

                    {errorMsg ? (
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="col form-group">
                                <label>Họ</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light">
                                            <IonIcon icon={personOutline} />
                                        </span>
                                    </div>
                                    <input
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={onChange}
                                        type="text"
                                        className="form-control"
                                        placeholder="Nguyễn"
                                    />
                                </div>
                            </div>

                            <div className="col form-group">
                                <label>Tên</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={onChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="Văn A"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                name="mobileNumber"
                                value={form.mobileNumber}
                                onChange={onChange}
                                type="text"
                                className="form-control"
                                placeholder="090xxxxxxx"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light">
                                        <IonIcon icon={mailOutline} />
                                    </span>
                                </div>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    type="email"
                                    className="form-control"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <small className="form-text text-muted">Chúng tôi cam kết bảo mật email của bạn.</small>
                        </div>

                        {/* ADDRESS */}
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Thành phố</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light">
                                            <IonIcon icon={locationOutline} />
                                        </span>
                                    </div>
                                    <input name="city" value={form.city} onChange={onChange} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Quốc gia</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light">
                                            <IonIcon icon={globeOutline} />
                                        </span>
                                    </div>
                                    <select name="country" value={form.country} onChange={onChange} className="form-control">
                                        <option value="Vietnam">Vietnam</option>
                                        <option value="United States">United States</option>
                                        <option value="India">India</option>
                                        <option value="Russia">Russia</option>
                                        <option value="Uzbekistan">Uzbekistan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Đường / Street</label>
                                <input
                                    name="street"
                                    value={form.street}
                                    onChange={onChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="123 Lê Lợi"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Tòa nhà / Building</label>
                                <input
                                    name="buildingName"
                                    value={form.buildingName}
                                    onChange={onChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="Chung cư ABC"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Tỉnh / State</label>
                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={onChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="TP. HCM"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Mã bưu chính</label>
                                <input
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={onChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="700000"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Mật khẩu</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light">
                                            <IonIcon icon={lockClosedOutline} />
                                        </span>
                                    </div>
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={onChange}
                                        className="form-control"
                                        type="password"
                                    />
                                </div>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Nhập lại mật khẩu</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light">
                                            <IonIcon icon={lockClosedOutline} />
                                        </span>
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={onChange}
                                        className="form-control"
                                        type="password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                                {loading ? "Đang đăng ký..." : "Đăng ký"}
                            </button>
                        </div>

                        <div className="form-group text-center">
                            <label className="custom-control custom-checkbox">
                                <input
                                    name="agree"
                                    type="checkbox"
                                    className="custom-control-input"
                                    checked={form.agree}
                                    onChange={onChange}
                                />
                                <div className="custom-control-label">
                                    Tôi đồng ý với <a href="#">điều khoản sử dụng</a>
                                </div>
                            </label>
                        </div>

                        {/* Hiển thị role đang gửi đi */}
                        <div className="text-center text-muted" style={{ fontSize: 12 }}>
                            Role mặc định: <b>ADMIN (roleId: 2)</b>
                        </div>
                    </form>
                </article>
            </div>

            <p className="text-center mt-4">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-weight-bold">
                    Đăng nhập
                </Link>
            </p>
            <br />
            <br />
        </section>
    );
};

export default FormRegister;
