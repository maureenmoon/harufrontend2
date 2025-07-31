import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../../slices/loginSlice";
import { fetchCurrentMember } from "../../api/authIssueUserApi/memberApi";
import axios from "../../api/authIssueUserApi/axiosInstance";

export default function useInitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        dispatch(logout());
        return;
      }

      try {
        // 🔐 Automatically refreshes token if expired
        const user = await fetchCurrentMember();
        dispatch(login(user));
      } catch (err) {
        console.error("❌ Auth init failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
      }
    };

    initAuth();
  }, []);
}
