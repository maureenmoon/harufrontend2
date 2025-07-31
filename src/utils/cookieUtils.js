// Cookie utility for comprehensive user data storage
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: false, // Set to true in production with HTTPS
  sameSite: "strict",
  path: "/",
};

// Debug flag to control logging
let DEBUG_MODE = false;

// Comprehensive user data structure
export const createUserData = ({
  memberId,
  nickname,
  name,
  email,
  profileImageUrl,
  accessToken,
  refreshToken,
  role = "USER",
  height = null,
  weight = null,
  targetCalories = null,
  activityLevel = "",
  birthAt = null,
  gender = null,
  recommendedCalories = null,
  ...otherData
}) => {
  return {
    // Core identification
    memberId,
    id: memberId, // Alias for compatibility
    nickname,
    name,
    email,

    // Profile image
    photo: profileImageUrl, // Alias for compatibility
    profileImageUrl,

    // Authentication tokens
    accessToken,
    refreshToken,

    // User profile data
    role,
    height,
    weight,
    targetCalories,
    activityLevel,
    birthAt,
    gender,
    recommendedCalories,

    // Additional data
    ...otherData,
  };
};

// Function to enable/disable debug mode
export const setDebugMode = (enabled) => {
  DEBUG_MODE = enabled;
  console.log(`🔧 Cookie debug mode: ${enabled ? "enabled" : "disabled"}`);
};

// Helper function for debug logging
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// Store access token in cookie
export const setAccessToken = (token) => {
  if (token) {
    document.cookie = `accessToken=${token}; expires=${new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toUTCString()}; path=/`;
  }
};

// Store refresh token in cookie
export const setRefreshToken = (token) => {
  if (token) {
    document.cookie = `refreshToken=${token}; expires=${new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toUTCString()}; path=/`;
  }
};

// Get access token from cookie
export const getAccessToken = () => {
  const cookies = document.cookie.split("; ");
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("accessToken=")
  );
  return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
};

// Get refresh token from cookie
export const getRefreshToken = () => {
  const cookies = document.cookie.split("; ");
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("refreshToken=")
  );
  return refreshTokenCookie ? refreshTokenCookie.split("=")[1] : null;
};

// Remove access token cookie
export const removeAccessToken = () => {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Remove refresh token cookie
export const removeRefreshToken = () => {
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Remove all auth cookies
export const removeAllAuthCookies = () => {
  removeAccessToken();
  removeRefreshToken();
};

// Check if user has valid tokens
export const hasValidTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};

// Store comprehensive user data in cookie (for persistence)
export const setUserData = (userData) => {
  debugLog("🔍 setUserData called with:", userData);
  if (userData) {
    // Ensure we have a complete userData structure
    const completeUserData = {
      memberId: userData.memberId || userData.id,
      nickname: userData.nickname,
      name: userData.name,
      email: userData.email,
      profileImageUrl: userData.profileImageUrl || userData.photo,
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
      role: userData.role || "USER",
      height: userData.height,
      weight: userData.weight,
      targetCalories: userData.targetCalories,
      activityLevel: userData.activityLevel,
      birthAt: userData.birthAt,
      gender: userData.gender,
      recommendedCalories: userData.recommendedCalories,
      // Include any additional fields
      ...userData,
    };

    const userString = JSON.stringify(completeUserData);
    debugLog("🔍 setUserData - userString:", userString);

    // Clear any existing frontendUserData cookie first
    document.cookie =
      "frontendUserData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Use a simpler approach without SameSite=Strict to avoid conflicts
    const cookieValue = `frontendUserData=${encodeURIComponent(
      userString
    )}; path=/; max-age=${7 * 24 * 60 * 60}`;

    debugLog("🔍 setUserData - setting cookie:", cookieValue);

    // Set the cookie
    document.cookie = cookieValue;
    debugLog("🔍 setUserData - cookie set successfully");

    // Immediate verification
    const immediateCheck = document.cookie
      .split("; ")
      .find((row) => row.startsWith("frontendUserData="));
    debugLog(
      "🔍 setUserData - immediate check result:",
      immediateCheck ? "found" : "not found"
    );

    // Delayed verification
    setTimeout(() => {
      const verifyUserData = getUserData();
      debugLog("🔍 setUserData - verification after setting:", verifyUserData);
      if (!verifyUserData || Object.keys(verifyUserData).length === 0) {
        console.error(
          "❌ setUserData - Cookie verification failed! Cookie is empty after setting."
        );

        // Try alternative method with different approach
        console.log(
          "🔧 setUserData - Trying alternative cookie setting method..."
        );
        document.cookie = `frontendUserData=${encodeURIComponent(
          userString
        )}; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/`;

        setTimeout(() => {
          const retryCheck = getUserData();
          console.log("🔧 setUserData - retry check result:", retryCheck);
          if (retryCheck && Object.keys(retryCheck).length > 0) {
            console.log("✅ setUserData - Alternative method worked!");
          } else {
            console.error("❌ setUserData - Alternative method also failed!");
          }
        }, 100);
      } else {
        console.log("✅ setUserData - Cookie verification successful!");
      }
    }, 100);
  } else {
    debugLog("🔍 setUserData - no userData provided");
  }
};

// Get user data from cookie
export const getUserData = () => {
  // Only log when explicitly debugging or when there are issues
  const cookies = document.cookie.split("; ");

  const userDataCookie = cookies.find((cookie) =>
    cookie.startsWith("frontendUserData=")
  );

  if (userDataCookie) {
    try {
      const userString = decodeURIComponent(userDataCookie.split("=")[1]);
      const parsed = JSON.parse(userString);
      return parsed;
    } catch (error) {
      console.error(
        "❌ getUserData - Error parsing user data from cookie:",
        error
      );
      console.error("❌ getUserData - Raw cookie value:", userDataCookie);
      return null;
    }
  }
  return null;
};

// Remove user data cookie
export const removeUserData = () => {
  document.cookie =
    "frontendUserData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Store today's consumed calories in cookie
export const setTodayCalories = (calories) => {
  if (calories !== undefined) {
    document.cookie = `todayCalories=${calories}; expires=${new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toUTCString()}; path=/`;
  }
};

// Get today's consumed calories from cookie
export const getTodayCalories = () => {
  const cookies = document.cookie.split("; ");
  const todayCaloriesCookie = cookies.find((cookie) =>
    cookie.startsWith("todayCalories=")
  );
  return todayCaloriesCookie
    ? parseInt(todayCaloriesCookie.split("=")[1]) || 0
    : 0;
};

// Store today's consumed nutrients in cookie
export const setTodayNutrients = (nutrients) => {
  if (nutrients) {
    const nutrientsString = JSON.stringify(nutrients);
    document.cookie = `todayNutrients=${encodeURIComponent(
      nutrientsString
    )}; expires=${new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toUTCString()}; path=/`;
  }
};

// Get today's consumed nutrients from cookie
export const getTodayNutrients = () => {
  const cookies = document.cookie.split("; ");
  const todayNutrientsCookie = cookies.find((cookie) =>
    cookie.startsWith("todayNutrients=")
  );
  if (todayNutrientsCookie) {
    try {
      const nutrientsString = decodeURIComponent(
        todayNutrientsCookie.split("=")[1]
      );
      return JSON.parse(nutrientsString);
    } catch (error) {
      console.error("Error parsing today nutrients from cookie:", error);
      return { carbs: 0, protein: 0, fat: 0 };
    }
  }
  return { carbs: 0, protein: 0, fat: 0 };
};

// Calculate recommended calories based on user data
export const calculateRecommendedCalories = (userData) => {
  if (
    !userData ||
    !userData.weight ||
    !userData.height ||
    !userData.activityLevel
  ) {
    return 2000; // Default value
  }

  // Basic BMR calculation (Mifflin-St Jeor Equation)
  let bmr;
  if (userData.gender === "MALE") {
    bmr = 10 * userData.weight + 6.25 * userData.height - 5 * 25 + 5; // Assuming age 25
  } else {
    bmr = 10 * userData.weight + 6.25 * userData.height - 5 * 25 - 161; // Assuming age 25
  }

  // Activity level multipliers
  const activityMultipliers = {
    LOW: 1.2, // Sedentary
    MODERATE: 1.55, // Moderately active
    HIGH: 1.725, // Very active
  };

  const multiplier = activityMultipliers[userData.activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

// Get user's recommended calories
export const getRecommendedCalories = () => {
  const userData = getUserData();
  return calculateRecommendedCalories(userData);
};

// Store meal data in cookie
export const setMealData = (mealData) => {
  if (mealData) {
    const mealString = JSON.stringify(mealData);
    document.cookie = `mealData=${encodeURIComponent(
      mealString
    )}; expires=${new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toUTCString()}; path=/`;
  }
};

// Get meal data from cookie
export const getMealData = () => {
  const cookies = document.cookie.split("; ");
  const mealDataCookie = cookies.find((cookie) =>
    cookie.startsWith("mealData=")
  );
  if (mealDataCookie) {
    try {
      const mealString = decodeURIComponent(mealDataCookie.split("=")[1]);
      return JSON.parse(mealString);
    } catch (error) {
      console.error("Error parsing meal data from cookie:", error);
      return [];
    }
  }
  return [];
};

// Remove all app data cookies
export const removeAllAppCookies = () => {
  removeAllAuthCookies();
  removeUserData();
  document.cookie =
    "todayCalories=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "todayNutrients=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "mealData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "frontendUserData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Get comprehensive user dashboard data
export const getUserDashboardData = () => {
  const userData = getUserData();
  const todayCalories = getTodayCalories();
  const todayNutrients = getTodayNutrients();
  const recommendedCalories = getRecommendedCalories();
  const mealData = getMealData();

  return {
    user: userData,
    todayCalories,
    todayNutrients,
    recommendedCalories,
    remainingCalories: recommendedCalories - todayCalories,
    mealData,
    progress: {
      calories: Math.round((todayCalories / recommendedCalories) * 100),
      carbs: todayNutrients.carbs,
      protein: todayNutrients.protein,
      fat: todayNutrients.fat,
    },
  };
};

// Debug function to check all cookies
export const debugAllCookies = () => {
  const allCookies = document.cookie.split("; ");
  const cookieMap = {};

  allCookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    if (name && value) {
      cookieMap[name] = value;
    }
  });

  console.log("🍪 All current cookies:", cookieMap);
  return cookieMap;
};

// Utility functions for unified userData management
export const getUserInfo = () => {
  const userData = getUserData();
  if (!userData) return null;

  return {
    memberId: userData.memberId || userData.id,
    nickname: userData.nickname,
    name: userData.name,
    email: userData.email,
    profileImageUrl: userData.profileImageUrl || userData.photo,
    role: userData.role,
    height: userData.height,
    weight: userData.weight,
    targetCalories: userData.targetCalories,
    activityLevel: userData.activityLevel,
    birthAt: userData.birthAt,
    gender: userData.gender,
    recommendedCalories: userData.recommendedCalories,
  };
};

export const updateUserProfile = (updates) => {
  const currentUserData = getUserData();
  if (!currentUserData) {
    console.error("❌ No user data found to update");
    return false;
  }

  const updatedUserData = createUserData({
    ...currentUserData,
    ...updates,
  });

  setUserData(updatedUserData);
  return true;
};

export const updateUserPhoto = (photoUrl) => {
  return updateUserProfile({
    photo: photoUrl,
    profileImageUrl: photoUrl,
  });
};

export const updateUserTokens = (accessToken, refreshToken) => {
  return updateUserProfile({
    accessToken,
    refreshToken,
  });
};

// Example usage of unified userData structure:
/*
// 1. Create userData during login
const userData = createUserData({
  memberId: 1,
  nickname: "testuser",
  name: "Test User",
  email: "test@example.com",
  profileImageUrl: "https://supabase.co/storage/v1/object/public/harukcal/member/2507301621_profile.jpg",
  accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  role: "USER",
  height: 170,
  weight: 65,
  activityLevel: "MODERATE"
});

// 2. Store in cookie
setUserData(userData);

// 3. Get user info
const userInfo = getUserInfo();
console.log(userInfo.memberId); // 1
console.log(userInfo.profileImageUrl); // "https://supabase.co/..."

// 4. Update specific fields
updateUserPhoto("https://new-image-url.jpg");
updateUserTokens("new-access-token", "new-refresh-token");
updateUserProfile({ height: 175, weight: 70 });

// 5. Access from anywhere in the app
const currentUser = getUserData();
console.log(currentUser.memberId, currentUser.nickname, currentUser.profileImageUrl);
*/
