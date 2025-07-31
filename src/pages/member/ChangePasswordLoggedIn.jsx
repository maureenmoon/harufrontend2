import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormInput from "../../components/mypage/FormInput";

export default function ChangePasswordLoggedIn() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    } else if (form.newPassword.length < 4 || form.newPassword.length > 20) {
      newErrors.newPassword = "비밀번호는 4~20자여야 합니다.";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "새 비밀번호 확인을 입력해주세요.";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/members/${user.memberId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `newPassword=${encodeURIComponent(form.newPassword)}`,
      });

      if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/mypage");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => navigate("/member/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-24 px-4 bg-white">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 변경</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              현재 비밀번호
            </label>
            <FormInput
              name="currentPassword"
              id="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력하세요"
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500 ml-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              새 비밀번호
            </label>
            <FormInput
              name="newPassword"
              id="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="영어대문자,숫자,특수문자 포함, 4~20자"
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 ml-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              새 비밀번호 확인
            </label>
            <FormInput
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력하세요"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 ml-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                변경 중...
              </>
            ) : (
              "비밀번호 변경"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/mypage")}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
