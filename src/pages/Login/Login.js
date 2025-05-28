import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../helpers/toast";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserData } from "../../context/UserDataProvider";
import axiosInstance from "../../config/axiosConfig";
import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import { addCookie, removeCookie } from "../../helpers/cookiesHelper";
import { hash, checkData } from "../../helpers/encryptionHelper";
import Forbidden from "../../components/Error/403/403";
import ResendActivationModal from "../../components/Modal/ResendActivationModal/ResendActivationModal";

// icon,image
import logo from "../../assets/images/white-logo.png";
import facebookIcon from "../../assets/images/icon/facebook-icon.png";
import googleIcon from "../../assets/images/icon/google-icon.png";

import { useTranslation } from "react-i18next";

const SpotifyLogin = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useUserData();
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setIsProcessing(true);
    try {
      const response = await axiosInstance.post("/auth/login", dataLogin);
      if (response?.status === 200 && response?.data?.role) {
        setIsLoggedIn(true);
        const role_Hash = await hash(response?.data?.role?.name);
        if (
          response?.data?.accessToken &&
          role_Hash
          // response?.data?.is_premium !== null
        ) {
          console.log("co ton tai");
          addCookie(
            response.data.accessToken,
            role_Hash
            // response.data.is_premium,
            // response.data.premium_plan
          );
        }
        // if (response.data.role.name === "admin") {
        //   navigate("/admin/", { replace: true });
        // } else if (response.data.role.name === "artist") {
        //   navigate("/artist/", { replace: true });
        // } else {
        //   navigate("/user/", { replace: true });
        // }
        handleSuccess(t("messages.loginSuccess")); // Hiển thị toast thành công
      }
    } catch (error) {
      if (error?.response?.data?.error_code) {
        const errorCode = error.response.data.error_code;
        if (errorCode === "ACCOUNT_NOT_ACTIVATED") {
          setShowModal(true);
        }
        const errorMessages = {
          // ACCOUNT_NOT_ACTIVATED: t("messages.accountNotActivated"),
          INVALID_CREDENTIALS: t("messages.invalidCredentials"),
          ACCOUNT_WAS_BAN: t("messages.accountWasBan"),
          UNKNOWN_ERROR: t("messages.errorOccurred"),
        };
        setError(errorMessages[errorCode]); // Hiển thị toast lỗi
      }
    } finally {
      setIsProcessing(false); // Hide spinner after finishing
    }
  };

  // const googleLogin = async (token_id) => {
  //   try {
  //     const response = await axiosInstance.post("/auth/login/google/", {
  //       access_token: token_id,
  //     });

  //     if (response.status === 200) {
  //       const role_ID_Hash = await hash(response.data.role);
  //       if (
  //         response?.data?.access &&
  //         response?.data?.refresh &&
  //         role_ID_Hash &&
  //         response?.data?.is_premium !== null
  //       ) {
  //         addCookie(
  //           response.data.access,
  //           response.data.refresh,
  //           role_ID_Hash,
  //           response.data.is_premium,
  //           response.data.premium_plan
  //         );
  //       }
  //       setIsLoggedIn(true);
  //       return { success: true, role: response.data.role };
  //     }
  //   } catch (error) {
  //     if (error.response?.data?.error_code) {
  //       return {
  //         success: false,
  //         error_code: error.response?.data?.error_code,
  //       };
  //     }
  //     // Trường hợp lỗi không xác định
  //     return {
  //       success: false,
  //       error_code: "UNKNOWN_ERROR",
  //     };
  //   }
  // };

  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     const response = await googleLogin(tokenResponse.access_token);
  //     if (response.success) {
  //       if (response.role === 1) {
  //         navigate("/admin/", { replace: true });
  //       } else if (response.role === 2) {
  //         navigate("/artist/", { replace: true });
  //       } else {
  //         navigate("/user/", { replace: true });
  //       }
  //       handleSuccess(t("messages.loginSuccess")); // Hiển thị toast thành công
  //     } else {
  //       const errorCode = response.error_code;
  //       const errorMessages = {
  //         ACCESS_TOKEN_REQUIRED: t("messages.accessTokenRequired"),
  //         INVALID_GOOGLE_TOKEN: t("messages.invalidGoogleToken"),
  //         EMAIL_ALREADY_EXISTS: t("messages.emailAlreadyExists"),
  //         ACCOUNT_NOT_ACTIVATED: t("messages.accountNotActivated"),
  //         INVALID_TOKEN: t("messages.invalidToken"),
  //         UNKNOWN_ERROR: t("messages.errorOccurred"),
  //       };
  //       handleError(errorMessages[errorCode]);
  //     }
  //   },
  //   onError: () => {
  //     handleError(t("messages.loginFailed"));
  //   },
  // });

  // nếu đã login thì không cho vào
  if (isLoggedIn) {
    return <Forbidden />;
  }

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="text-center mb-4">
            <img src={logo} alt="ZMusic Logo" className="login-spotify-logo" />
          </div>
          <div className="login-title-container">
            <h3 className="fw-bold">{t("login.title")}</h3>
          </div>
          <button
            className="btn btn-outline-light mb-2 login-social-button"
            // onClick={handleGoogleLogin}
            disabled={isProcessing}
          >
            <img
              src={googleIcon}
              alt="Google Logo"
              className="login-google-facebook-logo"
            />
            <span>{t("login.continueWithGoogle")}</span>
          </button>

          <button
            className="btn btn-outline-light mb-2 login-social-button"
            disabled={isProcessing}
          >
            <img
              src={facebookIcon}
              alt="Facebook Logo"
              className="login-google-facebook-logo"
            />
            <span>{t("login.continueWithFacebook")}</span>
          </button>
          <button
            className="btn btn-outline-light mb-2 login-social-button"
            disabled={isProcessing}
          >
            <i className="fab fa-apple login-social-icon"></i>
            <span>{t("login.continueWithApple")}</span>
          </button>
          <button
            className="btn btn-outline-light mb-3 login-social-button"
            disabled={isProcessing}
          >
            <i className="fas fa-phone login-social-icon"></i>
            <span>{t("login.continueWithPhone")}</span>
          </button>
          <hr className="login-divider" />
          <form className="login-form">
            <div>
              <label className="form-label fw-bold login-label text-start">
                {t("login.enterYourEmail")}
              </label>
            </div>
            <div className="mb-3 login-input-container">
              <input
                type="email"
                className="login-form-control text-white"
                placeholder={t("login.enterYourEmail")}
                value={dataLogin.email}
                onChange={(e) =>
                  setDataLogin((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label fw-bold login-label text-start">
                {t("login.password")}
              </label>
            </div>
            <div className="mb-4 login-input-container position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="login-form-control text-white"
                placeholder={t("login.password")}
                value={dataLogin.password}
                onChange={(e) =>
                  setDataLogin((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              <span
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}
                  style={{ color: "white" }}
                ></i>
              </span>
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success login-btn"
                type="submit"
                autoComplete="off"
                disabled={isProcessing}
                onClick={handleLogin}
              >
                {isProcessing ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="login-btn-text">
                    {t("login.loginButton")}
                  </span>
                )}
              </button>
            </div>
          </form>
          <div className="login-link-container">
            <a href="password-reset" className="login-text-light">
              {t("login.forgotPassword")}
            </a>
          </div>
          <div className="login-link-container">
            <span>{t("login.noAccount")} </span>
            <a href="/signup" className="login-text-light">
              {t("login.signUp")}
            </a>
          </div>
        </div>
      </div>

      <ResendActivationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Tài khoản bạn chưa được kích hoạt"
      />
    </>
  );
};

export default SpotifyLogin;
