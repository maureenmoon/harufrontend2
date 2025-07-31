import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../../slices/loginSlice";
import { fetchCurrentMember } from "../../api/authIssueUserApi/memberApi";
import {
  getAccessToken,
  getRefreshToken,
  getUserData,
  removeAllAppCookies,
  removeUserData,
} from "../../utils/cookieUtils";

export default function useInitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      // Add a small delay to ensure cookies are set after login
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if we have user data in our frontend cookie
      const user = getUserData();

      console.log("🔍 Auth init - checking frontend user data:", {
        user: user ? "exists" : "none",
      });

      if (user) {
        console.log("🔍 User data found:", user.nickname);
      }

      // If we have valid user data, we can proceed
      if (user && user.email && user.nickname) {
        console.log("🔍 Valid user data found, user:", user.nickname);
        // User data exists and is valid, we can proceed without fetching
        return;
      }

      console.log("🔍 No valid user data found, checking authentication...");

      try {
        // Check if user is authenticated by calling the backend
        // The backend will check the HttpOnly cookies automatically
        const userData = await fetchCurrentMember();

        // Validate that we got a proper user response
        if (!userData || !userData.nickname) {
          console.log("❌ Invalid user response:", userData);
          throw new Error("Invalid user response");
        }

        console.log("✅ Authentication successful, user:", userData.nickname);

        // Always dispatch login to ensure Redux state is updated
        // This will also update the userData cookie with fresh data
        dispatch(login(userData));
      } catch (err) {
        console.error("❌ Auth init failed:", err);

        // Only clear cookies if it's an authentication error (401, 403)
        // Don't clear cookies for network errors or server errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log("🧹 Authentication failed, clearing cookies...");
          removeAllAppCookies();
          removeUserData();
          dispatch(logout());
        } else {
          console.log(
            "⚠️ Network or server error, keeping cookies for retry..."
          );
          // Don't clear cookies, just log out the user state
          dispatch(logout());
        }
      }
    };

    initAuth();
  }, []);
}
