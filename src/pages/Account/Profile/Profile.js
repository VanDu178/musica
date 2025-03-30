import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../config/axiosConfig";
import { handleSuccess, handleError } from "../../../helpers/toast";

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const Profile = () => {
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const { t, i18n } = useTranslation();
  const [previewImage, setPreviewImage] = useState(null); // Đổi tên từ imgTest thành previewImage
  const [userData, setUserData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý

  // const [daysList, setDaysList] = useState([]);

  // useEffect(() => {
  //   const days = Array.from(
  //     { length: getDaysInMonth(userData.month, userData.year) },
  //     (_, i) => i + 1
  //   );
  //   setDaysList(days);
  // }, [userData.month, userData.year]);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false); // Cờ theo dõi trạng thái xóa ảnh
  const fileInputRef = useRef(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/account/");
      if (response.status === 200) {
        if (response.data.image_path) {
          setPreviewImage(response.data.image_path); // Sử dụng previewImage
        }
        setUserData(response.data);
      }
    } catch (error) {
      console.log("Có lỗi xảy ra", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Sử dụng previewImage
      setUserData({ ...userData, image_path: file });
      setIsAvatarRemoved(false); // Đặt lại cờ khi người dùng chọn ảnh mới
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewImage(null); // Xóa ảnh xem trước
    setUserData({ ...userData, image_path: null }); // Đặt lại giá trị ảnh
    setIsAvatarRemoved(true); // Đặt cờ khi người dùng xóa ảnh
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSave = async () => {
    setIsProcessing(true); // Bắt đầu xử lý
    const userInfoUpdate = new FormData();
    userInfoUpdate.append("username", userData.username);

    // Kiểm tra trạng thái xóa ảnh
    if (isAvatarRemoved) {
      userInfoUpdate.append("image_path", ""); // Gửi giá trị rỗng nếu ảnh bị xóa
    } else if (userData.image_path instanceof File) {
      userInfoUpdate.append("image_path", userData.image_path); // Gửi ảnh mới nếu có
    }

    try {
      const response = await axiosInstance.put("/account/", userInfoUpdate, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        handleSuccess(t("profile.USER_UPDATE_SUCCESS"));
        navigate("/account/overview");
      }
    } catch (error) {
      const errorCode = error.response?.data?.message_code; // Lấy mã lỗi từ response của error
      const message = {
        USER_UPDATE_FAILED: t("profile.USER_UPDATE_FAILED"),
        IMAGE_UPLOAD_FAILED: t("profile.IMAGE_UPLOAD_FAILED"),
        IMAGE_PROCESSING_FAILED: t("profile.IMAGE_PROCESSING_FAILED"),
      };
      handleError(message[errorCode] || t("profile.UNKNOWN_ERROR")); // Thêm fallback nếu không có mã lỗi
    } finally {
      setIsProcessing(false); // Kết thúc xử lý
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button
          className="profile-back-btn"
          onClick={() => navigate("/account/overview")}
          disabled={isProcessing} // Vô hiệu hóa nút khi đang xử lý
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1 className="profile-title">{t("profile.editProfile")}</h1>
      </div>

      <div className="profile-form">
        <label className="profile-label">{t("profile.avt")}</label>
        <div className="profile-avatar-container">
          <div className="avatar-wrapper">
            <img
              src={
                previewImage != null
                  ? previewImage // Sử dụng previewImage
                  : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid"
              }
              alt="Avatar"
              className="profile-avatar"
            />
            {previewImage && (
              <button
                className="remove-avatar-icon"
                onClick={handleRemoveAvatar}
                disabled={isProcessing} // Vô hiệu hóa khi đang xử lý
              >
                <i className="fas fa-times"></i> {/* Icon xóa */}
              </button>
            )}
          </div>
          <label htmlFor="avatar-upload" className="custom-file-upload">
            {t("profile.chooseFile")}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            disabled={isProcessing} // Vô hiệu hóa khi đang xử lý
          />
        </div>

        <label className="profile-label">{t("profile.username")}</label>
        <input
          className="profile-input"
          type="text"
          value={userData.username || ""}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          disabled={isProcessing} // Vô hiệu hóa khi đang xử lý
        />

        <label className="profile-label">{t("profile.email")}</label>
        <input
          className="profile-input"
          type="email"
          value={userData.email || ""}
          readOnly
          disabled
        />

        {/* <label className="profile-label">{t("profile.gender")}</label>
        <select
          className="profile-input"
          value={userData.gender}
          onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
        >
          <option>{t("profile.male")}</option>
          <option>{t("profile.female")}</option>
          <option>{t("profile.other")}</option>
        </select> */}
        {/* 
        <label className="profile-label">{t("profile.birthday")}</label>
        <div className="profile-birthday-inputs">
          <select
            className="profile-input"
            value={userData.day}
            onChange={(e) => setUserData({ ...userData, day: e.target.value })}
          >
            {daysList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className="profile-input"
            value={userData.month}
            onChange={(e) =>
              setUserData({ ...userData, month: e.target.value })
            }
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {t(`profile.months.${i + 1}`)}
              </option>
            ))}
          </select>
          <select
            className="profile-input"
            value={userData.year}
            onChange={(e) => setUserData({ ...userData, year: e.target.value })}
          >
            {[...Array(new Date().getFullYear() - 1900 + 1)]
              .map((_, i) => (
                <option key={1900 + i} value={1900 + i}>
                  {1900 + i}
                </option>
              ))
              .reverse()}
          </select>
        </div> */}

        {/* <label className="profile-label">{t("profile.country")}</label>
        <select
          className="profile-input"
          value={userData.country}
          onChange={(e) =>
            setUserData({ ...userData, country: e.target.value })
          }
        >
          <option>{t("profile.vietnam")}</option>
        </select> */}

        <div className="profile-button-group">
          <button
            className="profile-cancel-btn"
            onClick={() => navigate("/account/overview")}
            readOnly={isProcessing}
            disabled={isProcessing} // Vô hiệu hóa khi đang xử lý
          >
            {t("profile.cancel")}
          </button>
          <button
            className="profile-save-btn"
            onClick={handleSave}
            readOnly={isProcessing}
            disabled={isProcessing}
          >
            {isProcessing ? t("profile.saving") : t("profile.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
