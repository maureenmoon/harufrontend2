import { refreshAccessToken } from "../authIssueUserApi/tokenUtil";
import axios from "axios";

const instance = axios.create();

// ✅ Attach Authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  //no refresh token if undefined or missing
  if (token && token !== "undefined") {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401 error
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const refreshToken = localStorage.getItem("refreshToken");
    const shouldTryRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken &&
      refreshToken !== "undefined" &&
      !originalRequest.url.includes("/refresh");

    // Only try refresh once for a 401 error
    if (shouldTryRefresh) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken(); // new token stored
        originalRequest.headers["Authorization"] =
          "Bearer " + localStorage.getItem("accessToken");
        console.log(
          "🧪 accessToken in axiosInstance:",
          localStorage.getItem("accessToken")
        );

        return instance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // Prevent infinite loop by clearing tokens and redirecting
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        //window.location.href = "/login"; // optional redirect
        return Promise.reject(refreshError); // don't retry again
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
