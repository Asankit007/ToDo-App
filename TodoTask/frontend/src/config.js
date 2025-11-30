// FILE: src/config.js

// BACKEND BASE URL
export const API_URL = "http://127.0.0.1:8000";

// AXIOS INSTANCE
import axios from "axios";

// Create API instance
const api = axios.create({
  baseURL: API_URL,
});

// ---------------------------------------
// 1️⃣ Attach JWT Token Automatically
// ---------------------------------------
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  req.headers["Content-Type"] = "application/json";

  return req;
});

// ---------------------------------------
// 2️⃣ Auto Logout on Token Expiry (401)
// ---------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠ Token expired — Auto logout triggered");

      // TRY CLEAR ACTIVITY
      try {
        await api.delete("/activity/clear");
      } catch (err) {
        console.log("Activity clear failed:", err);
      }

      // REMOVE TOKEN
      localStorage.removeItem("token");

      // REDIRECT TO LOGIN
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Export for usage
export default api;
