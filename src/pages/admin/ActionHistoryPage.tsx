import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  User, 
  Filter, 
  RefreshCw, 
  Clock, 
  Search, 
  ChevronDown 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO, isToday, isYesterday, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import ActionHistoryService, { ActionHistory } from "@/services/ActionHistoryService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ActionHistory {
  _id: string;
  user_id: string;
  action_type: string;
  description: string;
  timestamp: string;
  user?: {
    id: string;
    firstname: string;
    lastName: string;
    email: string;
    role_id: string;
  };
  doctor?: {
    id: string;
    firstname: string;
    lastname: string;
    speciality: string;
  };
}

const ActionHistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ActionHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null);
  const { toast } = useToast();

  const actionTypes = Array.from(new Set(actionHistory.map(action => action.action_type)));

  const uniqueDoctors = React.useMemo(() => {
    const doctorsSet = new Map();
    
    actionHistory.forEach(action => {
      if (action.doctor) {
        doctorsSet.set(action.doctor.id, {
          id: action.user_id,
          firstname: action.doctor.firstname,
          lastname: action.doctor.lastname,
          speciality: action.doctor.speciality
        });
      }
    });
    
    return Array.from(doctorsSet.values());
  }, [actionHistory]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedDoctor, selectedActionType, selectedTimeRange, actionHistory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const actions = await ActionHistoryService.getAllActions();
      setActionHistory(actions);
      
    } catch (error: any) {
      setError(error.message || "Failed to load action history");
      toast({
        title: "Error",
        description: error.message || "Failed to load action history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...actionHistory];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(action => 
        action.description.toLowerCase().includes(term) ||
        action.action_type.toLowerCase().includes(term) ||
        (action.user && (
          `${action.user.firstname} ${action.user.lastName}`.toLowerCase().includes(term) ||
          action.user.email.toLowerCase().includes(term)
        )) ||
        (action.doctor && (
          `${action.doctor.firstname} ${action.doctor.lastname}`.toLowerCase().includes(term) ||
          action.doctor.speciality.toLowerCase().includes(term)
        ))
      );
    }
    
    if (selectedDoctor) {
      filtered = filtered.filter(action => action.user_id === selectedDoctor);
    }
    
    if (selectedActionType) {
      filtered = filtered.filter(action => action.action_type === selectedActionType);
    }
    
    if (selectedTimeRange) {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (selectedTimeRange) {
        case "today":
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "yesterday":
          cutoffDate = subDays(new Date(now.setHours(0, 0, 0, 0)), 1);
          break;
        case "week":
          cutoffDate = subDays(new Date(), 7);
          break;
        case "month":
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      filtered = filtered.filter(action => new Date(action.timestamp) >= cutoffDate);
    }
    
    setFilteredHistory(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDoctor(null);
    setSelectedActionType(null);
    setSelectedTimeRange(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return `Aujourd'hui à ${format(date, 'HH:mm')}`;
      } else if (isYesterday(date)) {
        return `Hier à ${format(date, 'HH:mm')}`;
      } else {
        return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
      }
    } catch (e) {
      return dateString;
    }
  };

  const getUserName = (action: ActionHistory): string => {
    if (action.doctor) {
      return `Dr. ${action.doctor.firstname} ${action.doctor.lastname}`;
    } else if (action.user) {
      return `${action.user.firstname} ${action.user.lastName}`;
    } else {
      return "Utilisateur inconnu";
    }
  };

  const getUserInitials = (action: ActionHistory): string => {
    if (action.doctor) {
      return `${action.doctor.firstname[0]}${action.doctor.lastname[0]}`;
    } else if (action.user) {
      return `${action.user.firstname[0]}${action.user.lastName[0]}`;
    } else {
      return "??";
    }
  };

  const getUserIdentifier = (action: ActionHistory): string => {
    return action.user?.email || action.user_id;
  };

  const getActionBadgeVariant = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case "login":
        return "default";
      case "logout":
        return "outline";
      case "create":
        return "success";
      case "update":
        return "warning";
      case "delete":
        return "destructive";
      case "view":
        return "secondary";
      default:
        return "default";
    }
  };

  // Format the description by removing ID sections
  const formatDescription = (description: string): string => {
    // Remove any "(ID: xyz123...)" pattern from the description
    return description.replace(/\s*\(ID:\s*[a-zA-Z0-9]+\)/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#021122]">Historique des actions</h1>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm"
          className="border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20 hover:text-[#2980BA]"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-[#91BDC8] shadow-md">
        <CardHeader >
          <CardTitle className="text-[#2980BA]">Filtres</CardTitle>
          <CardDescription className="text-[#334349]">Filtrer les actions par utilisateur, type ou période</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#619DB5]" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select 
              value={selectedDoctor || "all"} 
              onValueChange={(value) => setSelectedDoctor(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[200px] border-[#91BDC8] text-[#334349] focus:ring-[#619DB5]">
                <SelectValue placeholder="Médecin" />
              </SelectTrigger>
              <SelectContent className="border-[#91BDC8]">
                <SelectItem value="all">Tous les médecins</SelectItem>
                {uniqueDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstname} {doctor.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedActionType || "all"} 
              onValueChange={(value) => setSelectedActionType(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[200px] border-[#91BDC8] text-[#334349] focus:ring-[#619DB5]">
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent className="border-[#91BDC8]">
                <SelectItem value="all">Tous les types</SelectItem>
                {actionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedTimeRange || "all"} 
              onValueChange={(value) => setSelectedTimeRange(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[200px] border-[#91BDC8] text-[#334349] focus:ring-[#619DB5]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent className="border-[#91BDC8]">
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="yesterday">Hier</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#91BDC8] shadow-md">
        <CardHeader >
          <CardTitle className="text-[#2980BA]">Journaux d'activité</CardTitle>
          <CardDescription className="text-[#334349]">
            {loading 
              ? "Chargement des données..."
              : `${filteredHistory.length} action${filteredHistory.length > 1 ? 's' : ''} trouvée${filteredHistory.length > 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-[#2980BA]" />
              <span className="ml-3 text-lg text-[#334349]">Chargement des données...</span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-[#334349]">
              Aucune action ne correspond à vos critères de recherche
            </div>
          ) : (
            <div className="rounded-md border border-[#91BDC8]">
              <Table>
                <TableHeader className="bg-[#ECE7E3]">
                  <TableRow>
                    <TableHead className="w-[230px] text-[#334349]">Horodatage</TableHead>
                    <TableHead className="w-[300px] text-[#334349]">Utilisateur</TableHead>
                    <TableHead className="w-[330px] text-[#334349]">Type d'action</TableHead>
                    <TableHead className="text-[#334349]">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((action) => (
                    <TableRow key={action._id} className="hover:bg-[#ECE7E3]/20">
                      <TableCell className="font-mono text-xs text-[#334349]">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-[#619DB5]" />
                          {formatDate(action.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[#2980BA]/20 text-[#2980BA] flex items-center justify-center text-xs font-medium">
                            {getUserInitials(action)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate text-[#021122]">
                              {getUserName(action)}
                            </div>
                            <div className="text-xs text-[#619DB5] truncate">
                              {getUserIdentifier(action)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getActionBadgeVariant(action.action_type)} 
                          className="px-2 py-1 whitespace-nowrap bg-[#2980BA]/10 text-[#2980BA] hover:bg-[#2980BA]/20"
                        >
                          {action.action_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm line-clamp-2 text-[#334349]">
                          {formatDescription(action.description)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionHistoryPage;
