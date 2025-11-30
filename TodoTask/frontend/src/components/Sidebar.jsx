import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config";

// ICONS
import {
  LayoutDashboard,
  ListTodo,
  Kanban,
  BarChart3,
  Settings,
  User,
  Activity,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Mic,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    profile_pic: "",
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // -----------------------------
  // 🎤 CONTINUOUS VOICE LOGIC
  // -----------------------------
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [autoMode, setAutoMode] = useState(false); // manual = false, auto = true
  const [modeText, setModeText] = useState("Voice OFF");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = true;
    recog.interimResults = false;

    recog.onresult = async (event) => {
      const text = event.results[event.resultIndex][0].transcript.toLowerCase();
      console.log("Heard:", text);

      // MODE SWITCH
      if (text.includes("manual")) {
        setAutoMode(false);
        setModeText("Manual Mode");
        return;
      }

      if (text.includes("automatic")) {
        setAutoMode(true);
        setModeText("Automatic Mode");
        return;
      }

      // Automatic navigation
      if (autoMode) {
        if (text.includes("dashboard")) navigate("/dashboard");
        if (text.includes("list")) navigate("/tasks");
        if (text.includes("kanban")) navigate("/kanban");
        if (text.includes("analytics")) navigate("/analytics");
        if (text.includes("settings")) navigate("/settings");
        if (text.includes("profile")) navigate("/profile");
        if (text.includes("activity")) navigate("/activity");
      }
    };

    recog.onerror = (e) => console.log("Voice error:", e);

    setRecognition(recog);
  }, [autoMode]);

  // Start listening after mic is clicked
  const startVoice = () => {
    if (!recognition) return;
    setVoiceEnabled(true);
    setModeText("Manual Mode"); // default when starts
    recognition.start();
  };

  // Fetch user profile
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me");
        setUser({
          name: res.data.name,
          profile_pic: res.data.profile_pic,
        });
      } catch (err) {
        console.log("Sidebar user load error:", err);
      }
    })();
  }, []);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "List View", path: "/tasks", icon: <ListTodo size={20} /> },
    { name: "Kanban", path: "/kanban", icon: <Kanban size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Activity Log", path: "/activity", icon: <Activity size={20} /> },
    { name: "AI Summary", path: "/ai-summary", icon: <BarChart3 size={20} /> },

  ];

  return (
    <>
      {/* ---------------------- */}
      {/* MAIN SIDEBAR UI       */}
      {/* ---------------------- */}
      <div
        className={`relative min-h-screen border-r shadow-lg transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} 
        ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white"}`}
      >
        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* PROFILE */}
        <div
          className={`flex flex-col items-center mt-8 mb-10 p-4 rounded-2xl shadow-md
          ${darkMode ? "bg-gray-800" : "bg-[#E2F1E7]"}
          ${collapsed ? "mx-2" : "mx-4"}`}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 shadow">
            {user.profile_pic ? (
              <img src={user.profile_pic} className="w-full h-full object-cover" />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center
                ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"}`}
              >
                No Img
              </div>
            )}
          </div>

          {!collapsed && (
            <h3
              className={`mt-3 font-semibold text-lg text-center
              ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {user.name || "User"}
            </h3>
          )}
        </div>

        {/* TITLE */}
        {!collapsed && (
          <h2
            className={`text-xl font-bold mb-6 text-center 
            ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Task Manager
          </h2>
        )}

        {/* MENU */}
        <nav className="space-y-2 text-lg">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-md"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-100"
                }
              `}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* DARK MODE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`mt-6 mx-4 w-auto flex items-center justify-center gap-2 py-3 rounded-lg
          ${darkMode ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
          ${collapsed ? "mx-2" : "mx-4"}`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
        </button>

        {/* 🎤 START VOICE BUTTON */}
        <button
          onClick={startVoice}
          className={`mt-3 mx-4 w-auto flex items-center justify-center gap-2 py-3 rounded-lg
          bg-purple-600 text-white hover:bg-purple-700
          ${collapsed ? "mx-2" : "mx-4"}`}
        >
          <Mic size={18} />
          {!collapsed && (voiceEnabled ? "Voice Active" : "Voice Assistant")}
        </button>
      </div>

      {/* ---------------------- */}
      {/* FLOATING STATUS POP    */}
      {/* ---------------------- */}
      {voiceEnabled && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-xl text-sm animate-fade-in">
          Mode: {modeText}
        </div>
      )}
    </>
  );
}
