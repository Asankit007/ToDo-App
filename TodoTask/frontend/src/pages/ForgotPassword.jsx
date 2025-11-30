import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });

      setMsg(res.data.message || "OTP sent to your email.");

      // Save email locally so Reset page can use it
      localStorage.setItem("reset_email", email);

      // Navigate after slight delay
      setTimeout(() => navigate("/reset-password"), 800);

    } catch (err) {
      console.log("OTP error:", err);
      setError(err.response?.data?.detail || "Failed to send OTP");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#BEE0FF] px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-md border">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>

        {/* Success Message */}
        {msg && (
          <p className="text-green-600 mb-3 font-medium">{msg}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-600 mb-3 font-medium">{error}</p>
        )}

        <form onSubmit={handleSendOtp}>
          <label className="text-gray-700 font-medium">Enter your email</label>
          <input
            type="email"
            className="border p-4 rounded-xl w-full mt-2 mb-6"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition
              ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

      </div>
    </div>
  );
}
