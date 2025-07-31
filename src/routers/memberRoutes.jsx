import ChangePassword from "../pages/member/ChangePassword";
import ChangePasswordLoggedIn from "../pages/member/ChangePasswordLoggedIn";
import Login from "../pages/member/Login";
import SearchNickname from "../pages/member/SearchNickname";
import Signup from "../pages/member/Signup";
import MyPage from "../pages/mypage/MyPage";

const memberRoutes = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "reset-password",
    element: <ChangePassword />, // For forgotten password
  },
  {
    path: "change-password",
    element: <ChangePasswordLoggedIn />, // For logged-in users
  },
  {
    path: "search-nickname",
    element: <SearchNickname />,
  },
];

export default memberRoutes;
