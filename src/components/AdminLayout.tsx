import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, UserPlus, LogOut, Settings, ActivityIcon } from "lucide-react";
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Renal Trackr Admin</h2>
          <p className="text-xs text-gray-500 mt-1">Panneau d'administration</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin") 
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
                to="/admin/doctors" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin/doctors") 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Gestion des médecins
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/activity" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin/activity") 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ActivityIcon className="h-4 w-4 mr-2" />
                Historique d'activité
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
            {location.pathname === "/admin" && "Tableau de bord"}
            {location.pathname === "/admin/doctors" && "Gestion des médecins"}
            {location.pathname === "/admin/activity" && "Historique d'activité"}
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

export default AdminLayout;
