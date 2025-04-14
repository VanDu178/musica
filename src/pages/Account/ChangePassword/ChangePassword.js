import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../../context/UserDataProvider";
import Forbidden from "../../../components/Error/403/403";
import Loading from "../../../components/Loading/Loading";
import { isValidPassword } from "../../../helpers/validation";
import axiosInstance from "../../../config/axiosConfig";
import { handleSuccess } from "../../../helpers/toast";
import { useTranslation } from "react-i18next";
import "./ChangePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // updated name
  const { isLoggedIn } = useUserData();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [rules, setRules] = useState({
    hasLetter: false,
    hasNumberOrSpecial: false,
    hasMinLength: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleCurrentPasswordVisibility = () =>
    setShowCurrentPassword((prev) => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      const validation = isValidPassword(value);
      setRules({
        hasLetter: validation.hasLetter,
        hasNumberOrSpecial: validation.hasNumberOrSpecial,
        hasMinLength: validation.hasMinLength,
      });

      setPasswordMatch(formData.confirmPassword === value);
    }

    if (name === "confirmPassword") {
      setPasswordMatch(value === formData.newPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsProcessing(true);
    const dataUpdate = new FormData();
    if (formData?.currentPassword && formData?.newPassword) {
      dataUpdate.append("currentPassword", formData.currentPassword);
      dataUpdate.append("newPassword", formData.newPassword);
    }
    try {
      const response = await axiosInstance.put(
        "/account/change-password/",
        dataUpdate,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.status === 200) {
        handleSuccess(t("change_password.success"));
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (err) {
      if (err?.response?.data?.message_code) {
        const message_code = err.response.data.message_code;
        const errorMessages = {
          INVALID_PASSWORD: t("change_password.errors.invalid_current"),
          ERROR_OCCURRED: t("change_password.errors.generic"),
          INVALID_ACTION: t("change_password.errors.generic"),
        };
        setError(errorMessages[message_code]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return <Forbidden />;
  }

  return (
    <div className="change-password-container">
      <div className="change-password-back-button-container">
        <button
          className="change-password-back-button"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>

      <div className="change-password-title-container">
        <h1>{t("change_password.title")}</h1>
      </div>

      <form className="change-password-form" onSubmit={handleSubmit}>
        {error && <p className="change-password-error-message">{error}</p>}
        {success && (
          <p className="change-password-success-message">{success}</p>
        )}

        <div className="change-password-form-group">
          <label htmlFor="current-password">
            {t("change_password.current_password")}
          </label>
          <div className="change-password-input-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
            <span
              className="change-password-toggle-password"
              onClick={toggleCurrentPasswordVisibility}
            >
              {showCurrentPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <div className="change-password-form-group">
          <label htmlFor="new-password">
            {t("change_password.new_password")}
          </label>
          <div className="change-password-input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              value={formData?.newPassword}
              onChange={handleInputChange}
              required
            />
            <span
              className="change-password-toggle-password"
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <div className="change-password-form-group change-password-password-rules">
          <label>{t("change_password.rules.label")}</label>
          <ul>
            <li>
              {rules?.hasLetter ? "✔" : "○"} {t("change_password.rules.letter")}
            </li>
            <li>
              {rules?.hasNumberOrSpecial ? "✔" : "○"}{" "}
              {t("change_password.rules.number_or_special")}
            </li>
            <li>
              {rules?.hasMinLength ? "✔" : "○"}{" "}
              {t("change_password.rules.min_length")}
            </li>
          </ul>
        </div>

        <div className="change-password-form-group">
          <label htmlFor="confirm-password">
            {t("change_password.confirm_password")}
          </label>
          <div className="change-password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <span
              className="change-password-toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {!passwordMatch && formData?.confirmPassword && (
            <p className="change-password-error-message">
              {t("change_password.errors.password_mismatch")}
            </p>
          )}
        </div>

        <div className="change-password-form-group">
          <button
            type="submit"
            className="change-password-save-button"
            disabled={
              isProcessing ||
              !rules?.hasLetter ||
              !rules?.hasNumberOrSpecial ||
              !rules?.hasMinLength ||
              !passwordMatch
            }
          >
            {isProcessing
              ? t("change_password.saving")
              : t("change_password.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
