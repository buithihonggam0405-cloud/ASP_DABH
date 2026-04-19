import React, { useEffect } from "react";
import FormRegister from "../pages/users/FormRegister";
import { useNavigate } from "react-router-dom";
import { getToken } from "../config/apiService";

const Register = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Đăng ký";
        if (getToken()) navigate("/", { replace: true });
    }, []);
    return <FormRegister />;
};

export default Register;
