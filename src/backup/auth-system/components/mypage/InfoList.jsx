import React from "react";

export default function InfoList({ user, passwordMask = true }) {
  const maskPassword = (password) =>
    !password || password.length < 2 ? "●●●●●●●" : "●".repeat(password.length);

  return (
    <ul className="mt-6 text-sm sm:text-base text-gray-700 space-y-2 text-left max-w-md mx-auto">
      <li className="flex justify-between">
        <span>목표 카로리(kcal)</span>
        <span>{user.targetCalories ?? "-"}</span>
      </li>
      <li className="flex justify-between">
        <span>활동량</span>
        <span>{user.activityLevel ?? "-"}</span>
      </li>
      <li className="flex justify-between">
        <span>키 (cm)</span>
        <span>{user.height ?? "-"}</span>
      </li>
      <li className="flex justify-between">
        <span>체중 (kg)</span>
        <span>{user.weight ?? "-"}</span>
      </li>
      <li className="flex justify-between">
        <span>이름</span>
        <span>{user.name ?? "-"}</span>
      </li>
      <li className="flex justify-between">
        <span>비밀번호</span>
        <span>
          {passwordMask ? maskPassword(user.password) : user.password}
        </span>
      </li>
    </ul>
  );
}
