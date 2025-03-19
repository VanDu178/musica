import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Login.css";
import logo from "../../assets/images/logo.png";
import googleicon from "../../assets/images/icon/googleicon.png";
import facebookicon from "../../assets/images/icon/facebookicon.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Spinner } from "react-bootstrap"; // Import Spinner
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import showToast from "../../helpers/toast";
import { useGoogleLogin } from "@react-oauth/google";

const SpotifyLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(dataLogin);
    setIsLoading(false);
    if (result.success) {
      showToast(result.message, "success"); // Hiển thị toast thành công
    } else {
      setError(result.message);
      // showToast(result.message, "error"); // Hiển thị toast lỗi
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleLogin(tokenResponse.access_token);
        if (response.success) {
          showToast(response.message); // Hiển thị thông báo thành công
        } else {
          console.error("Google Login Error:", response.message);
          showToast(response.message, "error"); // Hiển thị toast lỗi
        }
      } catch (error) {
        console.error("Google Login Failed:", error);
        showToast(t("messages.loginFailed"), "error"); // Hiển thị toast lỗi
      }
    },
    onError: () => {
      showToast(t("messages.loginFailed"), "error"); // Hiển thị toast lỗi
    },
  });

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
          <img src={logo} alt="Spotify Logo" className="spotify-logo" />
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
            className="google-facebook-logo"
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
            className="google-facebook-logo"
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
          <div className="input-group">
            <label className="form-label fw-bold" style={{ fontSize: "1rem" }}>
              {t("login.enterYourEmail")}
            </label>
          </div>
          <div className="mb-3" style={{ width: "100%", height: "50px" }}>
            <input
              type="email"
              className="form-control text-white"
              placeholder={t("login.enterYourEmail")}
              value={dataLogin.email}
              onChange={(e) =>
                setDataLogin((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="input-group">
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
              className="form-control text-white"
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
        </form>
        <div className="text-center mt-3" style={{ width: "50%" }}>
          <a href="password-reset" className=" text-light">
            {t("login.forgotPassword")}
          </a>
        </div>
        <div className="text-center mt-2" style={{ width: "50%" }}>
          <span>{t("login.noAccount")} </span>
          <a href="/signup" className="text-light">
            {t("login.signUp")}
          </a>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SpotifyLogin;
