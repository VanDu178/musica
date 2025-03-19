import { useState, useContext } from "react";
import "./ForgotPassword.css";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import Noti from "../../components/Noti/Noti"; // Import Noti component
import { Spinner } from "react-bootstrap"; // Import Spinner
import { isValidEmail } from "../../helpers/validation"; // Import isValidEmail

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useContext(AuthContext);
  const [showNoti, setShowNoti] = useState(false); // State to control Noti visibility
  const [message, setMessage] = useState(""); // State to store error message
  const [loading, setLoading] = useState(false); // State to track loading status
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setMessage(t("resetPassword.invalidEmail")); // Set error message for invalid email
      return;
    }

    setLoading(true);
    const response = await forgotPassword(email);
    setLoading(false);
    if (response.success) {
      setShowNoti(true);
      setMessage(response.message);
    } else {
      setMessage(response.message);
      console.error("Password reset failed", response.message);
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

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <img src={logo} alt="Spotify" className="logo" />
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
            readOnly={loading} // Make input readonly while loading
          />
          <a href="#" className="help-link">
            {t("resetPassword.helpLink")}
          </a>
          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? (
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
        {message && <p className="error-message">{message}</p>}{" "}
        {/* Display error message */}
      </div>
    </div>
  );
};

export default ResetPassword;
