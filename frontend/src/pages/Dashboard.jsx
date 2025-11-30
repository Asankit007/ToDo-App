import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config";

export default function Dashboard() {
  const [overdue, setOverdue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // Load Upcoming & Overdue tasks
  const loadData = async () => {
    try {
      const due = await api.get("/tasks/overdue");
      const upcomingTasks = await api.get("/tasks/upcoming");

      setOverdue(due.data || []);
      setUpcoming(upcomingTasks.data || []);
    } catch (err) {
      console.log("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 bg-[#C5F3DA] dark:bg-gray-900 min-h-screen transition">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-wide">
        Welcome Back 👋
      </h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Total Tasks */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700 hover:scale-[1.02] transition">
          <p className="text-gray-500 dark:text-gray-300">Upcoming Tasks</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
            {upcoming.length}
          </h2>
        </div>

        {/* Overdue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700 hover:scale-[1.02] transition">
          <p className="text-gray-500 dark:text-gray-300">Overdue Tasks</p>
          <h2 className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
            {overdue.length}
          </h2>
        </div>

        {/* Add Task Shortcut */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition">
          <p className="text-gray-100">Quick Add</p>
          <Link
            to="/add-task"
            className="inline-block mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            + Add Task
          </Link>
        </div>
      </div>

      {/* UPCOMING TASK LIST */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border dark:border-gray-700 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Upcoming Tasks ⏳
        </h2>

        {upcoming.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No upcoming tasks 🎉</p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow border dark:border-gray-600"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Due: {task.date}
                  </p>
                </div>

                <Link
                  to={`/task/${task._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OVERDUE TASK LIST */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Overdue Tasks ⚠️
        </h2>

        {overdue.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Great! No overdue tasks 🚀</p>
        ) : (
          <div className="space-y-4">
            {overdue.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-red-100 dark:bg-red-900 p-4 rounded-xl shadow border border-red-300 dark:border-red-700"
              >
                <div>
                  <h3 className="font-bold text-red-700 dark:text-red-300 text-lg">
                    {task.title}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Due: {task.date}
                  </p>
                </div>

                <Link
                  to={`/task/${task._id}`}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Fix Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
