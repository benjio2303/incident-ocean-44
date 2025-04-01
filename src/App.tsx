import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { IncidentProvider } from "@/contexts/IncidentContext";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import LoginPage from "@/pages/LoginPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

// User Pages
import UserDashboard from "@/pages/user/UserDashboard";
import ReportIncident from "@/pages/user/ReportIncident";
import UserIncidents from "@/pages/user/UserIncidents";
import UserIncidentDetails from "@/pages/user/UserIncidentDetails";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminIncidents from "@/pages/admin/AdminIncidents";
import AdminIncidentDetails from "@/pages/admin/AdminIncidentDetails";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} replace />
        ) : (
          <LoginPage />
        )
      } />
      
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route element={<MainLayout />}>
        {/* Root path now uses the Index component */}
        <Route path="/" element={<Index />} />
        
        {/* User Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/user/report-incident" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <ReportIncident />
          </ProtectedRoute>
        } />
        
        <Route path="/user/incidents" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserIncidents />
          </ProtectedRoute>
        } />
        
        <Route path="/user/incidents/:id" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserIncidentDetails />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/incidents" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminIncidents />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/incidents/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminIncidentDetails />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <IncidentProvider>
            <AppRoutes />
          </IncidentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
