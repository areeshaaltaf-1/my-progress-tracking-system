import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import AllProjects from "./pages/Admin/AllProjects";
import AllTasks from "./pages/Admin/AllTasks";
import Notifications from "./pages/Admin/Notifications";
import Reports from "./pages/Admin/Reports";

import SupervisorProjectBoard from "./pages/Supervisor/SupervisorProjectBoard";
import SupervisorMyProjects from "./pages/Supervisor/SupervisorMyProjects";
import SupervisorTeam from "./pages/Supervisor/SupervisorTeam";
import SupervisorReports from "./pages/Supervisor/SupervisorReports";
import SupervisorNotifications from "./pages/Supervisor/SupervisorNotifications";
import InternTasks from "./pages/Intern/InternTasks";
import InternWorkLog from "./pages/Intern/InternWorkLog";
import InternMyProjects from "./pages/Intern/InternMyProjects";
import InternNotifications from "./pages/Intern/InternNotifications";
import { ToastProvider } from "./context/ToastContext";
import { NotificationProvider } from "./context/NotificationContext";

// ✅ Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
 const role = sessionStorage.getItem("role");
const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  if (!allowedRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
      <ToastProvider>
        <NotificationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard/allprojects" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllProjects />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard/alltasks" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllTasks />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard/notifications" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard/reports" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        } />
        

        {/* Supervisor Routes */}
        <Route path="/supervisor/dashboard" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorMyProjects />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/dashboard/:projectId" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorProjectBoard />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/team" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorTeam />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/reports" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorReports />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/notifications" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorNotifications />
          </ProtectedRoute>
        } />

        {/* Intern Routes */}
        <Route path="/intern/tasks" element={
          <ProtectedRoute allowedRoles={["internee"]}>
            <InternTasks />
          </ProtectedRoute>
        } />
        <Route path="/intern/tasks/:projectId" element={
  <ProtectedRoute allowedRoles={["internee"]}>
    <InternTasks />
  </ProtectedRoute>
} />
        <Route path="/intern/work-log" element={
          <ProtectedRoute allowedRoles={["internee"]}>
            <InternWorkLog />
          </ProtectedRoute>
        } />
        <Route path="/intern/projects" element={
          <ProtectedRoute allowedRoles={["internee"]}>
            <InternMyProjects />
          </ProtectedRoute>
        } />
        <Route path="/intern/notifications" element={
          <ProtectedRoute allowedRoles={["internee"]}>
            <InternNotifications />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  </ToastProvider>
  );
}

export default App;