import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/loginSlice";
import axios from "../../api/authIssueUserApi/axiosInstance";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doLogout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    delete axios.defaults.headers.common["Authorization"];

    dispatch(logout());
    navigate("/member/login");
  };

  return doLogout;
};

export default useLogout;
