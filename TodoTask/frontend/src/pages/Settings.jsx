import { useState } from "react";
import api from "../config";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("text-red-600");

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsgColor("text-red-600");
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsgColor("text-red-600");
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await api.put("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setMsgColor("text-green-600");
      setMessage(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsgColor("text-red-600");
      setMessage(err.response?.data?.detail || "Error updating password");
    }
  };

  const downloadCSV = () => {
    const token = localStorage.getItem("token");
    window.location.href = `http://127.0.0.1:8000/tasks/export/csv?token=${token}`;
  };

  const downloadPDF = () => {
    const token = localStorage.getItem("token");
    window.location.href = `http://127.0.0.1:8000/tasks/export/pdf?token=${token}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#C2E7D3] to-[#E4F7ED] dark:from-gray-800 dark:to-gray-900 transition">

      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center">
        Settings ⚙️
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* CHANGE PASSWORD */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 p-10 rounded-2xl shadow-xl border border-white/40 dark:border-gray-700 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Change Password 🔐
          </h2>

          {message && (
            <p className={`${msgColor} mb-4 font-medium`}>
              {message}
            </p>
          )}

          <div className="space-y-5">
            <input
              type="password"
              className="border p-4 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="border p-4 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              className="border p-4 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handlePasswordChange}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-semibold shadow-md transition"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* EXPORT TASKS */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 p-10 rounded-2xl shadow-xl border border-white/40 dark:border-gray-700 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Export Your Task Data 📁
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Download your tasks in different formats for backup or records.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl w-full font-semibold shadow-md transition"
            >
              Export as CSV
            </button>

            <button
              onClick={downloadPDF}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl w-full font-semibold shadow-md transition"
            >
              Export as PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
