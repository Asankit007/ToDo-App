import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config";
import { FiEye } from "react-icons/fi";

export default function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load tasks
  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Search + Date Filter
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm.trim()) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate.trim()) {
      filtered = filtered.filter((t) => t.date === selectedDate);
    }

    setFilteredTasks(filtered);
  }, [searchTerm, selectedDate, tasks]);

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // Priority Colors
  const priorityColors = {
    High: "text-red-600 bg-red-100",
    Medium: "text-yellow-600 bg-yellow-100",
    Low: "text-green-600 bg-green-100",
  };

  return (
    <div className="p-6 min-h-screen bg-[#E2F1E7] rounded-xl">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-slideDown">
        Tasks
      </h1>

      {/* TOP BAR */}
      <div className="flex items-center gap-4 mb-6 relative animate-fadeSlow">

        {/* Search */}
        <input
          className="border p-3 rounded-lg w-1/3 bg-white shadow-md
            focus:ring-2 ring-blue-400 transition-all"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Priority Filter */}
        <select className="border p-3 rounded-lg bg-white shadow-md">
          <option>Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* Date Filter */}
        <div className="flex items-center gap-3 relative">
          <button
            className="border p-3 rounded-lg bg-white hover:bg-gray-50 shadow-md transition"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            Filter by Date
          </button>

          <input
            type="text"
            value={selectedDate}
            readOnly
            placeholder="No date"
            className="border p-3 rounded-lg w-40 bg-white shadow-md text-gray-700"
          />

          {showDatePicker && (
            <input
              type="date"
              className="absolute top-14 left-0 border p-2 rounded-lg bg-white shadow-lg"
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowDatePicker(false);
              }}
            />
          )}
        </div>

        {/* Add Task Button */}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg ml-auto shadow-lg 
          hover:bg-blue-700 hover:scale-105 transition transform"
          onClick={() => navigate("/add-task")}
        >
          + Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <div className="bg-white p-6 rounded-xl border shadow-lg animate-slideUp">

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 py-6 animate-fadeSlow">
            No tasks found.
          </p>
        )}

        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="border p-4 rounded-xl mb-4 flex justify-between items-center 
            bg-gray-50 shadow hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            {/* Task Info */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>

              <p className="text-gray-600 text-sm flex items-center gap-2">

                {/* Priority Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>

                | Due: {task.date}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">

              {/* View */}
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                shadow flex items-center gap-1 transition transform hover:scale-105"
                onClick={() => navigate(`/task/${task._id}`)}
              >
                <FiEye size={18} />
              </button>

              {/* Edit */}
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                shadow transition transform hover:scale-105"
                onClick={() =>
                  navigate(`/add-task?id=${task._id}`, { state: task })
                }
              >
                Edit
              </button>

              {/* Delete */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                shadow transition transform hover:scale-105"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
