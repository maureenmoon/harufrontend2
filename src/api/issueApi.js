// src/api/issueApi.js
import axios from "axios";

const API_BASE_URL = "/api"; // 프록시 사용을 위해 변경

// Helper function to get user info from cookies (cookie-based auth system)
const getUserInfo = async () => {
  try {
    // Add a small delay to prevent interference with login process
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Get user data from cookies
    const userDataCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("frontendUserData="));

    if (userDataCookie) {
      const userDataString = decodeURIComponent(userDataCookie.split("=")[1]);
      const userData = JSON.parse(userDataString);
      console.log("🔍 getUserInfo - found userData:", userData);

      // Check if userData is empty or missing required fields
      if (
        !userData ||
        Object.keys(userData).length === 0 ||
        !userData.email ||
        !userData.role
      ) {
        console.log(
          "🔍 getUserInfo - userData is empty or missing required fields, attempting to fix..."
        );
        return await fixUserDataInCookie();
      }

      return userData;
    } else {
      console.log(
        "🔍 getUserInfo - no userData cookie found, attempting to fix..."
      );
      return await fixUserDataInCookie();
    }
  } catch (e) {
    console.error("Error parsing user info from cookies:", e);
    console.log("🔍 getUserInfo - error occurred, attempting to fix...");
    return await fixUserDataInCookie();
  }
};

// Helper function to fix user data in cookie
const fixUserDataInCookie = async () => {
  try {
    console.log("🔧 Attempting to fix user data in cookie...");
    // Call the Java Spring backend instead of Python backend
    const response = await axios.get(`/api/members/me`);
    const userData = response.data;
    console.log("🔧 Fetched user data:", userData);
    console.log("🔧 User data keys:", Object.keys(userData || {}));
    console.log("🔧 User data has email:", !!userData?.email);
    console.log("🔧 User data has nickname:", !!userData?.nickname);

    // Validate the response
    if (!userData || Object.keys(userData).length === 0) {
      console.error("🔧 Backend returned empty user data!");
      return null;
    }

    if (!userData.email || !userData.nickname) {
      console.error("🔧 Backend returned incomplete user data:", {
        hasEmail: !!userData.email,
        hasNickname: !!userData.nickname,
        userData: userData,
      });
      return null;
    }

    // Store in cookie - use the same approach as the working userData2
    const userString = JSON.stringify(userData);
    console.log("🔧 Setting cookie with userString:", userString);
    document.cookie = `frontendUserData=${encodeURIComponent(
      userString
    )}; path=/; max-age=${7 * 24 * 60 * 60}`;

    console.log("🔧 User data fixed in cookie");

    // Verify the cookie was set correctly
    setTimeout(() => {
      const verifyCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("frontendUserData="));
      console.log("🔧 Verification - cookie found:", !!verifyCookie);
      if (verifyCookie) {
        try {
          const value = verifyCookie.split("=")[1];
          const parsed = JSON.parse(decodeURIComponent(value));
          console.log("🔧 Verification - parsed cookie:", parsed);
        } catch (e) {
          console.error("🔧 Verification - parse error:", e);
        }
      }
    }, 100);

    return userData;
  } catch (error) {
    console.error("🔧 Failed to fix user data:", error);
    console.error("🔧 Error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return null;
  }
};

// Debug function to clear all cookies and force fresh login
export const clearAllCookiesAndReload = () => {
  console.log("🧹 Clearing all cookies...");

  // Clear all known cookies explicitly
  const cookiesToClear = [
    "accessToken",
    "refreshToken",
    "userData",
    "frontendUserData",
    "todayCalories",
    "todayNutrients",
    "mealData",
    "recommendedCalories",
  ];

  cookiesToClear.forEach((cookieName) => {
    // Clear with different path variations
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  });

  // Also clear any other cookies that might exist
  const existingCookies = document.cookie.split("; ");
  existingCookies.forEach((cookie) => {
    const name = cookie.split("=")[0];
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });

  console.log("🧹 All cookies cleared, reloading page...");
  window.location.reload();
};

// Debug function to show all current cookies
export const debugCurrentCookies = () => {
  console.log("🔍 Current cookies:");
  const cookies = document.cookie.split("; ");

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    const value = eqPos > -1 ? cookie.substr(eqPos + 1) : "";

    if (name === "frontendUserData" && value) {
      try {
        const userData = JSON.parse(decodeURIComponent(value));
        console.log(`  ${name}:`, userData);
      } catch (e) {
        console.log(`  ${name}: [Error parsing] ${value}`);
      }
    } else {
      console.log(`  ${name}: ${value}`);
    }
  }
};

// Function to force refresh user data from backend
export const forceRefreshUserData = async () => {
  try {
    console.log("🔄 Force refreshing user data...");
    const response = await axios.get(`/api/members/me`);
    const userData = response.data;
    console.log("🔄 Fetched fresh user data:", userData);
    const userString = JSON.stringify(userData);
    document.cookie = `frontendUserData=${encodeURIComponent(
      userString
    )}; path=/; max-age=${7 * 24 * 60 * 60}`;
    console.log("🔄 User data refreshed successfully");
    return userData;
  } catch (error) {
    console.error("🔄 Failed to refresh user data:", error);
    return null;
  }
};

// New comprehensive debugging function
export const debugCookiePersistence = async () => {
  console.log("🔍 Starting comprehensive cookie persistence debugging...");

  // Step 1: Check current state
  console.log("Step 1: Current cookie state");
  const currentCookies = document.cookie.split("; ");
  console.log("Current cookies:", currentCookies);

  const currentUserData = currentCookies.find((c) =>
    c.startsWith("frontendUserData=")
  );
  console.log("Current userData cookie:", currentUserData);

  // Step 2: Test backend connection
  console.log("Step 2: Testing backend connection");
  try {
    const response = await axios.get(`/api/members/me`);
    console.log("Backend response:", response.data);

    // Step 3: Test cookie setting
    console.log("Step 3: Testing cookie setting");
    const testUserData = response.data;
    const testUserString = JSON.stringify(testUserData);

    // Method 1: Standard approach
    console.log("Method 1: Setting cookie with standard approach");
    document.cookie = `frontendUserData=${encodeURIComponent(
      testUserString
    )}; path=/; max-age=${7 * 24 * 60 * 60}`;

    // Check immediately
    const immediateCheck = document.cookie
      .split("; ")
      .find((c) => c.startsWith("frontendUserData="));
    console.log(
      "Immediate check result:",
      immediateCheck ? "found" : "not found"
    );

    // Check after delay
    setTimeout(() => {
      const delayedCheck = document.cookie
        .split("; ")
        .find((c) => c.startsWith("frontendUserData="));
      console.log(
        "Delayed check result:",
        delayedCheck ? "found" : "not found"
      );

      if (delayedCheck) {
        try {
          const value = delayedCheck.split("=")[1];
          const parsed = JSON.parse(decodeURIComponent(value));
          console.log("Parsed cookie data:", parsed);
          console.log("✅ Cookie persistence test successful!");
        } catch (e) {
          console.error("❌ Cookie parsing failed:", e);
        }
      } else {
        console.error("❌ Cookie not found after setting!");

        // Try alternative method
        console.log("Trying alternative method...");
        document.cookie = `frontendUserData=${encodeURIComponent(
          testUserString
        )}; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/`;

        setTimeout(() => {
          const altCheck = document.cookie
            .split("; ")
            .find((c) => c.startsWith("frontendUserData="));
          console.log(
            "Alternative method result:",
            altCheck ? "found" : "not found"
          );
        }, 100);
      }
    }, 100);
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
  }
};

// Issues API endpoints
export const issueApi = {
  // Get all issues from database
  getAllIssues: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issues/`);
      return response.data;
    } catch (error) {
      console.error("이슈 목록 가져오기 실패:", error);
      throw error;
    }
  },

  // Get single issue by ID
  getIssueById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issues/${id}`);
      return response.data;
    } catch (error) {
      console.error("이슈 상세 정보 가져오기 실패:", error);
      throw error;
    }
  },

  // Create new issue (Admin only)
  getCrawlerStatus: async () => {
    try {
      const userInfo = await getUserInfo();
      console.log("�� getCrawlerStatus - userInfo:", userInfo);
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
        console.log(
          "�� getCrawlerStatus - Authorization header set:",
          userInfo.email
        );
      } else {
        console.log("�� getCrawlerStatus - No admin role or no user info");
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/crawler-status`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error("크롤러 상태 확인 실패:", error);
      throw error;
    }
  },
  // Update issue (Admin only)
  updateIssue: async (id, issueData) => {
    try {
      const userInfo = await getUserInfo();
      console.log("🔍 Update issue - userInfo:", userInfo);
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
        console.log(
          "🔍 Update issue - Authorization header set:",
          userInfo.email
        );
      } else {
        console.log("🔍 Update issue - No admin role or no user info");
      }

      const response = await axios.put(
        `${API_BASE_URL}/issues/${id}`,
        issueData,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("이슈 수정 실패:", error);
      throw error;
    }
  },

  // Delete issue (Admin only)
  deleteIssue: async (id) => {
    try {
      const userInfo = await getUserInfo();
      console.log("🔍 Delete issue - userInfo:", userInfo);
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
        console.log(
          "🔍 Delete issue - Authorization header set:",
          userInfo.email
        );
      } else {
        console.log("🔍 Delete issue - No admin role or no user info");
      }

      const response = await axios.delete(`${API_BASE_URL}/issues/${id}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("이슈 삭제 실패:", error);
      throw error;
    }
  },

  // Crawler endpoints (Admin only)
  crawlSingle: async (url) => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/crawl?url=${encodeURIComponent(url)}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("단일 크롤링 실패:", error);
      throw error;
    }
  },

  crawlRange: async (startNumber, endNumber, delay = 1.0) => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/crawl-range?start_number=${startNumber}&end_number=${endNumber}&delay=${delay}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("범위 크롤링 실패:", error);
      throw error;
    }
  },

  crawlNext: async (currentNumber, count = 5, delay = 1.0) => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/crawl-next?current_number=${currentNumber}&count=${count}&delay=${delay}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("다음 글 크롤링 실패:", error);
      throw error;
    }
  },

  crawlPrevious: async (currentNumber, count = 5, delay = 1.0) => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/crawl-previous?current_number=${currentNumber}&count=${count}&delay=${delay}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("이전 글 크롤링 실패:", error);
      throw error;
    }
  },

  monthlyCrawl: async () => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(`${API_BASE_URL}/issues/monthly-crawl`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("월간 자동 크롤링 실패:", error);
      throw error;
    }
  },

  manualCrawl: async (startNumber, count = 10) => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/manual-crawl?start_number=${startNumber}&count=${count}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("수동 크롤링 실패:", error);
      throw error;
    }
  },

  cleanupOldest: async (count = 10) => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/cleanup-oldest?count=${count}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("오래된 글 정리 실패:", error);
      throw error;
    }
  },

  getCrawlerStatus: async () => {
    try {
      const userInfo = await getUserInfo();
      const headers = {};

      if (userInfo && userInfo.role === "ADMIN") {
        headers["Authorization"] = userInfo.email;
      }

      const response = await axios.get(
        `${API_BASE_URL}/issues/crawler-status`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("크롤러 상태 확인 실패:", error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issues/`);
      return response.data;
    } catch (error) {
      console.error("이슈 API 상태 확인 실패:", error);
      throw error;
    }
  },
};

export default issueApi;
