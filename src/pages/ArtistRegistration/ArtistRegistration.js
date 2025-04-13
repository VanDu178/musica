import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  isValidFileImage,
  isValidPhoneNumber,
  isValidEmail,
} from "../../helpers/validation";
import axiosInstance from "../../config/axiosConfig";
import { handleError, handleSuccess } from "../../helpers/toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import "./ArtistRegistration.css";

const ArtistRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    artistName: "",
    phone: "",
    bio: "",
    email: "",
    socialLink: "",
    proofImages: [],
    artistImages: [],
  });

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });

  const [isProcessing, setIsProcessing] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!isValidPhoneNumber(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: t("artist_registration.invalidPhone"),
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
    if (name === "email") {
      if (!isValidEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: t("artist_registration.invalidEmail"),
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileArray = Array.from(files);

    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ...fileArray],
    }));
  };

  const handleRemoveImage = (name, index) => {
    setFormData((prev) => {
      const updatedImages = prev[name].filter((_, i) => i !== index);
      return { ...prev, [name]: updatedImages };
    });

    const fileInput = document.querySelector(`input[name=${name}]`);
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.phone || errors.email) {
      console.log("Form contains errors.");
      return;
    }

    setIsProcessing(true);

    const dataRegister = new FormData();
    dataRegister.append("artistName", formData.artistName);
    dataRegister.append("phone", formData.phone);
    dataRegister.append("email", formData.email);
    dataRegister.append("bio", formData.bio);
    dataRegister.append("socialLink", formData.socialLink);

    formData.proofImages.forEach((file) => {
      dataRegister.append("proofImages", file);
    });

    formData.artistImages.forEach((file) => {
      dataRegister.append("artistImages", file);
    });

    try {
      const response = await axiosInstance.post(
        "/auth/register-artist/",
        dataRegister,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        handleSuccess(t("artist_registration.registrationSuccess"));
        setFormData({
          artistName: "",
          phone: "",
          bio: "",
          email: "",
          socialLink: "",
          proofImages: [],
          artistImages: [],
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400 && error.response?.data?.error_code) {
        const error_code = error.response?.data?.error_code;
        if (error_code === "EMAIL_ALREADY_REGISTERED") {
          handleError(t("artist_registration.emailAlreadyExists"));
        } else if (error_code === "PHONE_ALREADY_REGISTERED") {
          handleError(t("artist_registration.phoneAlreadyExists"));
        }
      } else if (error.response?.status === 500) {
        handleError(t("artist_registration.errorServer"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="artist_registration-artist-registration-container">
      <button
        type="button"
        className="artist_registration-back-button"
        onClick={() => navigate("/user")}
        disabled={isProcessing}
      >
        ← {t("artist_registration.goBack")}
      </button>

      <div className="artist_registration-form-wrapper">
        <h2 className="artist_registration-form-title">
          {t("artist_registration.registerAsArtist")}
        </h2>
        <div className="artist_registration-form-content">
          <form className="artist_registration-form" onSubmit={handleSubmit}>
            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.artistName")}
              </label>
              <input
                type="text"
                name="artistName"
                value={formData.artistName}
                onChange={handleChange}
                className="artist_registration-input-field"
                placeholder={t("artist_registration.enterArtistName")}
                required
                disabled={isProcessing} // Disable input if loading
              />
            </div>
            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="artist_registration-input-field"
                placeholder={t("artist_registration.enterEmail")}
                required
                disabled={isProcessing}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.phone")}
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="artist_registration-input-field"
                placeholder={t("artist_registration.enterPhoneNumber")}
                required
                disabled={isProcessing}
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.bio")}
              </label>
              <textarea
                name="bio"
                onChange={handleChange}
                value={formData.bio}
                className="artist_registration-textarea-field"
                rows="4"
                placeholder={t("artist_registration.tellUsAboutYourself")}
                disabled={isProcessing} // Disable input if loading
              ></textarea>
            </div>

            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.socialLink")}
              </label>
              <input
                type="text"
                name="socialLink"
                value={formData.socialLink}
                onChange={handleChange}
                className="artist_registration-input-field"
                placeholder={t("artist_registration.enterSocialMediaLink")}
                disabled={isProcessing} // Disable input if loading
              />
            </div>

            {/* Upload ảnh giấy tờ tùy thân */}
            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.proofOfIdentity")}
              </label>
              <input
                type="file"
                name="proofImages"
                onChange={handleFileChange}
                className="artist_registration-file-input"
                accept="image/*"
                multiple
                required
                disabled={isProcessing} // Disable input if loading
              />
              {formData.proofImages.length > 0 && (
                <div className="artist_registration-preview-container">
                  {formData.proofImages.map((img, index) => (
                    <div
                      key={index}
                      className="artist_registration-preview-item"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Proof ${index + 1}`}
                        className="artist_registration-preview-img"
                      />
                      <button
                        type="button"
                        className="artist_registration-remove-button"
                        onClick={() => handleRemoveImage("proofImages", index)}
                        disabled={isProcessing}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload ảnh nghệ sĩ */}
            <div className="artist_registration-input-group">
              <label className="artist_registration-input-label">
                {t("artist_registration.artistImage")}
              </label>
              <input
                type="file"
                name="artistImages"
                onChange={handleFileChange}
                className="artist_registration-file-input"
                accept="image/*"
                multiple
                required
                disabled={isProcessing}
              />
              {formData.artistImages.length > 0 && (
                <div className="artist_registration-preview-container">
                  {formData.artistImages.map((img, index) => (
                    <div
                      key={index}
                      className="artist_registration-preview-item"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Artist ${index + 1}`}
                        className="artist_registration-preview-img"
                      />
                      <button
                        type="button"
                        className="artist_registration-remove-button"
                        onClick={() => handleRemoveImage("artistImages", index)}
                        disabled={isProcessing}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="artist_registration-submit-button"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ClipLoader
                    size={20}
                    color={"#ffffff"}
                    loading={isProcessing}
                  />
                  {t("artist_registration.submitting")}
                </>
              ) : (
                t("artist_registration.submit")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistRegistration;
