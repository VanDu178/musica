import { useState, useEffect } from "react";
import "./SignupStep2.css";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

const SignupStep2 = ({ onNext, onBack, userData, setUserData }) => {
    const { t, i18n } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [rules, setRules] = useState({
        hasLetter: false,
        hasNumberOrSpecial: false,
        hasMinLength: false
    });

    // Kiểm tra mật khẩu khi người dùng nhập hoặc khi load lại từ `userData`
    useEffect(() => {
        if (userData.password) {
            validatePassword(userData.password);
        }
    }, [userData.password]);

    const validatePassword = (value) => {
        setUserData((prev) => ({ ...prev, password: value }));

        setRules({
            hasLetter: /[a-zA-Z]/.test(value),
            hasNumberOrSpecial: /[\d\W]/.test(value),
            hasMinLength: value.length >= 10
        });
    };

    return (
        <div className="signup-step-2">
            <img src={logo} alt="Spotify" className="logo" />
            <div className="progress-bar"></div>

            <button className="back-btn" onClick={onBack}>
                ← {t("signupStep2.step")} 1/2
            </button>

            <h2 className="title">{t("signupStep2.title")}</h2>
            <div className="mb-4 position-relative" style={{ width: "80%", height: "50px" }}>
                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control text-white"
                    placeholder={t("signupStep2.passwordPlaceholder")}
                    autoComplete="new-password"
                    value={userData.password || ""}
                    onChange={(e) => validatePassword(e.target.value)}
                />
                <span
                    className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"} style={{ color: "white" }}></i>
                </span>
            </div>

            <div className="password-rules">
                <p>{t("signupStep2.passwordRules")}</p>
                <ul>
                    <li>{rules.hasLetter ? "✔" : "○"} {t("signupStep2.ruleHasLetter")}</li>
                    <li>{rules.hasNumberOrSpecial ? "✔" : "○"} {t("signupStep2.ruleHasNumberOrSpecial")}</li>
                    <li>{rules.hasMinLength ? "✔" : "○"} {t("signupStep2.ruleHasMinLength")}</li>
                </ul>
            </div>

            <button className="next-btn" onClick={onNext} disabled={!rules.hasLetter || !rules.hasNumberOrSpecial || !rules.hasMinLength}>
                {t("signupStep2.nextButton")}
            </button>

            <p className="recaptcha">
                This site is protected by reCAPTCHA and the Google{" "}
                <a href="#">Privacy Policy</a> and{" "}
                <a href="#">Terms of Service</a> apply.
            </p>
        </div>
    );
};

export default SignupStep2;
