// FILE: src/pages/EditTask.jsx
// UPDATED: Edit task connected to backend

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api  from "../config";

export default function EditTask() {
  const { task_id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const loadTask = async () => {
    try {
      const res = await api.get("/tasks/");
      const task = res.data.find((t) => t._id === task_id);

      if (!task) {
        setMessage("Task not found");
        return;
      }

      setTitle(task.title);
      setDescription(task.description);
    } catch (err) {
      setMessage("Failed to load task");
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${task_id}`, {
        title,
        description,
      });

      navigate("/tasks");
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      setMessage("Failed to update task");
    }
  };

  return (
    <div className="edit-task">
      <h2>Edit Task</h2>

      {message && <p className="error">{message}</p>}

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}
