import axios from "./axiosInstance";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("🔁 Trying refresh with:", refreshToken);

  if (!refreshToken) throw new Error("No refresh token found");

  console.log("🔁 Sending refreshToken to backend:", refreshToken); // ✅ debug

  const res = await axios.post("/api/members/refresh", {
    refreshToken, // ✅ Make sure the key is "refreshToken"
  });

  const newAccessToken = res.data.accessToken;
  // 업데이트된 accessToken 저장 및 적용
  localStorage.setItem("accessToken", newAccessToken);
  axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

  console.log("✅ New access token set:", newAccessToken);

  return newAccessToken;
};
