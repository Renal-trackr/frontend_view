import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "@/services/AuthService";
import { Loader2 } from "lucide-react";

const RootRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Fonction simplifiée qui évite les appels API inutiles
    const checkAuth = () => {
      try {
        if (AuthService.isAuthenticatedAdmin()) {
          setRedirectPath('/admin');
        } else if (AuthService.isAuthenticatedDoctor()) {
          setRedirectPath('/dashboard');
        } else {
          setRedirectPath('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        setRedirectPath('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg text-gray-600">Chargement de l'application...</p>
      </div>
    );
  }

  return redirectPath ? <Navigate to={redirectPath} replace /> : null;
};

export default RootRedirect;
