import React, { useState } from "react";
import { isValidEmail } from "../../../helpers/validation";
import axiosInstance from "../../../config/axiosConfig";
import { handleError } from "../../../helpers/toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ResendActivationModal.css";

export default function ResendActivationModal({ open, onClose }) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setIsValid(isValidEmail(value));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSent(false);
        try {
            await axiosInstance.post("/auth/resend-active-link/", { email: email });
            setSent(true);
        } catch (err) {
            if (err.response?.status === 400) {
                handleError(t("resend_activation.errors.already_activated"));
            } else if (err.response?.status === 500) {
                handleError(t("resend_activation.errors.server"));
            }
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {sent ? (
                    <div>
                        <h2 className="modal-title">{t("resend_activation.sent_title")}</h2>
                        <p className="modal-description">
                            {t("resend_activation.sent_description")}
                        </p>
                        <button
                            className="submit-btn"
                            onClick={() => {
                                onClose();
                                setSent(false);
                            }}
                        >
                            {t("resend_activation.back_to_login")}
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className="close-btn"
                            onClick={() => {
                                onClose();
                                setSent(false);
                            }}
                        >
                            ×
                        </button>
                        <h2 className="modal-title">{t("resend_activation.title")}</h2>
                        <p className="modal-description">
                            {t("resend_activation.description")}
                        </p>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder={t("resend_activation.placeholder")}
                                value={email}
                                onChange={handleInputChange}
                                className="email-input"
                            />
                        </div>
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={loading || !email || !isValid}
                        >
                            {loading
                                ? t("resend_activation.sending")
                                : t("resend_activation.send_link")}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
