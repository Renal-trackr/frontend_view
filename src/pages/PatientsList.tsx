import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  User, 
  FileText, 
  Calendar,
  Loader2, 
  AlertCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PatientStatus, MRCStage } from "@/lib/types";
import PatientService from "@/services/PatientService";

const PatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.firstname.toLowerCase().includes(lowercasedSearch) ||
            patient.lastname.toLowerCase().includes(lowercasedSearch) ||
            `${patient.firstname} ${patient.lastname}`
              .toLowerCase()
              .includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await PatientService.getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError(error.message || "Impossible de récupérer la liste des patients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewPatient = (id) => {
    navigate(`/dashboard/patients/${id}`);
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Calculate patient age from birth date
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#021122]">Patients</h1>
        <Button 
          onClick={() => navigate("/dashboard/patients/new")} 
          className="bg-[#2980BA] hover:bg-[#619DB5] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouveau patient
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#619DB5]" />
          <Input
            type="search"
            placeholder="Rechercher un patient..."
            className="pl-8 border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-[#2980BA]">Liste des patients</CardTitle>
          <CardDescription className="text-[#334349]">
            {loading 
              ? "Chargement des patients..." 
              : filteredPatients.length === 0 && searchTerm 
                ? "Aucun patient ne correspond à cette recherche" 
                : filteredPatients.length === 0 
                  ? "Aucun patient enregistré" 
                  : `Total: ${filteredPatients.length} patient${filteredPatients.length > 1 ? "s" : ""}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-[#2980BA]" />
              <span className="ml-3 text-lg text-[#334349]">Chargement des patients...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-10 text-[#334349]">
              {searchTerm ? (
                <div>
                  <p>Aucun patient ne correspond à votre recherche.</p>
                  <p className="text-[#619DB5] text-sm mt-1">Essayez d'autres termes ou effacez la recherche.</p>
                </div>
              ) : (
                <div>
                  <p>Aucun patient n'est enregistré.</p>
                  <Button 
                    variant="outline" 
                    className="mt-3 border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20"
                    onClick={() => navigate("/dashboard/patients/new")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un patient
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-[#ECE7E3]">
                  <TableRow>
                    <TableHead className="w-[300px] text-[#334349]">Nom</TableHead>
                    <TableHead className="text-[#334349]">Genre / Âge</TableHead>
                    <TableHead className="text-[#334349]">Status</TableHead>
                    <TableHead className="text-[#334349]">Stade MRC</TableHead>
                    <TableHead className="text-[#334349]">Dernier examen</TableHead>
                    <TableHead className="text-right text-[#334349]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient._id} className="cursor-pointer hover:bg-[#ECE7E3]/20" onClick={() => handleViewPatient(patient._id)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-[#2980BA]/20 flex items-center justify-center text-[#2980BA] font-bold mr-2">
                            {patient.firstname[0]}{patient.lastname[0]}
                          </div>
                          <div>
                            <p className="text-[#021122]">{patient.firstname} {patient.lastname}</p>
                            <p className="text-xs text-[#619DB5]">
                              {patient.phoneNumber || "Pas de téléphone"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#334349]">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 border-[#91BDC8]">
                            {patient.gender === "male" ? "H" : patient.gender === "female" ? "F" : "A"}
                          </Badge>
                          {calculateAge(patient.birth_date)} ans
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          patient.patient_status === PatientStatus.STABLE ? "outline" : 
                          patient.patient_status === PatientStatus.MONITORING ? "default" : 
                          patient.patient_status === PatientStatus.CRITICAL ? "destructive" : "outline"
                        } className={
                          patient.patient_status === PatientStatus.STABLE 
                            ? "border-[#91BDC8] text-[#334349]" 
                            : patient.patient_status === PatientStatus.MONITORING 
                            ? "bg-[#2980BA] text-white hover:bg-[#619DB5]"
                            : ""
                        }>
                          {patient.patient_status === PatientStatus.STABLE ? "Stable" : 
                           patient.patient_status === PatientStatus.MONITORING ? "Surveillance" : 
                           patient.patient_status === PatientStatus.CRITICAL ? "Critique" : "Stable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          patient.mrc_status === MRCStage.STAGE_1 || patient.mrc_status === MRCStage.STAGE_2 ? "outline" : 
                          patient.mrc_status === MRCStage.STAGE_3A || patient.mrc_status === MRCStage.STAGE_3B ? "secondary" : 
                          "destructive"
                        } className={
                          (patient.mrc_status === MRCStage.STAGE_1 || patient.mrc_status === MRCStage.STAGE_2) 
                            ? "border-[#91BDC8] text-[#334349]" 
                            : (patient.mrc_status === MRCStage.STAGE_3A || patient.mrc_status === MRCStage.STAGE_3B)
                            ? "bg-[#619DB5]/20 text-[#2980BA] border-[#91BDC8]"
                            : ""
                        }>
                          Stade {patient.mrc_status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#619DB5]">Non renseigné</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild onClick={(e) => {
                                e.stopPropagation();
                                handleViewPatient(patient._id);
                              }}>
                                <Button variant="ghost" size="icon" className="text-[#2980BA] hover:bg-[#ECE7E3]/20 hover:text-[#619DB5]">
                                  <User className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Voir le profil</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="text-[#334349] hover:bg-[#ECE7E3]/20 hover:text-[#2980BA]">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-[#91BDC8]">
                              <DropdownMenuLabel className="text-[#334349]">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-[#91BDC8]/50" />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewPatient(patient._id);
                              }} className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]">
                                <User className="mr-2 h-4 w-4 text-[#2980BA]" />
                                Voir le profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]">
                                <FileText className="mr-2 h-4 w-4 text-[#2980BA]" />
                                Ajouter une note
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]">
                                <Calendar className="mr-2 h-4 w-4 text-[#2980BA]" />
                                Programmer un RDV
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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

export default PatientsList;