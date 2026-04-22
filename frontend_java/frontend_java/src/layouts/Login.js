import React, { useEffect } from "react";
import FormLogin from "../pages/users/FormLogin";
import { useNavigate } from "react-router-dom";
import { getToken } from "../config/apiService";

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Đăng nhập";
        if (getToken()) navigate("/", { replace: true });
    }, []);
    return <FormLogin />;
};

export default Login;
