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
  const [showNoti, setShowNoti] = useState(false); // State to control Noti visibility
  const [message, setMessage] = useState(""); // State to store error message
  const [loading, setLoading] = useState(false); // State to track loading status
  const { forgotPassword } = useContext(AuthContext);
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
      setMessage(t("messages.passwordResetSuccess"));
    } else {
      const errorCode = response.error_code;
      const errorMessages = {
        USER_NOT_FOUND: t("messages.passwordResetFailed"),
        UNKNOWN_ERROR: t("messages.errorOccurred"),
      };
      setMessage(errorMessages[errorCode]); // Hiển thị toast lỗi
      console.error("Password reset failed", errorMessages[errorCode]);
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
            readOnly={loading} // Make input readonly while loading
          />
          <a href="#" className="help-link">
            {t("resetPassword.helpLink")}
          </a>
          {message && <span className="error-message">{message}</span>}{" "}
          {/* Display error message */}
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
      </div>
    </div>
  );

  // return (
  //   <div className="d-flex align-items-center justify-content-center vh-100">
  //     <div
  //       className="card shadow p-4 reset-password-container"
  //       style={{ maxWidth: "400px", width: "100%" }}
  //     >
  //       <div className="text-center mb-3r">
  //         <img src={logo} alt="Spotify" className="logo" />
  //       </div>
  //       <h2 className="text-center text-dark">{t("resetPassword.title")}</h2>
  //       <p className="text-center text-muted">{t("resetPassword.subtitle")}</p>
  //       <form onSubmit={handleSubmit}>
  //         <div className="mb-3">
  //           <label className="form-label">
  //             {t("resetPassword.emailLabel")}
  //           </label>
  //           <input
  //             type="email"
  //             className="form-control"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             placeholder="name@domain.com"
  //             required
  //             readOnly={loading}
  //           />
  //         </div>
  //         <div className="text-end mb-3">
  //           <a href="#" className="text-decoration-none text-success">
  //             {t("resetPassword.helpLink")}
  //           </a>
  //         </div>
  //         <button
  //           type="submit"
  //           className="btn btn-success w-100 d-flex align-items-center justify-content-center"
  //           disabled={loading}
  //         >
  //           {loading ? (
  //             <Spinner
  //               animation="border"
  //               size="sm"
  //               role="status"
  //               aria-hidden="true"
  //             />
  //           ) : (
  //             t("resetPassword.submitButton")
  //           )}
  //         </button>
  //       </form>
  //       {message && <p className="mt-3 text-center text-danger">{message}</p>}
  //     </div>
  //   </div>
  // );
};

export default ResetPassword;
