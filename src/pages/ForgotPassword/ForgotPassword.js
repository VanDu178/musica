import { useState, useEffect } from "react";
import "./ForgotPassword.css";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import Noti from "../../components/Noti/Noti"; // Import Noti component
import { Spinner } from "react-bootstrap"; // Import Spinner
import { isValidEmail } from "../../helpers/validation"; // Import isValidEmail
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";
import axiosInstance from "../../config/axiosConfig";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [showNoti, setShowNoti] = useState(false); // State to control Noti visibility
  const [message, setMessage] = useState(""); // State to store error message
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const { isLoggedIn } = useUserData();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setMessage(t("resetPassword.invalidEmail")); // Set error message for invalid email
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axiosInstance.post("/auth/password-reset/", {
        email,
      });

      if (response.status === 200) {
        setShowNoti(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error_code) {
        setShowNoti(true);
        setMessage(t("messages.passwordResetFailed"));
      } else {
        const errorCode = error.response?.data?.error_code;
        const errorMessages = {
          USER_NOT_FOUND: t("messages.passwordResetFailed"),
          UNKNOWN_ERROR: t("messages.errorOccurred"),
        };
      }
    } finally {
      setIsProcessing(false); // Hide spinner after finishing
    }
  };
  if (showNoti) {
    return (
      <Noti
        targetPage="/login" // Redirect to login page after signup
        message={message} // Display message from response
        time={5000} // 5 seconds delay
      />
    );
  }
  // nếu đã login thì không cho vào
  if (isLoggedIn) {
    return <Forbidden />;
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="text-center mb-3">
          <img src={logo} alt="Spotify" className="logo" />
        </div>
        <h2 className="reset-password-title">{t("resetPassword.title")}</h2>
        <p className="reset-password-subtitle">{t("resetPassword.subtitle")}</p>
        <form onSubmit={handleSubmit}>
          <label className="form-label">{t("resetPassword.emailLabel")}</label>
          <input
            type="email"
            className="reset-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            required
            readOnly={isProcessing}
          />
          <a href="#" className="help-link">
            {t("resetPassword.helpLink")}
          </a>
          {message && <span className="error-message">{message}</span>}{" "}
          {/* Display error message */}
          <button
            type="submit"
            className="reset-button"
            disabled={isProcessing}
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
              t("resetPassword.submitButton")
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
