import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function DebugAuthOverlay() {
  const [visible, setVisible] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.login || {});
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "#f8f9fa",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 12,
        zIndex: 1000,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        maxWidth: 280,
      }}
    >
      <button
        onClick={() => setVisible(!visible)}
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "2px 6px",
          marginBottom: 6,
          cursor: "pointer",
          fontSize: 11,
        }}
      >
        {visible ? "Hide Auth Debug" : "Show Auth Debug"}
      </button>

      {visible && (
        <div>
          <div>
            <strong>Status:</strong>{" "}
            <span style={{ color: isLoggedIn ? "green" : "red" }}>
              {isLoggedIn ? "Logged In" : "Logged Out"}
            </span>
          </div>
          <div>
            <strong>Nickname:</strong> {user?.nickname || "N/A"}
          </div>
          <div>
            <strong>AccessToken:</strong>{" "}
            <span style={{ color: accessToken ? "blue" : "gray" }}>
              {accessToken ? "✔️ exists" : "❌ missing"}
            </span>
          </div>
          <div>
            <strong>RefreshToken:</strong>{" "}
            <span style={{ color: refreshToken ? "blue" : "gray" }}>
              {refreshToken ? "✔️ exists" : "❌ missing"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
