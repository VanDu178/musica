import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Login.css";
import logo from "../../assets/images/logo.png";
import googleicon from "../../assets/images/icon/googleicon.png";
import facebookicon from "../../assets/images/icon/facebookicon.png";
import { useTranslation } from "react-i18next";

const SpotifyLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { t, i18n } = useTranslation();

    return (
        <div className="d-flex justify-content-center align-items-center vh-110" style={{ backgroundColor: "#121212" }}>
            <div className="p-4 text-white d-flex flex-column align-items-center" style={{ width: "50%", backgroundColor: "#000", borderRadius: "8px", marginTop: "2%", marginBottom: "5%" }}>
                <div className="text-center mb-4">
                    <img src={logo} alt="Spotify Logo" className="spotify-logo" />
                </div>
                <div className="text-center mb-3" style={{ width: "50%" }}>
                    <h3 className="fw-bold">{t("login.title")}</h3>
                </div>
                <button className="btn btn-outline-light mb-2 d-flex align-items-center justify-content-start" style={{ width: "50%", height: "50px", borderRadius: "50px", paddingLeft: "5%" }}>
                    <img
                        src={googleicon}
                        alt="Google Logo"
                        className="google-facebook-logo"
                    />
                    <span style={{ fontSize: "1rem" }}>{t("login.continueWithGoogle")}</span>
                </button>
                <button className="btn btn-outline-light mb-2 d-flex align-items-center justify-content-start" style={{ width: "50%", height: "50px", borderRadius: "50px", paddingLeft: "5%" }}>
                    <img
                        src={facebookicon}
                        alt="Facebook Logo"
                        className="google-facebook-logo"
                    />
                    <span style={{ fontSize: "1rem" }}>{t("login.continueWithFacebook")}</span>
                </button>
                <button className="btn btn-outline-light mb-2 d-flex align-items-center justify-content-start" style={{ width: "50%", height: "50px", borderRadius: "50px", paddingLeft: "5%" }}>
                    <i className="fab fa-apple" style={{ fontSize: "1.5rem", marginRight: "5%" }}></i>
                    <span style={{ fontSize: "1rem" }}>{t("login.continueWithApple")}</span>
                </button>
                <button className="btn btn-outline-light mb-3 d-flex align-items-center justify-content-start" style={{ width: "50%", height: "50px", borderRadius: "50px", paddingLeft: "5%" }}>
                    <i className="fas fa-phone" style={{ fontSize: "1.5rem", marginRight: "5%" }}></i>
                    <span style={{ fontSize: "1rem" }}>{t("login.continueWithPhone")}</span>
                </button>
                <hr style={{ width: "50%", borderTop: "2px solid #FFFFFF", margin: "20px 0" }} />
                <div className="input-group">
                    <label className="form-label fw-bold" style={{ fontSize: "1rem" }}>{t("login.enterYourEmail")}</label>
                </div>
                <div className="mb-3" style={{ width: "50%", height: "50px" }}>
                    <input type="email" className="form-control text-white" placeholder={t("login.enterYourEmail")} />
                </div>
                <div className="input-group">
                    <label className="form-label fw-bold" style={{ fontSize: "1rem" }}>{t("login.password")}</label>
                </div>
                <div className="mb-4 position-relative" style={{ width: "50%", height: "50px" }}>
                    <input type={showPassword ? "text" : "password"} className="form-control text-white" placeholder={t("login.password")} autoComplete="new-password" />
                    <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"} style={{ color: "white" }}></i>
                    </span>
                </div>
                <button className="btn btn-success login-btn" autoComplete="off" >
                    <span style={{ fontSize: "1.5rem", color: "#000", fontWeight: "bold" }}>{t("login.loginButton")}</span>
                </button>
                <div className="text-center mt-3" style={{ width: "50%" }}>
                    <a href="password-reset" className=" text-light">{t("login.forgotPassword")}</a>
                </div>
                <div className="text-center mt-2" style={{ width: "50%" }}>
                    <span>{t("login.noAccount")} </span>
                    <a href="/signup" className="text-light">{t("login.signUp")}</a>
                </div>
            </div>
        </div >
    );
};

export default SpotifyLogin;
