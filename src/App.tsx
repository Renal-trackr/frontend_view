import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PatientsList from "./pages/PatientsList";
import PatientDetail from "./pages/PatientDetail";
import PatientRegistration from "./pages/PatientRegistration";
import AppointmentsPage from "./pages/AppointmentsPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminLogin from "./pages/auth/AdminLogin";
import DoctorLogin from "./pages/auth/DoctorLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorManagement from "./pages/admin/DoctorManagement";
import ActionHistoryPage from "./pages/admin/ActionHistoryPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import RootRedirect from "./components/RootRedirect";

const queryClient = new QueryClient();

const App = () => {
  console.log("App rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root redirect handler */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Routes d'authentification */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<DoctorLogin />} />
            
            {/* Routes Admin with AdminLayout */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="doctors" element={<DoctorManagement />} />
              <Route path="activity" element={<ActionHistoryPage />} />
            </Route>
            
            {/* Routes principales (protégées) */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="patients/new" element={<PatientRegistration />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="workflows" element={<WorkflowsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* For backward compatibility */}
            <Route path="/patients" element={<Navigate to="/dashboard/patients" replace />} />
            <Route path="/patients/new" element={<Navigate to="/dashboard/patients/new" replace />} />
            <Route path="/patients/:id" element={<Navigate to="/dashboard/patients/:id" replace />} />
            <Route path="/appointments" element={<Navigate to="/dashboard/appointments" replace />} />
            <Route path="/workflows" element={<Navigate to="/dashboard/workflows" replace />} />
            <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
            
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
