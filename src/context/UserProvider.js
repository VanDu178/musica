import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../config/axiosConfig";
import { useUserData } from "./UserDataProvider";
import { useTranslation } from "react-i18next";
import { checkData } from "../helpers/encryptionHelper";

// Tạo UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { userData, setUserData, isLoggedIn, setIsLoggedIn } = useUserData();
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const getUserInfo = async () => {
    //check role user before call api
    const checkedRoleUser = await checkData(3);
    if (checkedRoleUser) {
      try {
        const response = await axiosInstance.get("/account/");
        if (response?.status === 200) {
          setUserData(response?.data);
          setError(null);
        }
      } catch (error) {
        if (error?.response) {
          const { message_code, details } = error.response?.data;
          setUserData({});
          if (message_code === "USER_NOT_AUTHENTICATED") {
            setError(t("profile.USER_NOT_AUTHENTICATED"));
            setIsLoggedIn(false);
          } else {
            setError(t("profile.SYSTEM_ERROR"));
          }
        } else {
          setError(t("profile.SERVER_UNAVAILABLE"));
        }
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ getUserInfo, error }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng UserContext
export const useUser = () => {
  return useContext(UserContext);
};
