import React, { useEffect } from "react";
import FormLogin from "../pages/users/FormLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Đăng nhập";
        if (localStorage.getItem("jwt-token")) navigate("/", { replace: true });
    }, []);
    return <FormLogin />;
};

export default Login;
