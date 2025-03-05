import { useState } from "react";
import "./ForgotPassword.css";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const { t } = useTranslation();

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <img src={logo} alt="Spotify" className="logo" />
                <h2 className="reset-password-title">{t("resetPassword.title")}</h2>
                <p className="reset-password-subtitle">
                    {t("resetPassword.subtitle")}
                </p>

                <label className="form-label">{t("resetPassword.emailLabel")}</label>
                <input
                    type="email"
                    className="reset-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                />
                <a href="#" className="help-link">{t("resetPassword.helpLink")}</a>
                <button type="button" className="reset-button">{t("resetPassword.submitButton")}</button>
            </div>
        </div>
    );
};

export default ResetPassword;
