import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserPlus, LogOut, ActivityIcon, Bell } from "lucide-react";
import AuthService from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
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

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState({ firstname: "", lastName: "" });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  useEffect(() => {
    // Get user info from local storage
    const adminUser = localStorage.getItem("admin_user");
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        setUserInfo({
          firstname: userData.firstname || "",
          lastName: userData.lastName || ""
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    const success = await AuthService.logout();
    
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
    
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Get user's first initial for the avatar
  const getInitial = () => {
    if (userInfo.firstname) {
      return userInfo.firstname[0].toUpperCase();
    }
    return "A";
  };

  // Get display name
  const getDisplayName = () => {
    if (userInfo.firstname && userInfo.lastName) {
      return `${userInfo.firstname} ${userInfo.lastName}`;
    }
    return "Administrateur";
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white shadow-md z-10 relative">
        <div className="p-5 border-b bg-gradient-to-r from-[#334349] to-[#2980BA] flex flex-col items-center">
          <img 
            src="/renal_trackr.png" 
            alt="Renal Trackr Logo" 
            className="h-12 w-auto mb-2"
          />
          <h2 className="text-lg font-bold text-white">Renal Trackr</h2>
          <p className="text-xs text-[#ECE7E3] opacity-90">Administration</p>
        </div>
        <nav className="p-4">
          {/* Avatar circle with better spacing */}
          {/* <div className="mb-8 flex justify-center mt-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2980BA] to-[#619DB5] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {getInitial()}
            </div>
          </div> */}
          
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#334349] uppercase tracking-wider pl-3 mt-6 mb-2">
              Principal
            </p>
            <Link 
              to="/admin" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/admin") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Tableau de bord
            </Link>
            
            <p className="text-xs font-semibold text-[#334349] uppercase tracking-wider pl-3 mt-6 mb-2">
              Gestion
            </p>
            <Link 
              to="/admin/doctors" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/admin/doctors") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Gestion des médecins
            </Link>
            
            <Link 
              to="/admin/activity" 
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive("/admin/activity") 
                  ? "bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA] text-[#2980BA] border-l-4 border-[#2980BA]" 
                  : "text-[#021122] hover:bg-[#FAFAFA]"
              }`}
            >
              <ActivityIcon className="h-4 w-4 mr-2" />
              Historique d'activité
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
              {location.pathname === "/admin" && "Tableau de bord"}
              {location.pathname === "/admin/doctors" && "Gestion des médecins"}
              {location.pathname === "/admin/activity" && "Historique d'activité"}
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
          © {new Date().getFullYear()} Renal Trackr - Administration
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

export default AdminLayout;
