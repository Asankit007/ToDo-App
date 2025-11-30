import { useEffect, useState } from "react";
import api from "../config";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/activity/");
        setLogs(res.data);
      } catch (err) {
        console.error("Activity fetch error:", err);
      }
    };

    fetchLogs();
  }, []);

  // ========= Extract Browser Name =========
  const extractBrowser = (ua) => {
    if (!ua) return "Unknown";
    ua = ua.toLowerCase();

    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("edg")) return "Edge";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("opera") || ua.includes("opr")) return "Opera";
    if (ua.includes("brave")) return "Brave";
    return "Unknown";
  };

  // ========= Browser Badge Colors =========
  const browserColors = {
    Chrome: "bg-yellow-100 text-yellow-700",
    Firefox: "bg-orange-100 text-orange-700",
    Edge: "bg-blue-100 text-blue-700",
    Safari: "bg-cyan-100 text-cyan-700",
    Opera: "bg-red-100 text-red-700",
    Brave: "bg-purple-100 text-purple-700",
    Unknown: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-[#E2F1E7] p-6 rounded-xl animate-fadeSlow">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 animate-slideDown">
        Activity Log
      </h1>

      {/* CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border animate-scaleUp">

        {/* TABLE HEADER */}
        <div className="
          grid grid-cols-5 font-semibold text-gray-600 
          border-b pb-3 mb-4 sticky top-0 bg-white z-10
        ">
          <span>Activity</span>
          <span>Description</span>
          <span>IP</span>
          <span>Device</span>
          <span>Time</span>
        </div>

        {/* ACTIVITY LIST */}
        <div className="space-y-4">
          {logs.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No activities found
            </p>
          )}

          {logs.map((log, idx) => {
            const browser = extractBrowser(log.device);
            return (
              <div
                key={idx}
                className="
                  grid grid-cols-5 items-center p-4 rounded-xl border 
                  bg-gray-50 shadow 
                  hover:shadow-lg hover:-translate-y-1 transition transform
                "
              >
                {/* Activity */}
                <span className="font-bold text-gray-800">{log.action}</span>

                {/* Description */}
                <span className="text-gray-600">{log.description}</span>

                {/* IP */}
                <span className="text-gray-600">{log.ip || "N/A"}</span>

                {/* Device Badge */}
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold 
                  ${browserColors[browser]}
                `}
                >
                  {browser}
                </span>

                {/* Timestamp */}
                <span className="text-gray-500 text-sm">{log.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
