import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  clearAllCookiesAndReload,
  debugCurrentCookies,
  forceRefreshUserData,
  debugCookiePersistence,
} from "../../api/issueApi";
import { fetchCurrentMember } from "../../api/authIssueUserApi/memberApi";
import {
  getAccessToken,
  getRefreshToken,
  getUserData,
  setDebugMode,
} from "../../utils/cookieUtils";

export default function DebugAuthOverlay() {
  const { user, isLoggedIn } = useSelector((state) => state.login);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [isChecking, setIsChecking] = useState(false);
  const [cookieStatus, setCookieStatus] = useState({});
  const [debugMode, setDebugModeState] = useState(false);

  // Check cookie status
  const checkCookieStatus = () => {
    // Don't try to read HttpOnly cookies (accessToken, refreshToken)
    // They are set by the backend and can't be read by JavaScript
    const userData = getUserData();

    setCookieStatus({
      accessToken: "HttpOnly (backend)", // Can't read HttpOnly cookies
      refreshToken: "HttpOnly (backend)", // Can't read HttpOnly cookies
      userData: userData ? "exists" : "none",
    });
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugModeState(newMode);
    setDebugMode(newMode);
  };

  useEffect(() => {
    checkCookieStatus();
    const interval = setInterval(checkCookieStatus, 10000); // Check every 10 seconds instead of 2
    return () => clearInterval(interval);
  }, []);

  // Check backend connection
  const checkBackend = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("http://localhost:8080/api/health", {
        method: "GET",
        credentials: "include",
      });
      setBackendStatus(response.ok ? "connected" : "error");
    } catch (error) {
      setBackendStatus("disconnected");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-50">
      <div className="space-y-1">
        <div>
          <span className="font-bold">Auth:</span>{" "}
          <span className={isLoggedIn ? "text-green-400" : "text-red-400"}>
            {isLoggedIn ? "Logged In" : "Not Logged In"}
          </span>
        </div>
        <div>
          <span className="font-bold">User:</span>{" "}
          <span className="text-blue-400">{user?.nickname || "None"}</span>
        </div>
        <div>
          <span className="font-bold">Role:</span>{" "}
          <span className="text-purple-400">{user?.role || "None"}</span>
        </div>
        <div>
          <span className="font-bold">Email:</span>{" "}
          <span className="text-yellow-400">{user?.email || "None"}</span>
        </div>
        <div>
          <span className="font-bold">Cookies:</span>{" "}
          <span className="text-cyan-400">
            AT:{cookieStatus.accessToken || "?"} RT:
            {cookieStatus.refreshToken || "?"} UD:{cookieStatus.userData || "?"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">Backend:</span>{" "}
          <span
            className={
              backendStatus === "connected"
                ? "text-green-400"
                : backendStatus === "checking"
                ? "text-yellow-400"
                : "text-red-400"
            }
          >
            {backendStatus === "connected"
              ? "Connected"
              : backendStatus === "checking"
              ? "Checking..."
              : "Disconnected"}
          </span>
          <button
            onClick={checkBackend}
            disabled={isChecking}
            className="ml-2 px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isChecking ? "..." : "Test"}
          </button>
        </div>
        <div className="border-t border-gray-600 pt-1 mt-1">
          <button
            onClick={debugCurrentCookies}
            className="w-full px-1 py-0.5 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            Show Cookies
          </button>
          <button
            onClick={checkCookieStatus}
            className="w-full px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 mt-1"
          >
            Refresh Status
          </button>
          <button
            onClick={async () => {
              const userData = await forceRefreshUserData();
              if (userData) {
                window.location.reload();
              }
            }}
            className="w-full px-1 py-0.5 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 mt-1"
          >
            Fix User Data
          </button>
          <button
            onClick={async () => {
              try {
                console.log("🔍 Testing /api/members/me endpoint...");
                const userData = await fetchCurrentMember();
                console.log("🔍 /api/members/me response:", userData);
                alert(`Backend response: ${JSON.stringify(userData, null, 2)}`);
              } catch (error) {
                console.error("🔍 /api/members/me error:", error);
                alert(`Error: ${error.message}`);
              }
            }}
            className="w-full px-1 py-0.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 mt-1"
          >
            Test /me
          </button>
          <button
            onClick={() => {
              // Test setting a simple cookie
              const testData = { test: "value", email: "test@example.com" };
              console.log("🧪 Testing cookie setting with:", testData);
              document.cookie = `testCookie=${JSON.stringify(
                testData
              )}; expires=${new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toUTCString()}; path=/; SameSite=Strict`;
              console.log("🧪 Test cookie set, checking...");

              // Check if it was set
              const cookies = document.cookie.split("; ");
              const testCookie = cookies.find((cookie) =>
                cookie.startsWith("testCookie=")
              );
              console.log("🧪 Test cookie found:", testCookie);

              if (testCookie) {
                const value = testCookie.split("=")[1];
                console.log("🧪 Test cookie value:", value);
                try {
                  const parsed = JSON.parse(value);
                  console.log("🧪 Test cookie parsed:", parsed);
                  alert(
                    `Test cookie set successfully: ${JSON.stringify(parsed)}`
                  );
                } catch (e) {
                  console.error("🧪 Test cookie parse error:", e);
                  alert(`Test cookie parse error: ${e.message}`);
                }
              } else {
                console.error("🧪 Test cookie not found!");
                alert("Test cookie not found!");
              }
            }}
            className="w-full px-1 py-0.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 mt-1"
          >
            Test Cookie
          </button>
          <button
            onClick={() => {
              if (window.confirm("모든 쿠키를 삭제하시겠습니까?")) {
                clearAllCookiesAndReload();
              }
            }}
            className="w-full px-1 py-0.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 mt-1"
          >
            Clear Cookies
          </button>
          <button
            onClick={() => {
              console.log("🔍 Comprehensive cookie debugging...");

              // Step 1: Check current cookies
              console.log("Step 1: Current cookies");
              const allCookies = document.cookie.split("; ");
              console.log("All cookies:", allCookies);

              // Step 2: Test setting a simple cookie
              console.log("Step 2: Testing simple cookie setting");
              const testData = { test: "value", timestamp: Date.now() };
              document.cookie = `debugTest=${JSON.stringify(
                testData
              )}; path=/; max-age=3600`;

              // Step 3: Verify simple cookie
              console.log("Step 3: Verifying simple cookie");
              const testCookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("debugTest="));
              console.log("Test cookie found:", !!testCookie);

              // Step 4: Test userData cookie setting
              console.log("Step 4: Testing userData cookie setting");
              const userData = {
                email: "test@example.com",
                nickname: "TestUser",
                role: "USER",
                memberId: 1,
              };

              // Try multiple methods
              console.log("Method 1: Standard approach");
              document.cookie = `userData=${encodeURIComponent(
                JSON.stringify(userData)
              )}; path=/; max-age=${7 * 24 * 60 * 60}`;

              setTimeout(() => {
                console.log(
                  "Method 1 result:",
                  document.cookie
                    .split("; ")
                    .find((c) => c.startsWith("userData="))
                );

                console.log("Method 2: Alternative approach");
                document.cookie = `userData2=${encodeURIComponent(
                  JSON.stringify(userData)
                )}; expires=${new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toUTCString()}; path=/`;

                setTimeout(() => {
                  console.log(
                    "Method 2 result:",
                    document.cookie
                      .split("; ")
                      .find((c) => c.startsWith("userData2="))
                  );

                  // Final check
                  console.log("Final cookie state:", document.cookie);

                  alert(
                    `Debug complete! Check console for details.\n\nFinal cookies: ${document.cookie}`
                  );
                }, 100);
              }, 100);
            }}
            className="w-full px-1 py-0.5 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 mt-1"
          >
            Debug Cookies
          </button>
          <button
            onClick={async () => {
              await debugCookiePersistence();
            }}
            className="w-full px-1 py-0.5 bg-pink-600 text-white text-xs rounded hover:bg-pink-700 mt-1"
          >
            Debug Persistence
          </button>
          <button
            onClick={() => {
              // Simple cookie test
              console.log("🧪 Simple cookie test...");

              // Test 1: Set a simple cookie
              document.cookie = "simpleTest=hello; path=/";
              console.log("🧪 Set simple cookie");

              // Test 2: Check if it was set
              const simpleCookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("simpleTest="));
              console.log("🧪 Simple cookie found:", !!simpleCookie);

              // Test 3: Set a JSON cookie
              const jsonData = { test: "value", number: 123 };
              document.cookie = `jsonTest=${JSON.stringify(jsonData)}; path=/`;
              console.log("🧪 Set JSON cookie");

              // Test 4: Check JSON cookie
              const jsonCookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("jsonTest="));
              console.log("🧪 JSON cookie found:", !!jsonCookie);

              if (jsonCookie) {
                try {
                  const value = jsonCookie.split("=")[1];
                  const parsed = JSON.parse(value);
                  console.log("🧪 JSON cookie parsed:", parsed);
                } catch (e) {
                  console.error("🧪 JSON cookie parse error:", e);
                }
              }

              // Test 5: Set with expiration
              document.cookie = `expireTest=value; expires=${new Date(
                Date.now() + 24 * 60 * 60 * 1000
              ).toUTCString()}; path=/`;
              console.log("🧪 Set cookie with expiration");

              const expireCookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("expireTest="));
              console.log("🧪 Expire cookie found:", !!expireCookie);

              alert(
                `Cookie test complete!\n\nSimple: ${!!simpleCookie}\nJSON: ${!!jsonCookie}\nExpire: ${!!expireCookie}\n\nCheck console for details.`
              );
            }}
            className="w-full px-1 py-0.5 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 mt-1"
          >
            Test Cookies
          </button>
          <button
            onClick={toggleDebugMode}
            className={`w-full px-1 py-0.5 text-white text-xs rounded mt-1 ${
              debugMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {debugMode ? "Debug: ON" : "Debug: OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}
