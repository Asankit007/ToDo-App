// FILE: src/pages/Login.jsx
// UI Enhanced – Soft Landing Page Background

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config.js";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password required");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">

      {/* 🌿 Soft Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br 
        from-[#DFF7EC] via-[#E9FBF3] to-[#DFF7EC] animate-gradient-flow">
      </div>

      {/* Soft Glow Circles */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-[#C8F3DD] opacity-30 rounded-full blur-3xl animate-slow-pulse"></div>
      <div className="absolute bottom-10 left-16 w-72 h-72 bg-[#B6EED3] opacity-25 rounded-full blur-3xl animate-slower-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border backdrop-blur-sm
        transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">

        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Welcome Back 👋
        </h2>

        {message && (
          <p className="text-center mb-4 text-red-600 font-medium animate-fade-in">
            {message}
          </p>
        )}

        <div className="mb-6">
          <label className="text-gray-900 text-lg font-medium">Email</label>
          <input
            type="email"
            className="mt-2 w-full border rounded-xl p-4 text-gray-700 focus:outline-blue-300 
              transition shadow-sm focus:shadow-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-900 text-lg font-medium">Password</label>
          <input
            type="password"
            className="mt-2 w-full border rounded-xl p-4 text-gray-700 focus:outline-blue-300
              transition shadow-sm focus:shadow-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-right mb-6">
          <a
            href="/forgot-password"
            className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition"
          >
            Forgot Password?
          </a>
        </div>

        <button
          onClick={handleLogin}
          className="bg-[#1A2C4F] text-white w-full text-lg font-semibold py-3 rounded-xl
            hover:bg-[#162544] transition shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          Login
        </button>

        <p className="text-center text-gray-700 mt-6">
          Don’t have an account?
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Register
          </button>
        </p>

      </div>

      {/* 🌿 Background Animations */}
      <style>
        {`
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-flow {
            background-size: 200% 200%;
            animation: gradientFlow 9s ease infinite;
          }

          @keyframes slowPulse {
            0%, 100% { opacity: .3; transform: scale(1); }
            50% { opacity: .45; transform: scale(1.15); }
          }
          .animate-slow-pulse { animation: slowPulse 7s infinite; }

          @keyframes slowerPulse {
            0%, 100% { opacity: .25; transform: scale(1); }
            50% { opacity: .4; transform: scale(1.25); }
          }
          .animate-slower-pulse { animation: slowerPulse 10s infinite; }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn .4s ease-in-out; }
        `}
      </style>
    </div>
  );
}
