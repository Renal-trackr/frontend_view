import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, ChevronRight, Filter, ArrowUpDown, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PatientStatus, MRCStage } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Status color mapping
const statusColors = {
  [PatientStatus.STABLE]: "bg-secondary-100 text-secondary-800",
  [PatientStatus.MONITORING]: "bg-warning-100 text-warning-800",
  [PatientStatus.CRITICAL]: "bg-danger-100 text-danger-800",
};

// Mock patient data
const patients = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Dupont",
    dateOfBirth: "12/05/1961",
    status: PatientStatus.CRITICAL,
    mrcStage: MRCStage.STAGE_4,
    lastVisit: "20/06/2023",
    nextAppointment: "27/06/2023",
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Martin",
    dateOfBirth: "23/09/1965",
    status: PatientStatus.MONITORING,
    mrcStage: MRCStage.STAGE_3B,
    lastVisit: "10/06/2023",
    nextAppointment: "03/07/2023",
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Dubois",
    dateOfBirth: "04/07/1953",
    status: PatientStatus.MONITORING,
    mrcStage: MRCStage.STAGE_3A,
    lastVisit: "22/06/2023",
    nextAppointment: "10/07/2023",
  },
  {
    id: "4",
    firstName: "Françoise",
    lastName: "Bernard",
    dateOfBirth: "30/11/1958",
    status: PatientStatus.STABLE,
    mrcStage: MRCStage.STAGE_2,
    lastVisit: "15/06/2023",
    nextAppointment: "15/07/2023",
  },
  {
    id: "5",
    firstName: "Pierre",
    lastName: "Leroy",
    dateOfBirth: "17/03/1970",
    status: PatientStatus.STABLE,
    mrcStage: MRCStage.STAGE_1,
    lastVisit: "05/06/2023",
    nextAppointment: "05/07/2023",
  },
  {
    id: "6",
    firstName: "Sophie",
    lastName: "Moreau",
    dateOfBirth: "09/12/1972",
    status: PatientStatus.MONITORING,
    mrcStage: MRCStage.STAGE_2,
    lastVisit: "18/06/2023",
    nextAppointment: "18/07/2023",
  },
  {
    id: "7",
    firstName: "Michel",
    lastName: "Petit",
    dateOfBirth: "22/08/1955",
    status: PatientStatus.CRITICAL,
    mrcStage: MRCStage.STAGE_5,
    lastVisit: "25/06/2023",
    nextAppointment: "28/06/2023",
  },
];

// Ajout de données supplémentaires aux patients
const enhancedPatients = patients.map(patient => ({
  ...patient,
  adherence: Math.floor(Math.random() * 40 + 60), // 60-100%
  lastMeasurements: {
    creatinine: (Math.random() * 1.5 + 0.7).toFixed(1), // 0.7-2.2 mg/dL
    eGFR: Math.floor(Math.random() * 60 + 20), // 20-80 ml/min
    bloodPressure: `${Math.floor(Math.random() * 40 + 110)}/${Math.floor(Math.random() * 30 + 70)}`, // 110-150/70-100
  },
  riskScore: Math.floor(Math.random() * 100)
}));

const PatientsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fonction pour filtrer les patients
  const filterPatients = () => {
    let filtered = enhancedPatients.filter(patient => {
      const nameMatch = (patient.firstName + " " + patient.lastName).toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "all" ? true : patient.status === statusFilter;
      const stageMatch = stageFilter === "all" ? true : patient.mrcStage === stageFilter;
      
      // Filtrage par tab
      const tabMatch = 
        activeTab === "all" ? true :
        activeTab === "high-risk" ? patient.riskScore >= 70 :
        activeTab === "monitoring" ? patient.status === PatientStatus.MONITORING :
        activeTab === "stable" ? patient.status === PatientStatus.STABLE :
        true;
      
      return nameMatch && statusMatch && stageMatch && tabMatch;
    });

    // Tri des patients
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "name") {
        comparison = (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName);
      } else if (sortField === "stage") {
        comparison = a.mrcStage.localeCompare(b.mrcStage);
      } else if (sortField === "risk") {
        comparison = a.riskScore - b.riskScore;
      } else if (sortField === "lastVisit") {
        const dateA = new Date(a.lastVisit.split('/').reverse().join('-'));
        const dateB = new Date(b.lastVisit.split('/').reverse().join('-'));
        comparison = dateA.getTime() - dateB.getTime();
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredPatients = filterPatients();

  // Fonction pour changer le tri
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => navigate('/patients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau patient
          </Button>
        </div>
      </div>

      {/* Tabs section */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Tous les patients</TabsTrigger>
            <TabsTrigger value="high-risk" className="relative">
              À risque élevé
              <Badge variant="destructive" className="ml-2">8</Badge>
            </TabsTrigger>
            <TabsTrigger value="monitoring">En surveillance</TabsTrigger>
            <TabsTrigger value="stable">Stables</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Liste des patients ({filteredPatients.length})</CardTitle>
                  <CardDescription>Gérer et suivre tous vos patients</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                  <Filter className="mr-2 h-4 w-4" />
                  {showAdvancedFilters ? "Masquer les filtres" : "Filtres avancés"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute top-1/2 transform -translate-y-1/2 left-3 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Rechercher par nom, ID..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 ml-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value={PatientStatus.STABLE}>Stable</SelectItem>
                      <SelectItem value={PatientStatus.MONITORING}>Surveillance</SelectItem>
                      <SelectItem value={PatientStatus.CRITICAL}>Critique</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Stade MRC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les stades</SelectItem>
                      <SelectItem value={MRCStage.STAGE_1}>Stade 1</SelectItem>
                      <SelectItem value={MRCStage.STAGE_2}>Stade 2</SelectItem>
                      <SelectItem value={MRCStage.STAGE_3A}>Stade 3A</SelectItem>
                      <SelectItem value={MRCStage.STAGE_3B}>Stade 3B</SelectItem>
                      <SelectItem value={MRCStage.STAGE_4}>Stade 4</SelectItem>
                      <SelectItem value={MRCStage.STAGE_5}>Stade 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced filters */}
              {showAdvancedFilters && (
                <div className="bg-secondary-50 p-4 rounded-lg mb-6 border border-secondary-200">
                  <h4 className="font-medium mb-3">Filtres avancés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Traitement</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox id="treatment-1" />
                          <label htmlFor="treatment-1" className="ml-2 text-sm">Dialyse</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="treatment-2" />
                          <label htmlFor="treatment-2" className="ml-2 text-sm">Médicaments</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Age</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Min" type="number" className="text-sm" />
                        <Input placeholder="Max" type="number" className="text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Dernière visite</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="date" className="text-sm" />
                        <Input type="date" className="text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" className="mr-2">Réinitialiser</Button>
                    <Button size="sm">Appliquer</Button>
                  </div>
                </div>
              )}

              {/* Patients table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-medium p-2">
                        <Button variant="ghost" className="flex items-center p-1 h-auto font-medium" onClick={() => handleSort("name")}>
                          Patient
                          {sortField === "name" && (
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          )}
                        </Button>
                      </th>
                      <th className="text-left font-medium p-2">Âge</th>
                      <th className="text-left font-medium p-2">
                        <Button variant="ghost" className="flex items-center p-1 h-auto font-medium" onClick={() => handleSort("stage")}>
                          Stade MRC
                          {sortField === "stage" && (
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          )}
                        </Button>
                      </th>
                      <th className="text-left font-medium p-2">Statut</th>
                      <th className="text-left font-medium p-2">Dernières mesures</th>
                      <th className="text-left font-medium p-2">
                        <Button variant="ghost" className="flex items-center p-1 h-auto font-medium" onClick={() => handleSort("lastVisit")}>
                          Dernière visite
                          {sortField === "lastVisit" && (
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          )}
                        </Button>
                      </th>
                      <th className="text-left font-medium p-2">
                        <Button variant="ghost" className="flex items-center p-1 h-auto font-medium" onClick={() => handleSort("risk")}>
                          Risque
                          {sortField === "risk" && (
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          )}
                        </Button>
                      </th>
                      <th className="text-left font-medium p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(patient => {
                      // Calculer l'âge à partir de la date de naissance
                      const birthDate = new Date(patient.dateOfBirth.split('/').reverse().join('-'));
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }

                      return (
                        <tr key={patient.id} className="hover:bg-secondary-50 border-b">
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                <span className="font-medium text-primary-700">{patient.firstName[0]}{patient.lastName[0]}</span>
                              </div>
                              <div>
                                <a href={`/patients/${patient.id}`} className="font-medium hover:text-primary-600">
                                  {patient.firstName} {patient.lastName}
                                </a>
                                <p className="text-xs text-gray-500">ID: {patient.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">{age} ans</td>
                          <td className="p-2">
                            <Badge variant={
                              patient.mrcStage === MRCStage.STAGE_1 || patient.mrcStage === MRCStage.STAGE_2 ? "outline" :
                              patient.mrcStage === MRCStage.STAGE_3A || patient.mrcStage === MRCStage.STAGE_3B ? "secondary" :
                              "destructive"
                            }>
                              Stade {patient.mrcStage}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                              {patient.status === PatientStatus.STABLE ? "Stable" : 
                               patient.status === PatientStatus.MONITORING ? "Surveillance" : "Critique"}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Créatinine:</span>
                                <span className={patient.lastMeasurements.creatinine > 1.4 ? "text-danger-600 font-medium" : ""}>
                                  {patient.lastMeasurements.creatinine} mg/dL
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>DFG:</span>
                                <span className={patient.lastMeasurements.eGFR < 40 ? "text-danger-600 font-medium" : ""}>
                                  {patient.lastMeasurements.eGFR} mL/min
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>TA:</span>
                                <span>{patient.lastMeasurements.bloodPressure} mmHg</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">{patient.lastVisit}</td>
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="w-full bg-secondary-100 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    patient.riskScore < 40 ? "bg-success-500" :
                                    patient.riskScore < 70 ? "bg-warning-500" : "bg-danger-500"
                                  }`}
                                  style={{ width: `${patient.riskScore}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{patient.riskScore}%</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <a 
                              href={`/patients/${patient.id}`}
                              className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white py-1 px-3 rounded-md text-sm"
                            >
                              Voir le dossier
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredPatients.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-gray-500">
                          Aucun patient ne correspond à vos critères
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="high-risk" className="mt-4">
          {/* Contenu similaire pour les patients à risque */}
        </TabsContent>
        
        <TabsContent value="monitoring" className="mt-4">
          {/* Contenu similaire pour les patients en surveillance */}
        </TabsContent>
        
        <TabsContent value="stable" className="mt-4">
          {/* Contenu similaire pour les patients stables */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientsList;