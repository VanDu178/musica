import { useState, useContext } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import Noti from "../../components/Noti/Noti"; // Import Noti component
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [showNoti, setShowNoti] = useState(false); // State to control Noti visibility
  const [error, setError] = useState(""); // State to store error message
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const { signup } = useContext(AuthContext);
  const { t } = useTranslation();
  // State lưu thông tin người dùng
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    username: "",
    // day: "",
    // month: "",
    // year: "",
    // gender: "",
  });

  const handleSignup = async () => {
    setIsLoading(true);
    const response = await signup(userData);
    setIsLoading(false);
    if (response.success) {
      setShowNoti(true);
    } else {
      // console.log(response);
      const errorCode = response.error_code;
      const errorMessages = {
        EMAIL_ALREADY_EXISTS: t("messages.emailAlreadyExists"),
        USERNAME_ALREADY_EXISTS: t("messages.usernameAlreadyExists"),
        INVALID_DATA: t("messages.invalidData"),
        UNKNOWN_ERROR: t("messages.errorOccurred"),
      };
      setError(errorMessages[errorCode]); // Hiển thị toast lỗi
      console.error("Signup failed", errorMessages[errorCode]);
    }
  };

  const handleBack = () => {
    setError(""); // Clear error message
    setStep(step - 1);
  };

  if (showNoti) {
    return (
      <Noti
        targetPage="/login" // Redirect to login page after signup
        message={t("messages.signupSuccess")} // Custom message
        time={5000} // 5 seconds delay
      />
    );
  }

  return (
    <div className="signup-container " style={{ height: "105vh" }}>
      {step === 1 && (
        <SignupStep1
          onNext={() => setStep(2)}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {step === 2 && (
        <SignupStep2
          onNext={() => setStep(3)}
          onBack={handleBack}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {step === 3 && (
        <SignupStep3
          onNext={handleSignup}
          onBack={handleBack}
          userData={userData}
          setUserData={setUserData}
          error={error} // Pass error message to SignupStep3
          isLoading={isLoading} // Pass isLoading state to SignupStep3
        />
      )}
    </div>
  );
};

export default Signup;
