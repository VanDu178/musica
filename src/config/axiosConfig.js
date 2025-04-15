import axios from "axios";
import Cookies from "js-cookie";

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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    try {
      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        console.error("No refresh token found.");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("secrect_key");
        return Promise.reject(error);
      }

      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const { data } = await axios.post(
          process.env.REACT_APP_API_URL + "/auth/refresh/",
          {
            refresh: refreshToken,
          }
        );
        if (data?.access && data?.refresh) {
          Cookies.set("access_token", data.access, { expires: 7 }); // 30 phút
          Cookies.set("refresh_token", data.refresh, { expires: 7 });

          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return axios(originalRequest);
        }
        return;
      }
    } catch (refreshError) {
      console.error("Error refreshing token:", refreshError);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("secrect_key");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
