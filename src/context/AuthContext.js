import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../config/axiosConfig";
import { useTranslation } from "react-i18next";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (dataLogin) => {
    try {
      const response = await axiosInstance.post("/auth/login/", dataLogin);

      if (response.status === 200) {
        Cookies.set("access_token", response.data.access, { expires: 0.02 });
        Cookies.set("refresh_token", response.data.refresh, { expires: 7 });
        setIsLoggedIn(true);
        return { success: true, message: t("messages.loginSuccess") }; // Thông báo khi đăng nhập thành công
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error_code
      ) {
        const errorCode = error.response.data.error_code;

        // Ánh xạ mã lỗi từ backend sang thông báo ngôn ngữ
        const errorMessages = {
          ACCOUNT_NOT_ACTIVATED: t("messages.accountNotActivated"),
          INVALID_CREDENTIALS: t("messages.invalidCredentials"),
        };

        return {
          success: false,
          message: errorMessages[errorCode] || t("messages.loginFailed"),
        };
      }

      // Trường hợp lỗi không xác định
      return {
        success: false,
        message: t("messages.errorOccurred"),
      };
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
        setIsLoggedIn(true);

        // Trả về thông báo thành công
        return { success: true, message: t("messages.loginSuccess") };
      }
    } catch (error) {
      // Kiểm tra nếu có phản hồi lỗi từ server
      if (error.response && error.response.data) {
        const errorCode = error.response.data.error_code;

        // Ánh xạ mã lỗi từ backend sang thông báo ngôn ngữ
        const errorMessages = {
          ACCESS_TOKEN_REQUIRED: t("messages.accessTokenRequired"),
          INVALID_GOOGLE_TOKEN: t("messages.invalidGoogleToken"),
          EMAIL_ALREADY_EXISTS: t("messages.emailAlreadyExists"),
          ACCOUNT_NOT_ACTIVATED: t("messages.accountNotActivated"),
          INVALID_TOKEN: t("messages.invalidToken"),
        };

        // Trả về thông báo lỗi tương ứng
        return {
          success: false,
          message: errorMessages[errorCode] || t("messages.loginFailed"),
        };
      }

      // Trường hợp lỗi không xác định
      return {
        success: false,
        message: t("messages.errorOccurred"),
      };
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsLoggedIn(false);
  };

  const signup = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register/", userData);

      if (response.status === 201) {
        return {
          success: true,
          message: t("messages.signupSuccess"), // Thông báo khi đăng ký thành công
        };
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error_code
      ) {
        const errorCode = error.response.data.error_code;
        // Ánh xạ mã lỗi từ backend sang thông báo ngôn ngữ
        const errorMessages = {
          EMAIL_ALREADY_EXISTS: t("messages.emailAlreadyExists"),
          USERNAME_ALREADY_EXISTS: t("messages.usernameAlreadyExists"),
          INVALID_DATA: t("messages.invalidData"),
        };

        return {
          success: false,
          message: errorMessages[errorCode] || t("messages.signupFailed"),
        };
      }

      // Trường hợp lỗi không xác định
      return {
        success: false,
        message: t("messages.errorOccurred"),
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post("/auth/password-reset/", {
        email,
      });

      if (response.status === 200) {
        return { success: true, message: t("messages.passwordResetSuccess") };
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return {
            success: false,
            message: t("messages.passwordResetFailed"), // Thông báo khi email không tồn tại
          };
        } else if (error.response.status === 500) {
          return {
            success: false,
            message: t("messages.serverError"), // Thông báo khi có lỗi từ server
          };
        }
      }

      // Trường hợp lỗi không xác định
      return {
        success: false,
        message: t("messages.errorOccurred"),
      };
    }
  };

  const refreshToken = async () => {
    try {
      const refresh_token = Cookies.get("refresh_token");
      if (!refresh_token) {
        console.error("No refresh token found.");
        logout(); // Gọi hàm logout khi không có refresh token
        return null;
      }

      const response = await axiosInstance.post("/auth/refresh/", {
        refresh: refresh_token,
      });

      if (response.status === 200) {
        Cookies.set("access_token", response.data.access, { expires: 0.02 });
        Cookies.set("refresh_token", response.data.refresh, { expires: 7 });
        return response.data.access;
      } else {
        console.error("Failed to refresh token.");
        logout();
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        googleLogin,
        logout,
        signup,
        forgotPassword,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
