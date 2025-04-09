import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import facebookicon from "../../assets/images/icon/facebookicon.png";
import googleicon from "../../assets/images/icon/googleicon.png";
import logo from "../../assets/images/logo.png";
import { handleError, handleSuccess } from "../../helpers/toast";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserData } from "../../context/UserDataProvider";
import axiosInstance from "../../config/axiosConfig";
import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import { addCookie, removeCookie } from "../../helpers/cookiesHelper";
import { hash, checkData } from "../../helpers/encryptionHelper";
import CryptoJS from "crypto-js";
import Forbidden from "../../components/Error/403/403";

const SpotifyLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { isLoggedIn, setIsLoggedIn } = useUserData();

  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login/", dataLogin);
      if (response.status === 200) {
        const role_ID_Hash = await hash(response.data.role);

        if (response?.data?.access && response?.data?.refresh && role_ID_Hash) {
          addCookie(
            response?.data?.access,
            response?.data?.refresh,
            role_ID_Hash
          );
        }

        setIsLoggedIn(true);
        if (response.data.role === 1) {
          navigate("/admin/", { replace: true });
        } else if (response.data.role === 2) {
          navigate("/artist/", { replace: true });
        } else {
          navigate("/user/", { replace: true });
        }
        handleSuccess(t("messages.loginSuccess")); // Hiển thị toast thành công
      }
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.error_code) {
        setIsLoading(false);
        const errorCode = error.response.data.error_code;
        const errorMessages = {
          ACCOUNT_NOT_ACTIVATED: t("messages.accountNotActivated"),
          INVALID_CREDENTIALS: t("messages.invalidCredentials"),
          UNKNOWN_ERROR: t("messages.errorOccurred"),
        };
        setError(errorMessages[errorCode]); // Hiển thị toast lỗi
      }
    }
    setIsLoading(false);
  };

  const googleLogin = async (token_id) => {
    try {
      const response = await axiosInstance.post("/auth/login/google/", {
        access_token: token_id,
      });

      if (response.status === 200) {
        const role_ID_Hash = await hash(response.data.role);
        if (response?.data?.access && response?.data?.refresh && role_ID_Hash) {
          addCookie(
            response?.data?.access,
            response?.data?.refresh,
            role_ID_Hash
          );
        }
        setIsLoggedIn(true);
        return { success: true, role: response.data.role };
      }
    } catch (error) {
      if (error.response?.data?.error_code) {
        return {
          success: false,
          error_code: error.response?.data?.error_code,
        };
      }
      // Trường hợp lỗi không xác định
      return {
        success: false,
        error_code: "UNKNOWN_ERROR",
      };
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await googleLogin(tokenResponse.access_token);
      if (response.success) {
        console.log("daya", response);
        if (response.role === 1) {
          navigate("/admin/", { replace: true });
        } else if (response.role === 2) {
          navigate("/artist/", { replace: true });
        } else {
          navigate("/user/", { replace: true });
        }
        handleSuccess(t("messages.loginSuccess")); // Hiển thị toast thành công
      } else {
        const errorCode = response.error_code;
        const errorMessages = {
          ACCESS_TOKEN_REQUIRED: t("messages.accessTokenRequired"),
          INVALID_GOOGLE_TOKEN: t("messages.invalidGoogleToken"),
          EMAIL_ALREADY_EXISTS: t("messages.emailAlreadyExists"),
          ACCOUNT_NOT_ACTIVATED: t("messages.accountNotActivated"),
          INVALID_TOKEN: t("messages.invalidToken"),
          UNKNOWN_ERROR: t("messages.errorOccurred"),
        };
        handleError(errorMessages[errorCode]);
      }
    },
    onError: () => {
      handleError(t("messages.loginFailed"));
    },
  });

  // nếu đã login thì không cho vào
  if (isLoggedIn) {
    return <Forbidden />;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-110"
      style={{ backgroundColor: "#121212" }}
    >
      <div
        className="p-4 text-white d-flex flex-column align-items-center"
        style={{
          width: "50%",
          backgroundColor: "#000",
          borderRadius: "8px",
          marginTop: "2%",
          marginBottom: "5%",
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="ZMusic Logo" className="login-spotify-logo" />
        </div>
        <div className="text-center mb-3" style={{ width: "50%" }}>
          <h3 className="fw-bold">{t("login.title")}</h3>
        </div>
        {/* Custom Google Login Button */}
        <button
          className="btn btn-outline-light mb-2 d-flex align-items-center justify-content-start"
          style={{
            width: "50%",
            height: "50px",
            borderRadius: "50px",
            paddingLeft: "5%",
          }}
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img
            src={googleicon}
            alt="Google Logo"
            className="login-google-facebook-logo"
          />
          <span style={{ fontSize: "1rem" }}>
            {t("login.continueWithGoogle")}
          </span>
        </button>

        <button
          className="btn btn-outline-light mb-2 d-flex align-items-center justify-content-start"
          style={{
            width: "50%",
            height: "50px",
            borderRadius: "50px",
            paddingLeft: "5%",
          }}
          disabled={isLoading}
        >
          <img
            src={facebookicon}
            alt="Facebook Logo"
            className="login-google-facebook-logo"
          />
          <span style={{ fontSize: "1rem" }}>
            {t("login.continueWithFacebook")}
          </span>
        </button>
        <button
          className="btn btn-outline-light mb-2 d-flex align-items-center justify-content-start"
          style={{
            width: "50%",
            height: "50px",
            borderRadius: "50px",
            paddingLeft: "5%",
          }}
          disabled={isLoading}
        >
          <i
            className="fab fa-apple"
            style={{ fontSize: "1.5rem", marginRight: "5%" }}
          ></i>
          <span style={{ fontSize: "1rem" }}>
            {t("login.continueWithApple")}
          </span>
        </button>
        <button
          className="btn btn-outline-light mb-3 d-flex align-items-center justify-content-start"
          style={{
            width: "50%",
            height: "50px",
            borderRadius: "50px",
            paddingLeft: "5%",
          }}
          disabled={isLoading}
        >
          <i
            className="fas fa-phone"
            style={{ fontSize: "1.5rem", marginRight: "5%" }}
          ></i>
          <span style={{ fontSize: "1rem" }}>
            {t("login.continueWithPhone")}
          </span>
        </button>
        <hr
          style={{
            width: "50%",
            borderTop: "2px solid #FFFFFF",
            margin: "20px 0",
          }}
        />
        <form onSubmit={handleLogin} style={{ width: "50%" }}>
          <div>
            <label className="form-label fw-bold" style={{ fontSize: "1rem" }}>
              {t("login.enterYourEmail")}
            </label>
          </div>
          <div className="mb-3" style={{ width: "100%", height: "50px" }}>
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
            <label className="form-label fw-bold" style={{ fontSize: "1rem" }}>
              {t("login.password")}
            </label>
          </div>
          <div
            className="mb-4 position-relative"
            style={{ width: "100%", height: "50px" }}
          >
            <input
              type={showPassword ? "text" : "password"}
              className="login-form-control text-white"
              placeholder={t("login.password")}
              value={dataLogin.password}
              onChange={(e) =>
                setDataLogin((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="new-password"
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  {t("login.loginButton")}
                </span>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-3" style={{ width: "50%" }}>
          <a href="password-reset" className="login-text-light">
            {t("login.forgotPassword")}
          </a>
        </div>
        <div className="text-center mt-2" style={{ width: "50%" }}>
          <span>{t("login.noAccount")} </span>
          <a href="/signup" className="login-text-light">
            {t("login.signUp")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpotifyLogin;
