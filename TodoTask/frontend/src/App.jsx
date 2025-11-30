import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskDetails from "./pages/TaskDetails";


import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Kanban from "./pages/Kanban";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ActivityLog from "./pages/ActivityLog";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import VoiceBot from "./pages/VoiceBot";
import AISummary from "./pages/AISummary";


import ResetPassword from "./pages/ResetPassword";

import ForgotPassword from "./pages/ForgotPassword";

import DashboardLayout from "./components/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/voice" element={<VoiceBot />} />



        {/* DASHBOARD (Protected Layout) */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route path="/voice" element={<VoiceBot />} />
        <Route path="/ai-summary" element={<AISummary />} />


        <Route
          path="/tasks"
          element={
            <DashboardLayout>
              <Tasks />
            </DashboardLayout>
          }
        />

        <Route
          path="/kanban"
          element={
            <DashboardLayout>
              <Kanban />
            </DashboardLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />

        <Route
          path="/activity"
          element={
            <DashboardLayout>
              <ActivityLog />
            </DashboardLayout>
          }
        />

        <Route
          path="/add-task"
          element={
            <DashboardLayout>
              <AddTask />
            </DashboardLayout>
          }
        />
        <Route path="/task/:id" element={<TaskDetails />} />


        <Route
          path="/edit-task/:id"
          element={
            <DashboardLayout>
              <EditTask />
            </DashboardLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
