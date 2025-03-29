import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PatientsList from "./pages/PatientsList";
import PatientDetail from "./pages/PatientDetail";
import PatientRegistration from "./pages/PatientRegistration";
import AppointmentsPage from "./pages/AppointmentsPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import SettingsPage from "./pages/SettingsPage";

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
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="patients/new" element={<PatientRegistration />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="workflows" element={<WorkflowsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Catch-all redirect to 404 */}
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Route>
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
