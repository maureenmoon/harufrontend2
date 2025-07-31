// import React from "react";
// import { Link, Outlet, Route, Routes } from "react-router-dom";
// import ProfileSearch from "./ProfileSearch";
// import EditProfile from "./EditProfile";
// import WithDrawMembership from "./WithdrawMembership";
// import ChatBot from "../../components/chatbot/ChatBot";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../slices/loginSlice";
import {
  fetchCurrentMember,
  updatePhoto,
} from "../../api/authIssueUserApi/memberApi";
import { uploadProfileImageWithCleanup } from "../../utils/imageUpload/uploadImageToSupabase";
import { getUserInfo, updateUserPhoto } from "../../utils/cookieUtils";
import calculateCalories from "../../components/mypage/calculateCalories";
import SubLayout from "../../layout/SubLayout";
import ProfileImage from "../../components/mypage/ProfileImage";
import DebugAuthOverlay from "../../components/mypage/DebugAuthOverlay";
import useLogout from "../../utils/memberJwtUtil/useLogout";
import InfoList from "../../components/mypage/InfoList";
import { Link, useNavigate } from "react-router-dom";

export default function MyPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.login.user);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const navigate = useNavigate();

  // Debug: Log current user data
  console.log("MyPage - Current user data:", currentUser);
  console.log("MyPage - profileImageUrl URL:", currentUser?.profileImageUrl);

  // Calculate recommended calories
  const recommendedCalories =
    currentUser?.birthAt &&
    currentUser?.gender &&
    currentUser?.height &&
    currentUser?.weight &&
    currentUser?.activityLevel
      ? calculateCalories({
          birthAt: currentUser.birthAt,
          gender: currentUser.gender,
          height: currentUser.height,
          weight: currentUser.weight,
          activityLevel: currentUser.activityLevel,
        })
      : null;

  // Handle profile image upload
  const handleImageChange = async (file) => {
    try {
      setIsLoading(true);
      console.log("🖼️ Starting profile image upload from MyPage...");

      // Get current user info using unified structure
      const currentUserInfo = getUserInfo();
      const currentImageUrl = currentUserInfo?.profileImageUrl;
      console.log("🖼️ Current image URL for cleanup:", currentImageUrl);

      // Upload optimized profile image to Supabase with cleanup
      const uploadResult = await uploadProfileImageWithCleanup(
        file,
        currentImageUrl
      );
      console.log("✅ Profile image upload result:", uploadResult);
      console.log("🔧 DEBUG: MyPage received imageUrl:", uploadResult.imageUrl);

      // Get current user ID from unified userData
      if (!currentUserInfo) {
        throw new Error("User not found in userData");
      }

      const memberId = currentUserInfo.memberId;
      if (!memberId) {
        throw new Error("Member ID not found in user data");
      }

      // Update backend with new profileImageUrl file name
      await updatePhoto(uploadResult.fileName);

      // Fetch updated user data from backend
      const updatedUserData = await fetchCurrentMember();
      console.log(
        "🔧 DEBUG: MyPage - fetched updated user data:",
        updatedUserData
      );

      // Update Redux state with fresh user data
      if (updatedUserData) {
        console.log(
          "🔧 DEBUG: MyPage - dispatching editProfile with:",
          updatedUserData
        );

        // Force update the profileImageUrl URL in case backend didn't return it
        const userDataWithPhoto = {
          ...updatedUserData,
          profileImageUrl: uploadResult.fileName, // Use the new image URL from Supabase
        };

        console.log(
          "🔧 DEBUG: MyPage - forcing profileImageUrl URL update:",
          userDataWithPhoto
        );
        dispatch(editProfile(userDataWithPhoto));
      }

      // Also update the cookie directly using utility function
      updateUserPhoto(uploadResult.fileName);

      console.log("📊 Image optimization stats:");
      console.log(
        "   Original size:",
        (uploadResult.originalSize / 1024).toFixed(2),
        "KB"
      );
      console.log(
        "   Optimized size:",
        (uploadResult.optimizedSize / 1024).toFixed(2),
        "KB"
      );
      console.log(
        "   Compression ratio:",
        (
          (1 - uploadResult.optimizedSize / uploadResult.originalSize) *
          100
        ).toFixed(1) + "%"
      );

      alert("프로필 사진이 업로드되었습니다.");
    } catch (error) {
      const message =
        error.response?.data?.message || "프로필 사진 업로드에 실패했습니다.";
      alert(message);
      console.error("❌ Image upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentMember(); // Triggers refresh if accessToken is expired
        console.log("MyPage - Fetched user data:", userData);

        // Update Redux state with fresh user data
        if (userData) {
          dispatch(
            editProfile({
              ...userData,
              memberId: userData.id || userData.memberId,
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [dispatch]);

  if (!currentUser) return null;

  return (
    // <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
    //   <nav className="flex flex-col sm:flex-row justify-around sm:justify-start gap-4 sm:gap-10 mb-6  pb-4  font-semibold text-lg">
    //     <Link to="profile" className="hover:text-blue-600"></Link>
    //     <Link to="edit" className="hover:text-blue-600"></Link>
    //     <Link to="withdraw" className="hover:text-red-600"></Link>
    //   </nav> *
    //   <div className="bg-white p-6 sm:p-10 shadow-md rounded-xl">
    //     <Outlet />
    //     {/* 챗봇 */}
    //     <ChatBot />

    <div className="w-full max-w-[1020px] mx-auto px-4">
      <SubLayout to="/dashboard" menu="마이페이지" label="내 정보" />

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4">
            <ProfileImage
              photo={currentUser.profileImageUrl}
              currentImage={currentUser.profileImageUrl}
              nickname={currentUser.nickname}
              onImageChange={handleImageChange}
              size="large"
              useThumbnail={false} // Disable thumbnails for profile images
            />
            <h2 className="text-2xl font-bold">{currentUser.nickname}</h2>
            <p className="text-gray-600">{currentUser.email}</p>
          </div>

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
                  value:
                    {
                      HIGH: "매우 활동적",
                      MODERATE: "활동적",
                      LOW: "낮음",
                    }[currentUser.activityLevel] || "활동적",
                },
                {
                  label: "목표 칼로리",
                  value: `${
                    currentUser.targetCalories ||
                    recommendedCalories ||
                    "계산 불가"
                  } kcal`,
                },
                {
                  label: "추천 칼로리",
                  value: recommendedCalories
                    ? `${recommendedCalories} kcal`
                    : "계산 불가",
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
            <button
              onClick={() => navigate("/member/change-password")}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 text-center"
            >
              비밀번호 변경
            </button>
            <Link
              to="/mypage/withdraw"
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 text-center"
            >
              회원탈퇴
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
