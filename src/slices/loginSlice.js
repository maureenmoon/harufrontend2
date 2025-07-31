import { createSlice } from "@reduxjs/toolkit";
import {
  getUserData,
  setUserData,
  setAccessToken,
  setRefreshToken,
  removeAllAppCookies,
  removeUserData,
  hasValidTokens,
  calculateRecommendedCalories,
  setTodayCalories,
  setTodayNutrients,
  setMealData,
  createUserData,
} from "../utils/cookieUtils";

// Check for existing user data (cookie-based)
const storeUser = getUserData();
// Don't check for tokens since they're HttpOnly and can't be read by JavaScript
// const hasTokens = hasValidTokens();

console.log("🔍 Redux init - storeUser:", storeUser);
console.log(
  "🔍 Redux init - storeUser keys:",
  storeUser ? Object.keys(storeUser) : "null"
);
console.log("🔍 Redux init - storeUser has email:", !!storeUser?.email);
console.log("🔍 Redux init - storeUser has nickname:", !!storeUser?.nickname);

const emptyUser = {
  email: "",
  nickname: "",
  memberId: null,
  name: "",
  height: null,
  weight: null,
  targetCalories: null,
  activityLevel: "",
  role: "",
  photo: "",
};

// Only consider user logged in if we have valid user data
const isValidUser = storeUser && storeUser.nickname && storeUser.email;
console.log("🔍 Redux init - isValidUser:", isValidUser);
console.log("🔍 Redux init - isValidUser breakdown:", {
  hasStoreUser: !!storeUser,
  hasNickname: !!storeUser?.nickname,
  hasEmail: !!storeUser?.email,
});

const initState = {
  isLoggedIn: isValidUser, // Only check user data, not tokens
  user: isValidUser ? storeUser : { ...emptyUser },
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: initState,
  reducers: {
    login: (state, action) => {
      console.log("🔍 Redux login action - payload:", action.payload);
      console.log(
        "🔍 Redux login action - payload keys:",
        Object.keys(action.payload || {})
      );
      console.log(
        "🔍 Redux login action - payload has email:",
        !!action.payload?.email
      );
      console.log(
        "🔍 Redux login action - payload has nickname:",
        !!action.payload?.nickname
      );

      const updatedUser = { ...state.user, ...action.payload };

      // Calculate recommended calories based on user data
      const recommendedCalories = calculateRecommendedCalories(updatedUser);
      updatedUser.recommendedCalories = recommendedCalories;

      console.log("🔍 Redux login action - updatedUser:", updatedUser);
      console.log(
        "🔍 Redux login action - updatedUser keys:",
        Object.keys(updatedUser)
      );

      // Validate that we have essential user data before storing
      if (!updatedUser.email || !updatedUser.nickname) {
        console.error("❌ Redux login action - missing essential user data:", {
          email: updatedUser.email,
          nickname: updatedUser.nickname,
          hasEmail: !!updatedUser.email,
          hasNickname: !!updatedUser.nickname,
        });
      }

      // Create unified userData structure
      const unifiedUserData = createUserData({
        memberId: updatedUser.memberId || updatedUser.id,
        nickname: updatedUser.nickname,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl || updatedUser.photo,
        accessToken: updatedUser.accessToken,
        refreshToken: updatedUser.refreshToken,
        role: updatedUser.role,
        height: updatedUser.height,
        weight: updatedUser.weight,
        targetCalories: updatedUser.targetCalories,
        activityLevel: updatedUser.activityLevel,
        birthAt: updatedUser.birthAt,
        gender: updatedUser.gender,
        recommendedCalories: updatedUser.recommendedCalories,
        ...updatedUser,
      });

      // Store comprehensive user data in cookies
      console.log(
        "🔍 Redux login action - calling setUserData with:",
        unifiedUserData
      );
      setUserData(unifiedUserData);
      console.log("🔍 Redux login action - setUserData called");

      // Verify the cookie was set
      setTimeout(() => {
        const verifyUserData = getUserData();
        console.log(
          "🔍 Redux login action - verification after setUserData:",
          verifyUserData
        );
        if (!verifyUserData || Object.keys(verifyUserData).length === 0) {
          console.error(
            "❌ Redux login action - setUserData verification failed!"
          );
        } else {
          console.log(
            "✅ Redux login action - setUserData verification successful!"
          );
        }
      }, 200);

      // Store tokens in cookies if provided
      if (action.payload.accessToken) {
        setAccessToken(action.payload.accessToken);
      }
      if (action.payload.refreshToken) {
        setRefreshToken(action.payload.refreshToken);
      }

      // Initialize today's data if not exists
      setTodayCalories(0);
      setTodayNutrients({ carbs: 0, protein: 0, fat: 0 });
      setMealData([]);

      return {
        isLoggedIn: true,
        user: updatedUser,
      };
    },
    logout: () => {
      // Clear all app data from cookies
      removeAllAppCookies();
      return {
        isLoggedIn: false,
        user: { ...emptyUser },
      };
    },
    editProfile: (state, action) => {
      console.log("🔍 Redux editProfile action - payload:", action.payload);
      console.log(
        "🔍 Redux editProfile action - current state.user:",
        state.user
      );

      const updatedUser = { ...state.user, ...action.payload };

      // Recalculate recommended calories when profile is updated
      const recommendedCalories = calculateRecommendedCalories(updatedUser);
      updatedUser.recommendedCalories = recommendedCalories;

      console.log("🔍 Redux editProfile action - updatedUser:", updatedUser);

      state.user = updatedUser;

      // Create unified userData structure for cookie update
      const unifiedUserData = createUserData({
        memberId: updatedUser.memberId || updatedUser.id,
        nickname: updatedUser.nickname,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl || updatedUser.photo,
        accessToken: updatedUser.accessToken,
        refreshToken: updatedUser.refreshToken,
        role: updatedUser.role,
        height: updatedUser.height,
        weight: updatedUser.weight,
        targetCalories: updatedUser.targetCalories,
        activityLevel: updatedUser.activityLevel,
        birthAt: updatedUser.birthAt,
        gender: updatedUser.gender,
        recommendedCalories: updatedUser.recommendedCalories,
        ...updatedUser
      });

      // Update cookies when profile is edited
      setUserData(unifiedUserData);
    },
    updatePhoto: (state, action) => {
      state.user.photo = action.payload;
      state.user.profileImageUrl = action.payload; // Also update profileImageUrl
      
      // Create unified userData structure for cookie update
      const unifiedUserData = createUserData({
        memberId: state.user.memberId || state.user.id,
        nickname: state.user.nickname,
        name: state.user.name,
        email: state.user.email,
        profileImageUrl: action.payload, // Use the new photo URL
        accessToken: state.user.accessToken,
        refreshToken: state.user.refreshToken,
        role: state.user.role,
        height: state.user.height,
        weight: state.user.weight,
        targetCalories: state.user.targetCalories,
        activityLevel: state.user.activityLevel,
        birthAt: state.user.birthAt,
        gender: state.user.gender,
        recommendedCalories: state.user.recommendedCalories,
        ...state.user
      });
      
      // Update cookies when photo is updated
      setUserData(unifiedUserData);
    },
    setNickname: (state, action) => {
      state.user.nickname = action.payload;
      // Update cookies when nickname is updated
      setUserData(state.user);
    },
    updateTodayCalories: (state, action) => {
      // This will be handled by the meal tracking system
      // The actual calorie data is stored in cookies
    },
    updateTodayNutrients: (state, action) => {
      // This will be handled by the meal tracking system
      // The actual nutrient data is stored in cookies
    },
  },
});

export const {
  login,
  logout,
  editProfile,
  updatePhoto,
  setNickname,
  updateTodayCalories,
  updateTodayNutrients,
} = loginSlice.actions;

export default loginSlice.reducer;
