import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import InfoList from "../../components/mypage/InfoList";
import ProfileImage from "../../components/mypage/ProfileImage";
import SubLayout from "../../layout/SubLayout";
import { fetchCurrentMember } from "../../api/authIssueUserApi/memberApi";
import useLogout from "../../utils/memberJwtUtil/useLogout";

export default function MyPage() {
  const currentUser = useSelector((state) => state.login.user);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();

  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchCurrentMember(); // Triggers refresh if accessToken is expired
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    loadUser();
  }, []);

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4">
      <SubLayout to="/" menu="마이페이지" label="내 정보" />

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4">
            <ProfileImage
              currentImage={currentUser.photo}
              readOnly
              size="large"
            />
            <h2 className="text-2xl font-bold">{currentUser.nickname}</h2>
            <p className="text-gray-600">{currentUser.email}</p>
          </div>

          {/* Stats Section (if you later restore getActivityStats) */}
          {!isLoading && stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">총 식사 기록</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.totalMeals}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">평균 칼로리</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.avgCalories} kcal
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">목표 달성률</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.goalAchievement}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">연속 기록</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.streak}일
                </p>
              </div>
            </div>
          )}

          {/* User Info Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">기본 정보</h3>
            <InfoList
              items={[
                { label: "이름", value: currentUser.name },
                {
                  label: "성별",
                  value: currentUser.gender === "FEMALE" ? "여성" : "남성",
                },
                { label: "생년월일", value: currentUser.birthAt },
                { label: "키", value: `${currentUser.height} cm` },
                { label: "몸무게", value: `${currentUser.weight} kg` },
                {
                  label: "활동량",
                  value: {
                    HIGH: "매우 활동적",
                    MEDIUM: "활동적",
                    LOW: "낮음",
                  }[currentUser.activityLevel],
                },
                {
                  label: "목표 칼로리",
                  value: `${currentUser.targetCalories} kcal`,
                },
              ]}
            />
          </div>

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Link
              to="/mypage/edit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 text-center"
            >
              프로필 수정
            </Link>
            <Link
              to="/mypage/withdraw"
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 text-center"
            >
              회원탈퇴
            </Link>
          </div>
        </div>
      </div>
      <div>
        <h1>My Page</h1>
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
