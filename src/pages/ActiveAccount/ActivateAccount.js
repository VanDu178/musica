import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ResendActivationModal from "../../components/Modal/ResendActivationModal/ResendActivationModal";
import "./ActivateAccount.css";

const ActivateAccount = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang kích hoạt tài khoản...");
  const [countdown, setCountdown] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleResend = () => {
    setShowModal(true);
  };
  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axiosInstance.patch(`/auth/active/${token}`);
        if (response.status === 200) {
          setStatus("success");
          setMessage(response.data.message || t("activate_account.success"));

          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate("/login");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.error || t("activate_account.error"));
      }
    };

    activateAccount();
  }, [token, navigate, t]);

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="activate-container">
        <div className="activate-box">
          {status === "loading" && (
            <div className="status-wrapper">
              <svg
                className="spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="spinner-path"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <h2 className="status-title">{message}</h2>
              <p className="status-subtitle">
                {t("activate_account.redirect_message", { countdown })}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="status-wrapper">
              <svg
                className="success-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="status-title success">{message}</h2>
              <p className="status-subtitle">
                {t("activate_account.redirect_message", { countdown })}
              </p>
              <button className="redirect-button" onClick={handleRedirect}>
                {t("activate_account.redirect_button")}
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="status-wrapper">
              <svg
                className="error-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h2 className="status-title error">{message}</h2>
              <p className="status-subtitle">
                {t("activate_account.error_contact_support")}
              </p>

              <button className="redirect-button" onClick={handleRedirect}>
                {t("activate_account.redirect_button")}
              </button>
              <a className="resend-link" onClick={handleResend}>
                {t("activate_account.resend_active_link")}
              </a>
            </div>
          )}
        </div>
      </div>
      <ResendActivationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t("activate_account.resend_active_link")}
      />
    </>
  );
};

export default ActivateAccount;
