import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/loginSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get state from redux
  const reduxNickname = useSelector((state) => state.login.user?.nickname);
  const reduxEmail = useSelector((state) => state.login.user?.email);
  const isLoggedInRedux = useSelector((state) => state.login.isLoggedIn);

  // Local login state fallback (from localStorage)
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loginUser");
    if (stored) {
      setLoginUser(JSON.parse(stored));
    }
  }, []);

  const currentNickname = reduxNickname || loginUser?.nickname;
  const isLoggedIn = isLoggedInRedux || !!loginUser;

  const handleLogout = () => {
    // Clear Redux
    dispatch(logout());
    // Clear localStorage
    localStorage.removeItem("loginUser");
    setLoginUser(null);
    // Redirect
    navigate("/");
  };

  return (
    <div className="flex justify-between w-full items-center mx-auto bg-white px-3">
      <div className="container flex justify-between w-[1020px] py-2 items-center mx-auto">
        <h1>
          <Link to="/">
            <img
              src="/images/main_icon.png"
              alt="main icon"
              className="w-full max-w-[90%] h-auto md:max-w-[600px] sm:max-w-[90%] object-contain"
            />
          </Link>
        </h1>

        <ul className="flex gap-3 items-center text-sm">
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/mypage"
                  className="font-semibold text-purple-500 hover:underline"
                >
                  {currentNickname} 님, 반갑습니다!
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:underline"
                >
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/member/login">
                <p className="text-sm text-gray-400 hover:underline">로그인</p>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;
