// FILE: src/pages/Kanban.jsx

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config";

export default function Kanban() {
  const navigate = useNavigate();

  const [columns, setColumns] = useState({
    todo: { name: "To Do", items: [] },
    inprogress: { name: "In Progress", items: [] },
    completed: { name: "Completed", items: [] },
    blocked: { name: "Blocked", items: [] },
  });

  // Load Tasks
  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      const tasks = res.data || [];

      const grouped = {
        todo: { name: "To Do", items: [] },
        inprogress: { name: "In Progress", items: [] },
        completed: { name: "Completed", items: [] },
        blocked: { name: "Blocked", items: [] },
      };

      tasks.forEach((task) => {
        const status = task.status || "todo";
        if (!grouped[status]) return;

        grouped[status].items.push({
          id: task._id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          date: task.date,
        });
      });

      setColumns(grouped);
    } catch (err) {
      console.log("Error loading tasks:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Drag Handler
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [moved] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, moved);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    });

    try {
      await api.put(`/tasks/status/${moved.id}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.log("Status update failed:", err);
    }
  };

  const deleteTask = async (colId, itemId) => {
    try {
      await api.delete(`/tasks/${itemId}`);
      loadTasks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const editTask = (colId, item) => {
    navigate(`/add-task?id=${item.id}`, {
      state: {
        _id: item.id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        date: item.date,
      },
    });
  };

  // Priority Colors
  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <div className="p-4 sm:p-6 bg-[#E2F1E7] min-h-screen rounded-xl">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fadeSlow">
        Kanban Board
      </h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">

          {Object.entries(columns).map(([colId, colData], index) => (
            <div
              key={colId}
              className="bg-white rounded-2xl p-4 shadow-lg border
              transform transition hover:scale-[1.01] hover:shadow-2xl"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-700 text-xl flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  {colData.name}
                </h2>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold shadow">
                  {colData.items.length}
                </span>
              </div>

              {/* Tasks List */}
              <Droppable droppableId={colId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 min-h-[60px]"
                  >
                    {colData.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-[#F8FBFA] border shadow-sm p-4 rounded-xl
                            hover:shadow-md transition transform hover:-translate-y-1
                            flex flex-col gap-2"
                          >
                            {/* Task Title */}
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800 text-lg">
                                {item.title}
                              </span>

                              <span
                                className={`${priorityColors[item.priority]} w-3 h-3 rounded-full`}
                              ></span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {item.description || "No description"}
                            </p>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => editTask(colId, item)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => deleteTask(colId, item.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Add Task Button (Only in To Do Column) */}
              {colId === "todo" && (
                <button
                  onClick={() => navigate("/add-task")}
                  className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center w-full shadow"
                >
                  + Add Task
                </button>
              )}
            </div>
          ))}

        </div>
      </DragDropContext>
    </div>
  );
}
