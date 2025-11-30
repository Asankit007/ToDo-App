import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../config";

export default function AddTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");

  // NEW STATES
  const [fileBase64, setFileBase64] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setDesc(editData.description || "");
      setPriority(editData.priority);
      setDate(editData.date);

      if (editData.file) {
        setFileBase64(editData.file);
        setFileName(editData.original_file_name || "Previously Uploaded File");
      }
    }
  }, []);

  // ------------------------------------
  // File Upload → Convert to Base64
  // ------------------------------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ------------------------------------
  // Save Task
  // ------------------------------------
  const saveTask = async () => {
    if (!title) return alert("Title required");

    const data = {
      title,
      description: desc,
      priority,
      date,
      file: fileBase64 || null,
      file_name: fileBase64 ? `uploaded_${Date.now()}` : null,
      original_file_name: fileName || null,
    };

    try {
      if (editData) {
        await api.put(`/tasks/${editData._id}`, data);
        alert("Task Updated!");
      } else {
        await api.post("/tasks/", data);
        alert("Task Added!");
      }
      navigate("/tasks");
    } catch (err) {
      console.log("Error saving:", err);
      alert("Error saving task");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white p-8 rounded-xl border shadow-sm max-w-xl w-full">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editData ? "Edit Task" : "Add New Task"}
        </h2>

        <label className="font-semibold text-gray-700">Title</label>
        <input
          className="border p-3 rounded-md w-full mb-4 mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="font-semibold text-gray-700">Description</label>
        <textarea
          className="border p-3 rounded-md w-full mb-4 mt-1"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <label className="font-semibold text-gray-700">Priority</label>
        <select
          className="border p-3 rounded-md w-full mb-4 mt-1"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Choose Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label className="font-semibold text-gray-700">Due Date</label>
        <input
          type="date"
          className="border p-3 rounded-md w-full mb-6 mt-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* FILE UPLOAD */}
        <label className="font-semibold text-gray-700">Attach File</label>
        <input
          type="file"
          className="border p-3 w-full rounded-md mb-4 mt-1"
          onChange={handleFileUpload}
        />

        {fileName && (
          <p className="text-sm text-gray-600 mb-4">
            📎 Selected File: <strong>{fileName}</strong>
          </p>
        )}

        <button
          onClick={saveTask}
          className="bg-blue-600 hover:bg-blue-700 w-full py-3 text-white rounded-lg"
        >
          {editData ? "Update Task" : "Create Task"}
        </button>

      </div>
    </div>
  );
}
