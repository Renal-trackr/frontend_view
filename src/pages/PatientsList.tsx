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

  // Format date in a French readable format
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
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <Button onClick={() => navigate("/dashboard/patients/new")}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau patient
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un patient..."
            className="pl-8"
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

      <Card>
        <CardHeader>
          <CardTitle>Liste des patients</CardTitle>
          <CardDescription>
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
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <span className="ml-3 text-lg">Chargement des patients...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              {searchTerm ? (
                <div>
                  <p>Aucun patient ne correspond à votre recherche.</p>
                  <p className="text-gray-500 text-sm mt-1">Essayez d'autres termes ou effacez la recherche.</p>
                </div>
              ) : (
                <div>
                  <p>Aucun patient n'est enregistré.</p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => navigate("/dashboard/patients/new")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un patient
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Nom</TableHead>
                    <TableHead>Genre / Âge</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stade MRC</TableHead>
                    <TableHead>Dernier examen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient._id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewPatient(patient._id)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-2">
                            {patient.firstname[0]}{patient.lastname[0]}
                          </div>
                          <div>
                            <p>{patient.firstname} {patient.lastname}</p>
                            <p className="text-xs text-gray-500">
                              {patient.phoneNumber || "Pas de téléphone"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {patient.gender === "male" ? "H" : patient.gender === "female" ? "F" : "A"}
                          </Badge>
                          {calculateAge(patient.birth_date)} ans
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          // Using the patient_status field if available, otherwise showing a default
                          patient.patient_status === PatientStatus.STABLE ? "outline" : 
                          patient.patient_status === PatientStatus.MONITORING ? "default" : 
                          patient.patient_status === PatientStatus.CRITICAL ? "destructive" : "outline"
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
                        }>
                          Stade {patient.mrc_status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* You would display the date of the last exam here, from your records collection */}
                        <span className="text-gray-500">Non renseigné</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild onClick={(e) => {
                                e.stopPropagation();
                                handleViewPatient(patient._id);
                              }}>
                                <Button variant="ghost" size="icon">
                                  <User className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Voir le profil</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewPatient(patient._id);
                              }}>
                                <User className="mr-2 h-4 w-4" />
                                Voir le profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <FileText className="mr-2 h-4 w-4" />
                                Ajouter une note
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Calendar className="mr-2 h-4 w-4" />
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