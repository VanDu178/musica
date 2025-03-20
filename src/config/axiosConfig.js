import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import thư viện toast
import auth from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshToken = async () => {
  try {
    const refresh_token = Cookies.get("refresh_token");
    if (!refresh_token) {
      console.error("No refresh token found.");
      auth.logout(); // Gọi hàm logout khi không có refresh token
      return null;
    }

    const response = await axiosInstance.post("/auth/refresh/", {
      refresh: refresh_token,
    });

    if (response.status === 200) {
      Cookies.set("access_token", response.data.access, { expires: 0.02 });
      Cookies.set("refresh_token", response.data.refresh, { expires: 7 });
      console.log("Token refreshed successfully.", response);
      // return response.data.access;
    } else {
      console.error("Failed to refresh token.");
      auth.logout();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    auth.logout();
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // Nếu là FormData, để trống để trình duyệt tự động thiết lập
      config.headers["Content-Type"] = "multipart/form-data";
    }

    let token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      // originalRequest._retry = true;
      try {
        const newToken = await refreshToken();

        // if (newToken) {
        //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //   return axiosInstance(originalRequest);
        // }
      } catch (err) {
        auth.logout(); // Gọi hàm logout khi không thể refresh token
        window.location.href = "/login";
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."); // Hiển thị thông báo lỗi
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
