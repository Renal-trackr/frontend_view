import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, Calendar, Home, Settings, User, Users, Bell, LogOut, UserCircle, ChevronDown, Info, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Exemple de notifications
  const notifications = [
    { 
      id: "1", 
      title: "Patient critique", 
      description: "Jean Dupont a des résultats anormaux", 
      time: "Il y a 1h", 
      type: "urgent",
      read: false
    },
    { 
      id: "2", 
      title: "Rendez-vous demain", 
      description: "3 patients programmés à 9h", 
      time: "Il y a 3h",
      type: "info",
      read: false
    },
    { 
      id: "3", 
      title: "Nouvelle fonctionnalité", 
      description: "Découvrez les workflows personnalisés", 
      time: "Hier",
      type: "system",
      read: true
    }
  ];
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Fonction de déconnexion simulée
  const handleLogout = () => {
    // Ici, vous devriez implémenter la logique de déconnexion réelle
    // (supprimer les tokens, nettoyer le state, etc.)
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    
    // Redirection vers une page de connexion (à simuler pour l'instant)
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className={`text-xl font-semibold text-primary-600 ${!showSidebar && 'sr-only'}`}>RenalTrackr</h1>
          {!showSidebar && <Activity className="h-6 w-6 text-primary-600 mx-auto" />}
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <ChevronDown className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-180" />}
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/") 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className={`w-5 h-5 ${isActive("/") ? "text-primary-600" : "text-primary-500"}`} />
                {showSidebar && <span className="ml-3">Tableau de bord</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/patients" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/patients") 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className={`w-5 h-5 ${isActive("/patients") ? "text-primary-600" : "text-primary-500"}`} />
                {showSidebar && <span className="ml-3">Patients</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/appointments" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/appointments") 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Calendar className={`w-5 h-5 ${isActive("/appointments") ? "text-primary-600" : "text-primary-500"}`} />
                {showSidebar && <span className="ml-3">Rendez-vous</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/workflows" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/workflows") 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Activity className={`w-5 h-5 ${isActive("/workflows") ? "text-primary-600" : "text-primary-500"}`} />
                {showSidebar && <span className="ml-3">Workflows</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center p-2 rounded-md ${
                  isActive("/settings") 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings className={`w-5 h-5 ${isActive("/settings") ? "text-primary-600" : "text-primary-500"}`} />
                {showSidebar && <span className="ml-3">Paramètres</span>}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          {showSidebar ? (
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/doctor.png" alt="Dr. Richard" />
                <AvatarFallback className="bg-primary-100 text-primary-700">DR</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Dr. Richard</p>
                <p className="text-xs text-gray-500">Néphrologue</p>
              </div>
            </div>
          ) : (
            <Avatar className="h-8 w-8 mx-auto">
              <AvatarImage src="/avatars/doctor.png" alt="Dr. Richard" />
              <AvatarFallback className="bg-primary-100 text-primary-700">DR</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10 w-full">
          <h2 className="text-lg font-medium">Suivi des patients MRC</h2>
          <div className="flex items-center space-x-4">
            {/* Menu des notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map(notification => (
                    <DropdownMenuItem key={notification.id} className="p-0">
                      <div className={`w-full p-3 cursor-pointer ${!notification.read ? 'bg-primary-50' : ''}`}>
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            notification.type === 'urgent' ? 'bg-danger-100 text-danger-600' :
                            notification.type === 'info' ? 'bg-primary-100 text-primary-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {notification.type === 'urgent' ? 
                              <AlertTriangle className="h-4 w-4" /> : 
                              notification.type === 'info' ?
                              <Info className="h-4 w-4" /> :
                              <Bell className="h-4 w-4" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                  <Link to="/notifications" className="text-primary-600 text-sm">
                    Voir toutes les notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Menu du profil utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 flex items-center focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">DR</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="p-4">
                  <div className="flex items-center">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary-100 text-primary-700">DR</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-medium text-base">Dr. Richard Dupont</p>
                      <p className="text-sm text-gray-500">richard.dupont@example.com</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem onClick={() => navigate('/settings?tab=profile')} className="py-2">
                    <UserCircle className="mr-3 h-5 w-5" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="py-2">
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-1">
                  <DropdownMenuItem onClick={handleLogout} className="text-danger-600 focus:text-danger-600 py-2">
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
