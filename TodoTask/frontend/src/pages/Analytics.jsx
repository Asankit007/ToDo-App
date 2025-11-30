// FILE: src/pages/Analytics.jsx

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid,
  Legend
} from "recharts";
import { useEffect, useState } from "react";
import api from "../config";

export default function Analytics() {

  const [statusData, setStatusData] = useState([
    { name: "To Do", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "Completed", value: 0 },
    { name: "Blocked", value: 0 },
  ]);

  const [priorityData, setPriorityData] = useState([
    { name: "High", count: 0 },
    { name: "Medium", count: 0 },
    { name: "Low", count: 0 },
  ]);

  const [productivityData, setProductivityData] = useState([]);

  const COLORS = ["#1A2C4F", "#33A1FD", "#4BB543", "#FF6B6B"];

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/tasks/analytics");
      setStatusData(res.data.statusData || []);
      setPriorityData(res.data.priorityData || []);
      setProductivityData(res.data.productivityData || []);
    } catch (err) {
      console.log("Analytics error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const totalTasks = statusData.reduce((sum, item) => sum + (item.value || 0), 0);
  const completed = statusData.find((s) => s.name === "Completed")?.value || 0;
  const productivity = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#E2F1E7] p-6 rounded-xl 
      animate-fadeSlow">

      <h1 className="text-3xl font-bold text-gray-800 mb-8
        animate-slideDown">
        Analytics Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl p-6 shadow border text-center 
        hover:shadow-lg transition animate-slideUp">
          <p className="text-gray-500">Total Tasks</p>
          <h2 className="text-3xl font-bold mt-1">{totalTasks}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border text-center 
        hover:shadow-lg transition animate-slideUp delay-100">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-3xl font-bold mt-1">{completed}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border text-center 
        hover:shadow-lg transition animate-slideUp delay-200">
          <p className="text-gray-500">Productivity</p>
          <h2 className="text-3xl font-bold mt-1">{productivity}%</h2>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow border flex flex-col items-center 
        hover:shadow-lg transition animate-scaleUp">
          <h2 className="font-bold text-gray-700 mb-4">Task Status</h2>

          <PieChart width={300} height={250}>
            <Pie
              data={statusData}
              dataKey="value"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={5}
            >
              {statusData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow border
        hover:shadow-lg transition animate-scaleUp delay-150">
          <h2 className="font-bold text-gray-700 mb-4 text-center">Priority</h2>

          <BarChart width={340} height={250} data={priorityData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1A2C4F" radius={4} />
          </BarChart>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow border lg:col-span-2 
        hover:shadow-lg transition animate-scaleUp delay-300">
          <h2 className="font-bold text-gray-700 mb-4 text-center">Weekly Productivity</h2>

          <LineChart width={700} height={280} data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#33A1FD"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </div>

      </div>

    </div>
  );
}
