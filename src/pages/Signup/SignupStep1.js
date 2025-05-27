import React, { useState, useEffect } from "react";
import "./SignupStep1.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/logo.png";
import googleIcon from "../../assets/images/icon/google-icon.png";
import facebookIcon from "../../assets/images/icon/facebook-icon.png";
import { useTranslation } from "react-i18next";
import { isValidEmail } from "../../helpers/validation";
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";

const SignupStep1 = ({ onNext, userData, setUserData }) => {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);
  const { isLoggedIn } = useUserData();

  // Kiểm tra email khi người dùng nhập
  useEffect(() => {
    setIsValid(isValidEmail(userData.email));
  }, [userData.email]);

  // nếu đã login thì không cho vào
  if (isLoggedIn) {
    return <Forbidden />;
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src={logo} alt="Spotify Logo" className="spotify-logo" />
        <h2 className="signup-title">{t("signup.title")}</h2>

        <div className="text-start">
          <label
            className="form-label fw-bold text-start"
            style={{ fontSize: "1rem" }}
          >
            {t("signup.enterYourEmail")}
          </label>
        </div>

        <input
          type="email"
          className="form-control text-white"
          placeholder="name@domain.com"
          autoComplete="on"
          value={userData.email || ""}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />

        <div className="text-start">
          <a href="#" className="phone-link">
            {t("signup.usePhoneInstead")}
          </a>
        </div>

        {/* Nút tiếp theo - chỉ hoạt động nếu email hợp lệ */}
        <button
          className="btn btn-success signup-btn"
          onClick={onNext}
          disabled={!isValid}
        >
          {t("signup.nextButton")}
        </button>

        <div className="divider d-flex align-items-center">
          <hr className="flex-grow-1" />
          <span className="mx-2 text-white">{t("signup.or")}</span>
          <hr className="flex-grow-1" />
        </div>

        <button className="social-btn google">
          <img src={googleIcon} alt="Google" className="icon" />
          {t("signup.continueWithGoogle")}
        </button>
        <button className="social-btn facebook">
          <img src={facebookIcon} alt="Facebook" className="icon" />
          {t("signup.continueWithFacebook")}
        </button>
        <button className="social-btn apple">
          <i
            className="fab fa-apple"
            style={{ fontSize: "1.5rem", marginRight: "5%" }}
          ></i>
          {t("signup.continueWithApple")}
        </button>

        <hr
          style={{
            width: "100%",
            borderTop: "2px solid #FFFFFF",
            margin: "20px 0",
          }}
        />

        <div className="text-center mt-2" style={{ width: "100%" }}>
          <span style={{ opacity: 0.6 }}>{t("signup.haveAccount")} </span>
          <a href="/login" className="text-light">
            {t("signup.login")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupStep1;
