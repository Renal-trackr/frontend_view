import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import AuthService from "@/services/AuthService";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Version simplifiée sans appel API
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticatedAdmin());
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg">Vérification de l'authentification...</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;
