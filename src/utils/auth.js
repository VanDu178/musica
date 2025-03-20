import Cookies from "js-cookie";
import axiosInstance from "../config/axiosConfig";


const login = async (dataLogin) => {
    try {
        const response = await axiosInstance.post("/auth/login/", dataLogin);

        if (response.status === 200) {
            Cookies.set("access_token", response.data.access, { expires: 0.02 });
            Cookies.set("refresh_token", response.data.refresh, { expires: 7 });
            return response;
        }
    } catch (error) {
        return error;
    }
};

const googleLogin = async (token_id) => {
    try {
        const response = await axiosInstance.post("/auth/login/google/", {
            access_token: token_id,
        });

        if (response.status === 200) {
            // Lưu token vào cookie
            Cookies.set("access_token", response.data.access, { expires: 0.02 });
            Cookies.set("refresh_token", response.data.refresh, { expires: 7 });

            // Trả về thông báo thành công
            return response;
        }
    } catch (error) {
        return error;
    }
};

const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
};

const signup = async (userData) => {
    try {
        const response = await axiosInstance.post("/auth/register/", userData);

        if (response.status === 201) {
            return response;
        }
    } catch (error) {
        return error;
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await axiosInstance.post("/auth/password-reset/", {
            email,
        });

        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        return error;
    };
}
// ✅ Export đúng cách
export default {
    login,
    googleLogin,
    logout,
    signup,
    forgotPassword,
};


