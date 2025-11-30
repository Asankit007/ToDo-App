import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import todoAnimation from "../assets/animations/todo.json";
import { motion } from "framer-motion";
import "../styles/landingBackground.css";  // <-- ADDED CSS FILE

export default function Landing() {
  return (
    <div className="animated-bg min-h-screen flex items-center justify-center px-6">

      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white border rounded-3xl shadow-2xl p-10 max-w-5xl w-full 
                   grid grid-cols-1 lg:grid-cols-2 gap-10 
                   backdrop-blur-lg bg-opacity-95 relative overflow-hidden"
      >

        {/* BG SHAPES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute -top-10 -right-16 w-72 h-72 bg-green-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute -bottom-10 -left-16 w-72 h-72 bg-green-300 rounded-full blur-3xl"
        />

        {/* ANIMATION */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center justify-center"
        >
          <Lottie
            animationData={todoAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>

        {/* TEXT AREA */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-col justify-center"
        >
          <motion.h1
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="text-4xl font-extrabold text-gray-800 mb-4 overflow-hidden whitespace-nowrap border-r-4 border-gray-800 pr-2"
          >
            To-Do List Manager
          </motion.h1>

          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Organize your tasks, track your progress, and stay productive with your
            smart & modern task management application.
          </p>

          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.07 }}>
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-3 rounded-xl 
                           text-lg shadow-md hover:shadow-xl hover:bg-green-700 transition-all duration-300"
              >
                Login
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.07 }}>
              <Link
                to="/register"
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl 
                           text-lg shadow-md hover:shadow-xl hover:bg-gray-200 transition-all duration-300"
              >
                Register
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
