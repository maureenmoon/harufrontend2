import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // 백엔드 CORS 설정과 일치하도록 포트 고정
    proxy: {
      // Route member-related requests to Java Spring backend
      "/api/members": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // Route meal CRUD operations to Java Spring backend
      "/api/meals/member": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/meals/modified-date": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/meals/monthly": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/meals/date-range": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // Route food image analysis to Python FastAPI backend
      "/api/meals/analyze": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // Route all other API requests to Python FastAPI backend
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
