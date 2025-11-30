import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.log("Error loading task:", err);
      }
    })();
  }, [id]);

  if (!task) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  // Detect file type
  const getFileType = (file) => {
    if (!file) return "none";
    if (file.includes("application/pdf")) return "pdf";
    if (file.includes("image")) return "image";
    return "other";
  };

  const fileType = getFileType(task.file);

  return (
    <div className="p-6 min-h-screen bg-[#E2F1E7] flex justify-center fade-in">
      <div className="bg-white p-10 rounded-2xl shadow-xl border max-w-3xl w-full animated-card">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 tracking-wide slide-down">
            {task.title}
          </h2>

          <button
            onClick={() => navigate("/tasks")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
          >
            Back
          </button>
        </div>

        {/* DETAILS */}
        <div className="space-y-4 text-gray-700 text-lg slide-up">
          <p>
            <strong>Description:</strong> {task.description || "No description"}
          </p>

          <p>
            <strong>Priority:</strong>{" "}
            <span className="px-3 py-1 bg-[#C5F3DA] rounded-lg">
              {task.priority}
            </span>
          </p>

          <p>
            <strong>Due Date:</strong> {task.date}
          </p>
        </div>

        {/* FILE PREVIEW */}
        <div className="mt-10 p-5 bg-gray-100 rounded-xl border shadow-sm pulse">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            📎 Attached File
          </h3>

          {!task.file ? (
            <p className="text-gray-500">No file uploaded</p>
          ) : (
            <div className="flex flex-col items-start gap-4">

              {/* DOWNLOAD BUTTON */}
              <a
                href={task.file}
                download={task.original_file_name || "file"}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
              >
                ⬇ Download File
              </a>

              {/* PREVIEW CONTAINER */}
              <div className="w-full mt-3 rounded-xl overflow-hidden shadow-lg border bg-white preview-box">

                {fileType === "pdf" && (
                  <iframe
                    src={task.file}
                    title="PDF Preview"
                    className="w-full h-[500px]"
                  ></iframe>
                )}

                {fileType === "image" && (
                  <img
                    src={task.file}
                    alt="Task File"
                    className="w-full max-h-[500px] object-contain"
                  />
                )}

                {fileType === "other" && (
                  <div className="p-4 text-gray-700">
                    ⚠️ Preview not supported. Please use the download button.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* 🔥 ANIMATIONS */}
      <style>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in both;
        }

        .slide-down {
          animation: slideDown 0.7s ease-out both;
        }

        .slide-up {
          animation: slideUp 0.8s ease-out both;
        }

        .animated-card {
          animation: cardFloat 1.2s ease forwards;
        }

        .pulse {
          animation: softPulse 2.8s infinite ease-in-out;
        }

        .preview-box {
          animation: fadeIn 1.2s ease-in-out both;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardFloat {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes softPulse {
          0%, 100% { box-shadow: 0 0 0px rgba(0,0,0,0.05); }
          50% { box-shadow: 0 0 12px rgba(0,0,0,0.15); }
        }
      `}</style>
    </div>
  );
}
