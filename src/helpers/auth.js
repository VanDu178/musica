// import Cookies from "js-cookie";
// import axiosInstance from "../config/axiosConfig";

// export const refreshToken = async () => {
//   try {
//     const refresh_token = Cookies.get("refresh_token");

//     if (!refresh_token) {
//       console.error("No refresh token found.");

//       return null;
//     }

//     const response = await axiosInstance.post("/auth/refresh/", {
//       refresh: refresh_token,
//     });

//     if (response.status === 200) {
//       Cookies.remove("access_token");
//       Cookies.remove("refresh_token");
//       Cookies.set("access_token", response.data.access, { expires: 0.02 }); // 30 phút
//       Cookies.set("refresh_token", response.data.refresh, { expires: 7 }); // 7 ngày
//       return response.data.access;
//     } else {
//       console.error("Failed to refresh token. Status:", response.status);

//       return null;
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error.message);

//     return null;
//   }
// };
