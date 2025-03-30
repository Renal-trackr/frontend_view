import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import AuthService from "@/services/AuthService";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      // Check if token exists and is valid
      if (AuthService.isAuthenticated()) {
        setIsAdmin(true);
      } else {
        // Token is expired, try to refresh
        const refreshed = await AuthService.refreshToken();
        setIsAdmin(refreshed);
      }
      
      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg">Vérification de l'authentification...</p>
      </div>
    );
  }

  return isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;
