import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ListTodo, 
  Settings,
  LogOut,
  Bell
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
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md z-10 relative">
        <div className="p-5 border-b bg-gradient-to-r from-[#2980BA] to-[#619DB5] flex flex-col items-center">
          <img 
            src="/renal_trackr.png" 
            alt="Renal Trackr Logo" 
            className="h-12 w-auto mb-2"
          />
          <h2 className="text-lg font-bold text-white">Renal Trackr</h2>
          <p className="text-xs text-[#ECE7E3] opacity-90">Suivi néphrologique</p>
        </div>
        <nav className="p-4">
          {/* Avatar circle with better spacing */}
          {/* <div className="mb-8 flex justify-center mt-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2980BA] to-[#619DB5] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {getInitial()}
            </div>
          </div> */}
          
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#334349] uppercase tracking-wider pl-3 mb-2">
              Principal
            </p>
            <Link 
              to="/dashboard" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/dashboard") && !isActive("/dashboard/patients") && !isActive("/dashboard/appointments")
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Tableau de bord
            </Link>
            
            <Link 
              to="/dashboard/patients" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/dashboard/patients") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Patients
            </Link>
            
            <Link 
              to="/dashboard/appointments" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/dashboard/appointments") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Rendez-vous
            </Link>
            
            <Link 
              to="/dashboard/workflows" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/dashboard/workflows") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Protocoles
            </Link>
            
            <p className="text-xs font-semibold text-[#334349] uppercase tracking-wider pl-3 mt-6 mb-2">
              Préférences
            </p>
            <Link 
              to="/dashboard/settings" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/dashboard/settings") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Link>
            
            <div className="pt-4 border-t mt-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-[#021122] hover:bg-red-50 hover:text-red-700 p-3 rounded-lg transition-colors duration-150"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-4 px-6 shadow-sm flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#2980BA] to-[#619DB5] w-1 h-6 rounded-full mr-3"></div>
            <h1 className="text-xl font-semibold text-[#021122]">
              {location.pathname === "/dashboard" && "Tableau de bord"}
              {location.pathname.startsWith("/dashboard/patients") && !location.pathname.includes("/patients/new") && !location.pathname.includes("/patients/") && "Liste des patients"}
              {location.pathname === "/dashboard/patients/new" && "Nouveau patient"}
              {location.pathname.includes("/patients/") && location.pathname !== "/dashboard/patients/new" && "Dossier patient"}
              {location.pathname === "/dashboard/appointments" && "Rendez-vous"}
              {location.pathname === "/dashboard/workflows" && "Protocoles de suivi"}
              {location.pathname === "/dashboard/settings" && "Paramètres"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative text-[#334349] hover:text-[#2980BA]">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2980BA] to-[#619DB5] flex items-center justify-center text-white font-bold">
                {getInitial()}
              </div>
              <span className="ml-2 text-[#021122]">{getDisplayName()}</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6 bg-[#FAFAFA] flex-1">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-3 px-6 text-center text-xs text-[#334349]">
          © {new Date().getFullYear()} Renal Trackr - Développé pour le suivi des maladies rénales
        </footer>
      </div>

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="border-[#91BDC8]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2980BA]">Confirmation de déconnexion</AlertDialogTitle>
            <AlertDialogDescription className="text-[#334349]">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#91BDC8] text-[#334349]">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-[#2980BA] hover:bg-[#619DB5]">
              Déconnexion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
