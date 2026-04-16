import React, { useEffect } from "react";
import FormRegister from "../pages/users/FormRegister";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Đăng ký";
        if (localStorage.getItem("jwt-token")) navigate("/", { replace: true });
    }, []);
    return <FormRegister />;
};

export default Register;
