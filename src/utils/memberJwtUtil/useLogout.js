import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/loginSlice";
import { logoutMember } from "../../api/authIssueUserApi/memberApi";
import axios from "../../api/authIssueUserApi/axiosInstance";
import {
  removeAllAppCookies,
  getAccessToken,
  getRefreshToken,
  getUserData,
  getTodayCalories,
  getTodayNutrients,
  getMealData,
  debugAllCookies,
} from "../../utils/cookieUtils";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data from Redux state
  const { user } = useSelector((state) => state.login);

  const doLogout = async () => {
    console.log("🔓 Logging out...");
    console.log("🔍 User info before logout:", {
      nickname: user?.nickname,
      role: user?.role,
      email: user?.email,
    });
    console.log("🔍 Before logout - all cookies:");
    debugAllCookies();
    console.log("🔍 Before logout - specific cookies:", {
      accessToken: getAccessToken() ? "exists" : "none",
      refreshToken: getRefreshToken() ? "exists" : "none",
      user: getUserData() ? "exists" : "none",
      todayCalories: getTodayCalories(),
      todayNutrients: getTodayNutrients(),
      mealData: getMealData().length,
    });

    try {
      // Call backend logout endpoint to clear cookies
      console.log("📡 Calling backend logout...");
      await logoutMember();
      console.log("✅ Backend logout successful");
    } catch (error) {
      console.error("❌ Backend logout failed:", error);
      // Continue with frontend logout even if backend fails
    } finally {
      // Clear all app data cookies (comprehensive cleanup)
      console.log("🧹 Clearing all app cookies...");
      removeAllAppCookies();

      // Clear localStorage to prevent hybrid state
      console.log("🧹 Clearing localStorage...");
      const authKeys = [
        "accessToken",
        "refreshToken",
        "user",
        "loginUser",
        "authToken",
        "token",
        "memberData",
        "userData",
      ];

      authKeys.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🧹 Removed localStorage key: ${key}`);
        }
      });

      // Clear axios headers
      console.log("🧹 Clearing axios headers...");
      delete axios.defaults.headers.common["Authorization"];

      // Clear Redux state
      console.log("🧹 Clearing Redux state...");
      dispatch(logout());

      // Force clear any remaining cookies with multiple attempts
      console.log("🧹 Force clearing cookies...");
      const cookiesToClear = [
        "frontendUserData",
        "userData",
        "accessToken",
        "refreshToken",
        "todayCalories",
        "todayNutrients",
        "mealData",
      ];

      cookiesToClear.forEach((cookieName) => {
        // Clear with different path variations
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });

      console.log("🔍 After logout - all cookies:");
      debugAllCookies();
      console.log("🔍 After logout - specific cookies:", {
        accessToken: getAccessToken() ? "exists" : "none",
        refreshToken: getRefreshToken() ? "exists" : "none",
        user: getUserData() ? "exists" : "none",
        todayCalories: getTodayCalories(),
        todayNutrients: getTodayNutrients(),
        mealData: getMealData().length,
      });

      // Navigate to login
      console.log("🚀 Navigating to login page...");
      navigate("/member/login");
    }
  };

  return doLogout;
};

export default useLogout;
