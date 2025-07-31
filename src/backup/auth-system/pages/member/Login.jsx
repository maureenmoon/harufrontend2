import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login as loginAction } from "../../slices/loginSlice";
// import { login } from "../../slices/loginSlice";

import {
  validateNickname,
  validatePassword,
} from "../../utils/memberJwtUtil/validatos";
import FormInput from "../../components/mypage/FormInput";
import {
  fetchCurrentMember,
  loginMember,
} from "../../api/authIssueUserApi/memberApi"; // <-- Use new API
import { jwtDecode } from "jwt-decode";
import axios from "../../api/authIssueUserApi/axiosInstance";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateNickname(form.nickname)) {
      newErrors.nickname = "영어소문자 또는 숫자, 4~12자";
    }

    if (!validatePassword(form.password)) {
      newErrors.password = "영어대문자,숫자,특수문자 포함, 4~20자";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    //clear any stale tokens before login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      // calling API
      const res = await loginMember(form.nickname, form.password);

      const { accessToken, refreshToken } = res.data; //JWToken

      // store token to localstorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("🔐 accessToken", accessToken);
      console.log("🔐 refreshToken", refreshToken);
      console.log("✅ Stored in localStorage", {
        access: localStorage.getItem("accessToken"),
        refresh: localStorage.getItem("refreshToken"),
      });

      //decode token to store user info in Redux
      // const decoded = jwtDecode(accessToken); //show what is in the token
      // dispatch(loginAction(decoded)); // Use decoded token info for Redux if needed
      const user = await fetchCurrentMember(); // GET /me

      // dispatch(loginAction(user)); //createAsyncThunk-handles everything inside

      dispatch(
        login({
          ...user,
          memberId: user.id, // ✅ rename to avoid 'id' ambiguity
        })
      );

      // Set default Authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "로그인에 실패했습니다.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-24 px-4 bg-white">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <FormInput
              name="nickname"
              id="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="영어 소문자 또는 숫자, 4~12자"
              disabled={isLoading}
            />
            {errors.nickname && (
              <p className="text-xs text-red-500 ml-1">{errors.nickname}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <FormInput
              name="password"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="영어대문자,숫자,특수문자 포함, 4~20자"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-red-500 ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <Link to="/member/search-nickname" className="hover:underline">
            닉네임 찾기
          </Link>
          <Link to="/member/reset-password" className="hover:underline">
            비밀번호 변경
          </Link>
          <Link to="/member/signup" className="hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
