import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import thư viện toast
import { useContext } from "react"; // Import useContext
import { AuthContext } from "../context/AuthContext";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Lấy hàm refreshToken từ AuthContext
      const { refreshToken, logout } = useContext(AuthContext);
      try {
        // Gọi hàm refreshToken để lấy token mới
        const newToken = await refreshToken();

        if (newToken) {
          // Gán token mới vào header Authorization
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        logout(); // Gọi hàm logout khi không thể lấy token mới
        window.location.href = "/login";
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."); // Hiển thị thông báo lỗi
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
