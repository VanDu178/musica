import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null); // Thêm state để lưu lỗi

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/account/");
      if (response.status === 200) {
        setUserData(response.data);
        setError(null); // Xóa lỗi nếu lấy thông tin thành công
      }
    } catch (error) {
      if (error.response) {
        // Xử lý lỗi từ backend
        const { message_code, details } = error.response.data;
        if (message_code === "USER_NOT_AUTHENTICATED") {
          setError("Người dùng chưa được xác thực. Vui lòng đăng nhập.");
        } else if (message_code === "USER_FETCH_FAILED") {
          setError("Không thể lấy thông tin người dùng. Chi tiết: " + details);
        } else {
          setError("Đã xảy ra lỗi không xác định.");
        }
      } else {
        // Xử lý lỗi không từ backend (lỗi mạng, v.v.)
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
      console.error("Có lỗi xảy ra khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userData, getUserInfo, setUserData, error }}>
      {children}
    </UserContext.Provider>
  );
};
