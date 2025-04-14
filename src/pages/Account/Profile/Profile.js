import React, { useState, useEffect, useRef, useContext, use } from "react";
import "./Profile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../config/axiosConfig";
import { handleSuccess, handleError } from "../../../helpers/toast";
import { useUserData } from "../../../context/UserDataProvider";
import { useUser } from "../../../context/UserProvider";
import Forbidden from "../../../components/Error/403/403";
import Loading from "../../../components/Loading/Loading";
import { storeCachedData } from "../../../helpers/cacheDataHelper";

const Profile = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userData, setUserData, isLoggedIn } = useUserData();
  const { getUserInfo, error } = useUser();
  const [imageCover, setImageCover] = useState(null);
  const [userDataUpdate, setUserDataUpdate] = useState({ ...userData });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const [validRole, setValidRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Vì cả 3 role đều có thể truy cập vào trnag này nên không cần check role
  useEffect(() => {
    setIsLoading(true);
    const fetchRole = async () => {
      if (isLoggedIn) {
        setValidRole(true);
        getUserInfo();
      }
    };

    fetchRole();
    setIsLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      if (userData?.image_path != null) {
        setImageCover(userData?.image_path);
      } else {
        setImageCover(null);
      }
    }
  }, [userData]);

  useEffect(() => {
    setUserDataUpdate({ ...userData });
  }, [userData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setImageCover(file);
  };

  const handleRemoveAvatar = () => {
    if (userData?.image_path === imageCover) {
      setImageCover(null);
    } else {
      setImageCover(userData?.image_path);
    }
    setUserDataUpdate({ ...userDataUpdate, image_path: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSave = async () => {
    const userInfoUpdate = new FormData();
    //Khong thay doi gi
    if (
      userData?.name === userDataUpdate?.name &&
      imageCover === userData?.image_path
    ) {
      return;
    } else if (imageCover != userData?.image_path && imageCover != null) {
      //TH co thay doi hinh anh

      userInfoUpdate.append("name", userDataUpdate?.name);
      userInfoUpdate.append("image_path", imageCover);
      userInfoUpdate.append("action", "change_image");
    } else if (
      imageCover === userData?.image_path &&
      userData?.name != userDataUpdate?.name
    ) {
      userInfoUpdate.append("name", userDataUpdate?.name);
      userInfoUpdate.append("image_path", imageCover);
      userInfoUpdate.append("action", "change_name");
    } else if (imageCover === null && imageCover != userData?.image_path) {
      userInfoUpdate.append("name", userDataUpdate?.name);
      userInfoUpdate.append("image_path", imageCover);
      userInfoUpdate.append("action", "delete_image");
    }
    setIsProcessing(true);
    try {
      const response = await axiosInstance.put(
        "/account/update-info/",
        userInfoUpdate,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.status === 200) {
        const CACHE_KEY = "userInfo";
        setUserData(response.data?.user);
        //Cache du lieu vao local
        const userDataToCache = {
          userData: response?.data?.user,
        };
        storeCachedData(CACHE_KEY, userDataToCache);
        handleSuccess(t("profile.USER_UPDATE_SUCCESS"));
      }
    } catch (error) {
      handleError(t("profile.ERROR_OCCURRED"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <Loading message={t("utils.loading")} height="60" />;
  }

  if (!isLoggedIn) {
    return <Forbidden />;
  }
  return (
    <div className="profile-container">
      <div className="profile-header">
        <button
          className="profile-back-btn"
          onClick={() => navigate(-1)}
          disabled={isProcessing}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1 className="profile-title">{t("profile.editProfile")}</h1>
      </div>

      <div className="profile-form">
        <label className="profile-label">{t("profile.avt")}</label>
        <div className="profile-avatar-container">
          <div className="avatar-wrapper">
            {imageCover === userData?.image_path && imageCover != null ? (
              <img
                src={imageCover}
                alt="Album Cover"
                className="profile-avatar"
              />
            ) : imageCover && imageCover != null ? (
              <img
                src={URL.createObjectURL(imageCover)}
                alt="Album Cover"
                className="profile-avatar"
              />
            ) : null}
            {imageCover === null && (
              <img
                src="../../images/default-avt-img.jpeg"
                alt="Album Cover"
                className="profile-avatar"
              />
            )}

            {imageCover && (
              <button
                className="remove-avatar-icon"
                onClick={handleRemoveAvatar}
                disabled={isProcessing || error} // Vô hiệu hóa khi đang xử lý
              >
                <i className="fas fa-times"></i> {/* Icon xóa */}
              </button>
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="custom-file-upload"
            disabled={isProcessing || error}
          >
            {t("profile.chooseFile")}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            disabled={isProcessing || error} // Vô hiệu hóa khi đang xử lý
          />

          {error && (
            <>
              <label className="error_message">
                Không thể thực hiện chỉnh sửa thông tin
              </label>
              <label className="error_message">Thông báo: {error}</label>
            </>
          )}
        </div>

        <label className="profile-label">{t("profile.username")}</label>

        <input
          type="text"
          value={userDataUpdate?.name || ""}
          className="profile-input"
          onChange={(e) =>
            setUserDataUpdate({ ...userDataUpdate, name: e.target.value })
          }
          readOnly={isProcessing || error} // Chỉ ngừng chỉnh sửa khi đang xử lý
        />

        <label className="profile-label">{t("profile.email")}</label>
        <input
          className="profile-input"
          type="email"
          value={userDataUpdate?.email || ""}
          readOnly
          disabled
        />

        <div className="profile-button-group">
          <button
            className="profile-save-btn"
            onClick={handleSave}
            // readOnly={isProcessing || error}
            disabled={isProcessing || error}
          >
            {isProcessing ? t("profile.saving") : t("profile.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
