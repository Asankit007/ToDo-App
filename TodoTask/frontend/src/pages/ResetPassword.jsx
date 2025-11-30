import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setMsg("");
    setError("");

    const email = localStorage.getItem("reset_email");

    if (!email) {
      setError("Invalid reset request. Please try again.");
      return;
    }

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (pass !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: pass,
      });

      // Clear memory
      localStorage.removeItem("reset_email");

      setMsg("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP or error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#BEE0FF] px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-md border">

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
        <p className="text-gray-500 mb-6">Enter OTP & your new password</p>

        {msg && <p className="text-green-600 mb-3">{msg}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        {/* OTP */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Enter OTP</label>
          <input
            type="text"
            className="border p-3 w-full rounded-xl mt-2"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">New Password</label>
          <input
            type="password"
            className="border p-3 w-full rounded-xl mt-2"
            placeholder="Enter new password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold">Confirm Password</label>
          <input
            type="password"
            className="border p-3 w-full rounded-xl mt-2"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}
