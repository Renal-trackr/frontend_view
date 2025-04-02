import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ListTodo, 
  Settings,
  LogOut
} from "lucide-react";
import AuthService from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const info = AuthService.getDoctorInfo();
    if (info && info.doctor) {
      setDoctorInfo(info.doctor);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    const success = await AuthService.logoutDoctor();
    
    if (success) {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
    
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Get doctor's first initial for the avatar
  const getInitial = () => {
    if (doctorInfo && doctorInfo.firstname) {
      return doctorInfo.firstname[0].toUpperCase();
    }
    return "D";
  };

  // Get display name
  const getDisplayName = () => {
    if (doctorInfo && doctorInfo.firstname && doctorInfo.lastname) {
      return `Dr. ${doctorInfo.firstname} ${doctorInfo.lastname}`;
    }
    return "Médecin";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Renal Trackr</h2>
          <p className="text-xs text-gray-500 mt-1">Suivi néphrologique</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/dashboard") && !isActive("/dashboard/patients") && !isActive("/dashboard/appointments")
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/patients" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/dashboard/patients") 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Patients
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/appointments" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/dashboard/appointments") 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Rendez-vous
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/workflows" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/dashboard/workflows") 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ListTodo className="h-4 w-4 mr-2" />
                Protocoles
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/settings" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/dashboard/settings") 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Link>
            </li>
            <li className="pt-4 border-t mt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 p-2"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname === "/dashboard" && "Tableau de bord"}
            {location.pathname.startsWith("/dashboard/patients") && !location.pathname.includes("/patients/new") && !location.pathname.includes("/patients/") && "Liste des patients"}
            {location.pathname === "/dashboard/patients/new" && "Nouveau patient"}
            {location.pathname.includes("/patients/") && location.pathname !== "/dashboard/patients/new" && "Dossier patient"}
            {location.pathname === "/dashboard/appointments" && "Rendez-vous"}
            {location.pathname === "/dashboard/workflows" && "Protocoles de suivi"}
            {location.pathname === "/dashboard/settings" && "Paramètres"}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {getInitial()}
              </div>
              <span className="ml-2 text-gray-700">{getDisplayName()}</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout}>Déconnexion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
