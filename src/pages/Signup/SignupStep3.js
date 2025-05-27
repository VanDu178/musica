import { useState, useEffect } from "react";
import "./SignupStep3.css";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap"; // Import Spinner
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";

const SignupStep3 = ({ onNext, onBack, userData, setUserData, error }) => {
  const { t, i18n } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false); // Add isLoading state
  const { isLoggedIn } = useUserData();
  const isFormValid = userData.username;

  const handleNext = async () => {
    setIsProcessing(true);
    await onNext();
    setIsProcessing(false);
  };
  // nếu đã login thì không cho vào
  if (isLoggedIn) {
    return <Forbidden />;
  }

  return (
    <div className="signup-step-3">
      <img src={logo} alt="Spotify" className="logo" />
      <div
        className="progress-bar"
        style={{
          width: "100%",
          height: "3px",
          background: "linear-gradient(to right,#1DB954 100%, #333 0%)",
        }}
      ></div>
      <button className="back-btn" onClick={onBack} disabled={isProcessing}>
        ← {t(`signupStep3.step`)} 2/2
      </button>
      <h2 className="title">{t(`signupStep3.title`)}</h2>
      {/* Nhập tên */}
      <label className="form-label">{t(`signupStep3.nameLabel`)}</label>
      <p className="form-p">{t(`signupStep3.nameDescription`)}</p>
      <input
        type="text"
        className="form-control"
        placeholder={t(`signupStep3.namePlaceholder`)}
        autoComplete="on"
        value={userData.username}
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, username: e.target.value }))
        }
        readOnly={isProcessing}
      />
      {/* Nút tiếp theo */}
      {error && <div className="error-message">{error}</div>}{" "}
      <button
        className="next-btn"
        onClick={handleNext}
        disabled={!isFormValid || isProcessing}
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
          t(`signupStep3.nextButton`)
        )}
      </button>
    </div>
  );
};

export default SignupStep3;
