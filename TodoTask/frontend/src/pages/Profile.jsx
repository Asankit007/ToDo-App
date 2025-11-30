import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoCamera } from "react-icons/io5";
import api from "../config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  // ==============================
  // FETCH PROFILE DATA
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me");

        setName(res.data.name || "");
        setBio(res.data.bio || "");

        if (res.data.profile_pic) {
          setProfilePic(res.data.profile_pic);
        }
      } catch (err) {
        console.log("Profile load error:", err);
      }
    })();
  }, []);

  // ==============================
  // HANDLE IMAGE UPLOAD
  // ==============================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => setProfilePic(null);

  // ==============================
  // SAVE PROFILE TO BACKEND
  // ==============================
  const saveProfile = async () => {
    try {
      await api.put("/auth/update", {
        name,
        bio,
        profile_pic: profilePic || "",
      });

      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
      console.log(err);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Logout error ignored:", err);
    }

    localStorage.removeItem("token");
    navigate("/login");
  };

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="p-6 flex justify-center bg-[#E2F1E7] min-h-screen">
      
      {/* Animated Card Container */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-white p-10 rounded-2xl border shadow-xl max-w-xl w-full relative overflow-hidden"
      >
        {/* Decorative Soft Glow */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-2xl blur-2xl"></div>

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-extrabold text-gray-800 mb-8 text-center drop-shadow"
          >
            Profile Settings
          </motion.h1>

          {/* Profile Photo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-36 h-36 mx-auto mb-6"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 opacity-30 blur-2xl"></div>

            {profilePic ? (
              <img
                src={profilePic}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 border flex items-center justify-center text-gray-600 text-lg shadow relative z-10">
                No Image
              </div>
            )}

            {/* Upload Button */}
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg z-20 hover:scale-110 transition transform">
              <IoCamera size={20} />
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>

            {/* Remove Image */}
            {profilePic && (
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 z-20 hover:scale-110 transition transform"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </motion.div>

          {/* NAME */}
          <label className="text-gray-700 font-semibold">Name</label>
          <input
            className="border p-3 w-full rounded-md mb-4 mt-1 focus:ring-2 focus:ring-blue-400"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* BIO */}
          <label className="text-gray-700 font-semibold">Bio</label>
          <textarea
            className="border p-3 w-full rounded-md mb-4 mt-1 focus:ring-2 focus:ring-blue-400"
            placeholder="Write something about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          {/* SAVE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={saveProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg w-full font-semibold shadow-md transition"
          >
            Save Changes
          </motion.button>

          {/* LOGOUT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg w-full font-semibold shadow-md transition"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
