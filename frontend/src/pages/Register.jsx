import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api  from "../config";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");   // ⭐ NEW
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !mobile) {   // ⭐ Include mobile
      setMessage("All fields are required");
      return;
    }

    try {
      await api.post("/auth/signup", { 
        name, 
        email, 
        password,
        mobile          // ⭐ send mobile to backend
      });

      setMessage("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      setMessage(err.response?.data?.detail || "Email already exists");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#BEE0FF] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-500 mb-6">Register to get started</p>

        {message && (
          <p className="text-center mb-4 text-red-600 font-medium">{message}</p>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Full Name</label>
          <input
            type="text"
            className="border p-3 w-full rounded-md mt-1"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            className="border p-3 w-full rounded-md mt-1"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* ⭐ MOBILE NUMBER (NEW FIELD) */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Mobile Number</label>
          <input
            type="text"
            className="border p-3 w-full rounded-md mt-1"
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            className="border p-3 w-full rounded-md mt-1"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
