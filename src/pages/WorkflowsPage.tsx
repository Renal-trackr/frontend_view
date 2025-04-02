import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Loader2,
  User,
  Users,
  AlertCircle,
  Calendar,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  Filter,
  LayoutList,
  Beaker,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import WorkflowService, { Workflow, WorkflowStatus } from "@/services/WorkflowService";
import PatientService from "@/services/PatientService";
import WorkflowForm from "@/components/workflow/WorkflowForm";
import SimplifiedWorkflowForm from "@/components/workflow/SimplifiedWorkflowForm";
import { Checkbox } from "@/components/ui/checkbox";

const WorkflowsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);

  const [workflowType, setWorkflowType] = useState<'template' | 'patient'>('patient');
  const [criteriaFilter, setCriteriaFilter] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [showCriteria, setShowCriteria] = useState(false);
  const [workflowCreationMode, setWorkflowCreationMode] = useState<'standard' | 'simplified'>('standard');

  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

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

  // Load workflows and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all workflows
        const workflowsData = await WorkflowService.getWorkflows();
        setWorkflows(workflowsData);
        setFilteredWorkflows(workflowsData);

        // Fetch all patients for references
        const patientsData = await PatientService.getPatients();
        setPatients(patientsData);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Impossible de récupérer les données des workflows");
        toast({
          title: "Erreur",
          description: err.message || "Impossible de récupérer les données",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter workflows when search term or status filter changes
  useEffect(() => {
    let filtered = workflows;

    // Filter by status if not "all"
    if (statusFilter !== "all") {
      filtered = filtered.filter((workflow) => workflow.status === statusFilter);
    }

    // Filter by search term if present
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(lowercasedSearch) ||
          workflow.description.toLowerCase().includes(lowercasedSearch) ||
          getPatientName(workflow.patient_id).toLowerCase().includes(lowercasedSearch) ||
          (workflow.patients_ids && workflow.patients_ids.some(patientId => 
            getPatientName(patientId).toLowerCase().includes(lowercasedSearch)
          )) ||
          (workflow.patient_ids && workflow.patient_ids.some(patientId => 
            getPatientName(patientId).toLowerCase().includes(lowercasedSearch)
          ))
      );
    }

    // Dédupliquer les workflows - garantir que chaque workflow n'apparaît qu'une fois
    const uniqueWorkflows = [];
    const seenIds = new Set();
    
    filtered.forEach(workflow => {
      if (!seenIds.has(workflow._id)) {
        seenIds.add(workflow._id);
        uniqueWorkflows.push(workflow);
      }
    });

    setFilteredWorkflows(uniqueWorkflows);
  }, [searchTerm, statusFilter, workflows]);

  // Filter patients by criteria
  const filterPatientsByCriteria = (criteria: string) => {
    if (criteria === 'all') {
      setFilteredPatients(patients);
    } else if (criteria.startsWith('stage_')) {
      const stage = criteria.replace('stage_', '');
      const filtered = patients.filter(patient => patient.mrc_status === stage);
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  // Get patient name from ID
  const getPatientName = (patientId: string) => {
    if (!patientId) return "Patient inconnu";
    
    const patient = patients.find((p) => p._id === patientId);
    return patient
      ? `${patient.firstname} ${patient.lastname}`
      : "Patient inconnu";
  };

  // Get patient IDs from workflow
  const getPatientIDs = (workflow: Workflow): string[] => {
    if (workflow.patients_ids && workflow.patients_ids.length > 0) {
      return workflow.patients_ids;
    } else if (workflow.patient_ids && workflow.patient_ids.length > 0) {
      return workflow.patient_ids;
    } else if (workflow.patient_id) {
      return [workflow.patient_id];
    }
    return [];
  };

  // Workflow actions
  const handleCreateWorkflow = async (workflowData: Workflow) => {
    try {
      if (workflowType === 'template' && selectedPatients.length > 0) {
        // Créer un workflow avec plusieurs patients
        const result = await WorkflowService.createWorkflow({
          ...workflowData,
          patients_ids: selectedPatients,
          is_template: true
        });

        toast({
          title: "Succès",
          description: `Le workflow a été assigné à ${selectedPatients.length} patient(s)`,
        });
      } else {
        // Pour un seul patient
        const result = await WorkflowService.createWorkflow({
          ...workflowData,
          patients_ids: [workflowData.patient_id],
          is_template: false
        });

        toast({
          title: "Succès",
          description: "Le workflow a été créé avec succès",
        });
      }

      const updatedWorkflows = await WorkflowService.getWorkflows();
      setWorkflows(updatedWorkflows);

      setShowCreateForm(false);
      setSelectedPatientId(null);
      setSelectedPatients([]);
      setWorkflowType('patient');
    } catch (err: any) {
      console.error("Error creating workflow:", err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer le workflow",
        variant: "destructive",
      });
    }
  };

  const handleCreateTestBasedWorkflow = async (workflowData) => {
    try {
      await WorkflowService.createTestBasedWorkflow(workflowData);

      toast({
        title: "Succès",
        description: "Le workflow simplifié a été créé avec succès",
      });

      const updatedWorkflows = await WorkflowService.getWorkflows();
      setWorkflows(updatedWorkflows);

      setShowCreateForm(false);
      setSelectedPatientId(null);
    } catch (err) {
      console.error("Error creating simplified workflow:", err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer le workflow simplifié",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWorkflow = async (id: string, data: Partial<Workflow>) => {
    try {
      await WorkflowService.updateWorkflow(id, data);

      const updatedWorkflows = await WorkflowService.getWorkflows();
      setWorkflows(updatedWorkflows);

      toast({
        title: "Succès",
        description: "Le workflow a été mis à jour avec succès",
      });

      setShowEditForm(false);
      setEditingWorkflow(null);
    } catch (err: any) {
      console.error("Error updating workflow:", err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour le workflow",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: WorkflowStatus) => {
    try {
      await WorkflowService.updateWorkflowStatus(id, status);

      setWorkflows((prevWorkflows) =>
        prevWorkflows.map((workflow) =>
          workflow._id === id ? { ...workflow, status } : workflow
        )
      );

      toast({
        title: "Succès",
        description: `Le statut du workflow a été mis à jour à "${
          status === WorkflowStatus.ACTIVE
            ? "Actif"
            : status === WorkflowStatus.PAUSED
            ? "En pause"
            : "Terminé"
        }"`,
      });
    } catch (err: any) {
      console.error("Error updating workflow status:", err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      await WorkflowService.deleteWorkflow(id);

      setWorkflows((prevWorkflows) =>
        prevWorkflows.filter((workflow) => workflow._id !== id)
      );

      toast({
        title: "Succès",
        description: "Le workflow a été supprimé avec succès",
      });

      setDeleteConfirmOpen(false);
      setWorkflowToDelete(null);
    } catch (err: any) {
      console.error("Error deleting workflow:", err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de supprimer le workflow",
        variant: "destructive",
      });
    }
  };

  const toggleSelectAllPatients = (select: boolean) => {
    if (select) {
      setSelectedPatients(filteredPatients.map((p) => p._id));
    } else {
      setSelectedPatients([]);
    }
  };

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/patients/${patientId}`);
  };

  const handleEditClick = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setShowEditForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setWorkflowToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const startCreateWorkflow = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowCreateForm(true);
  };

  const handleViewWorkflowDetails = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowDetails(true);
  };

  const getStatusBadge = (status: WorkflowStatus) => {
    switch (status) {
      case WorkflowStatus.ACTIVE:
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Actif
          </Badge>
        );
      case WorkflowStatus.PAUSED:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            En pause
          </Badge>
        );
      case WorkflowStatus.COMPLETED:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau workflow
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un workflow..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center border rounded-md pl-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-0 w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value={WorkflowStatus.ACTIVE}>Actifs</SelectItem>
              <SelectItem value={WorkflowStatus.PAUSED}>En pause</SelectItem>
              <SelectItem value={WorkflowStatus.COMPLETED}>Terminés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Card className="bg-destructive/10 text-destructive">
          <CardContent className="p-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des workflows</CardTitle>
          <CardDescription>
            {loading
              ? "Chargement des workflows..."
              : filteredWorkflows.length === 0
              ? "Aucun workflow ne correspond à vos critères"
              : `Total: ${filteredWorkflows.length} workflow${
                  filteredWorkflows.length > 1 ? "s" : ""
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <span className="ml-3 text-lg">Chargement des workflows...</span>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="text-center py-10">
              <p>Aucun workflow trouvé.</p>
              {searchTerm || statusFilter !== "all" ? (
                <p className="text-gray-500 text-sm mt-1">
                  Essayez de modifier vos filtres.
                </p>
              ) : (
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => setShowCreateForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Créer un workflow
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Étapes</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkflows.map((workflow) => (
                    <TableRow
                      key={workflow._id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewWorkflowDetails(workflow)}
                    >
                      <TableCell className="font-medium">
                        {workflow.name}
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {workflow.description}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                      <TableCell>
                        {(() => {
                          const patientIds = getPatientIDs(workflow);
                          return patientIds.length > 0 ? (
                            <Badge variant="outline">
                              {patientIds.length} patient{patientIds.length > 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">Aucun</span>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        {workflow.steps?.length || 0} étape(s)
                      </TableCell>
                      <TableCell>
                        {workflow.updated_at
                          ? formatDistanceToNow(new Date(workflow.updated_at), {
                              addSuffix: true,
                              locale: fr,
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(workflow);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            {workflow.patient_ids && workflow.patient_ids.length > 0 && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  workflow.patient_ids && workflow.patient_ids[0] && 
                                  handleViewPatient(workflow.patient_ids[0]);
                                }}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Voir le patient
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau workflow</DialogTitle>
            <DialogDescription>
              Définissez les détails du workflow et ajoutez des étapes
            </DialogDescription>
          </DialogHeader>
          {showCreateForm && (
            <div className="py-4">
              {!selectedPatientId && !showCriteria ? (
                <div className="space-y-6">
                  {/* Workflow type selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className={`h-24 ${
                        workflowType === "patient"
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : ""
                      }`}
                      onClick={() => setWorkflowType("patient")}
                    >
                      <div className="flex flex-col items-center">
                        <User className="h-8 w-8 mb-2" />
                        <span>Workflow pour un patient spécifique</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-24 ${
                        workflowType === "template"
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : ""
                      }`}
                      onClick={() => setWorkflowType("template")}
                    >
                      <div className="flex flex-col items-center">
                        <Users className="h-8 w-8 mb-2" />
                        <span>Workflow par critères (stade MRC, etc.)</span>
                      </div>
                    </Button>
                  </div>

                  {/* Afficher les options de mode de création pour les deux types de workflow */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className={`h-16 ${
                        workflowCreationMode === "standard"
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : ""
                      }`}
                      onClick={() => setWorkflowCreationMode("standard")}
                    >
                      <div className="flex flex-col items-center">
                        <LayoutList className="h-5 w-5 mb-1" />
                        <span>Workflow standard</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className={`h-16 ${
                        workflowCreationMode === "simplified"
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : ""
                      }`}
                      onClick={() => setWorkflowCreationMode("simplified")}
                    >
                      <div className="flex flex-col items-center">
                        <Beaker className="h-5 w-5 mb-1" />
                        <span>Workflow basé sur test</span>
                      </div>
                    </Button>
                  </div>

                  {/* Patient selection section */}
                  {workflowType === "patient" ? (
                    <div className="space-y-4">
                      <Label>Sélectionnez un patient</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {patients.map((patient) => (
                          <Button
                            key={patient._id}
                            variant="outline"
                            className="flex justify-start items-center h-auto py-3 px-4"
                            onClick={() => startCreateWorkflow(patient._id)}
                          >
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                              {patient.firstname[0]}
                              {patient.lastname[0]}
                            </div>
                            <div className="text-left">
                              <p className="font-medium">
                                {patient.firstname} {patient.lastname}
                              </p>
                              <p className="text-xs text-gray-500">
                                Stade MRC: {patient.mrc_status || "N/A"}
                              </p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Filtrer les patients par critères</Label>
                        <Select
                          value={criteriaFilter}
                          onValueChange={(value) => {
                            setCriteriaFilter(value);
                            filterPatientsByCriteria(value);
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Sélectionner un critère" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les patients</SelectItem>
                            <SelectItem value="stage_1">Stade MRC 1</SelectItem>
                            <SelectItem value="stage_2">Stade MRC 2</SelectItem>
                            <SelectItem value="stage_3A">Stade MRC 3A</SelectItem>
                            <SelectItem value="stage_3B">Stade MRC 3B</SelectItem>
                            <SelectItem value="stage_4">Stade MRC 4</SelectItem>
                            <SelectItem value="stage_5">Stade MRC 5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-500">
                            {filteredPatients.length} patient(s) correspondent à
                            vos critères
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSelectAllPatients(true)}
                            >
                              Sélectionner tous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSelectAllPatients(false)}
                            >
                              Désélectionner tous
                            </Button>
                          </div>
                        </div>

                        <div className="max-h-[250px] overflow-y-auto pr-2 mt-3">
                          {filteredPatients.map((patient) => (
                            <div
                              key={patient._id}
                              className="flex items-center py-2 border-b last:border-b-0"
                            >
                              <Checkbox
                                checked={selectedPatients.includes(patient._id)}
                                onCheckedChange={() =>
                                  togglePatientSelection(patient._id)
                                }
                                className="mr-3"
                              />
                              <div className="flex items-center flex-1">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-2">
                                  {patient.firstname[0]}
                                  {patient.lastname[0]}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {patient.firstname} {patient.lastname}
                                  </p>
                                  <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <Badge variant="outline">
                                      Stade MRC {patient.mrc_status || "N/A"}
                                    </Badge>
                                    <span>
                                      {calculateAge(patient.birth_date)} ans
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        disabled={selectedPatients.length === 0}
                        onClick={() => setShowCriteria(true)}
                      >
                        Continuer avec {selectedPatients.length} patient(s)
                        sélectionné(s)
                      </Button>
                    </div>
                  )}
                </div>
              ) : showCriteria ? (
                workflowCreationMode === "standard" ? (
                  <WorkflowForm
                    patientId={selectedPatients[0]}
                    isTemplate={true}
                    selectedPatientsCount={selectedPatients.length}
                    onSubmit={handleCreateWorkflow}
                    onCancel={() => {
                      setShowCreateForm(false);
                      setShowCriteria(false);
                      setSelectedPatients([]);
                    }}
                  />
                ) : (
                  <SimplifiedWorkflowForm
                    patientId={selectedPatients[0]}
                    isTemplate={true}
                    selectedPatientsCount={selectedPatients.length}
                    onSubmit={handleCreateTestBasedWorkflow}
                    onCancel={() => {
                      setShowCreateForm(false);
                      setShowCriteria(false);
                      setSelectedPatients([]);
                    }}
                  />
                )
              ) : (
                workflowCreationMode === "standard" ? (
                  <WorkflowForm
                    patientId={selectedPatientId}
                    onSubmit={handleCreateWorkflow}
                    onCancel={() => {
                      setShowCreateForm(false);
                      setSelectedPatientId(null);
                    }}
                  />
                ) : (
                  <SimplifiedWorkflowForm
                    patientId={selectedPatientId}
                    onSubmit={handleCreateTestBasedWorkflow}
                    onCancel={() => {
                      setShowCreateForm(false);
                      setSelectedPatientId(null);
                    }}
                  />
                )
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Workflow Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifier le workflow</DialogTitle>
            <DialogDescription>
              Modifiez les détails du workflow ou les étapes
            </DialogDescription>
          </DialogHeader>
          {editingWorkflow && (
            <WorkflowForm
              patientId={editingWorkflow.patient_id}
              initialData={editingWorkflow}
              onSubmit={(data) =>
                handleUpdateWorkflow(editingWorkflow._id, data)
              }
              onCancel={() => {
                setShowEditForm(false);
                setEditingWorkflow(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce workflow ? Cette action ne
              peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkflowToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                workflowToDelete && handleDeleteWorkflow(workflowToDelete)
              }
              className="bg-destructive text-destructive-foreground"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Workflow Details Dialog */}
      <Dialog open={showWorkflowDetails} onOpenChange={setShowWorkflowDetails}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Détails du workflow</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le workflow et ses patients associés.
            </DialogDescription>
          </DialogHeader>
          {selectedWorkflow && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedWorkflow.name}</h2>
                    <p className="text-sm text-gray-500">{selectedWorkflow.description}</p>
                  </div>
                  <div>{getStatusBadge(selectedWorkflow.status)}</div>
                </div>
                
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>Créé le: {new Date(selectedWorkflow.created_at).toLocaleDateString('fr-FR')}</span>
                  {selectedWorkflow.updated_at && (
                    <span>• Mis à jour: {formatDistanceToNow(new Date(selectedWorkflow.updated_at), {
                      addSuffix: true,
                      locale: fr,
                    })}</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Patients assignés</h3>
                {(() => {
                  const patientIds = getPatientIDs(selectedWorkflow);
                  return patientIds.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {patientIds.filter(Boolean).map(patientId => (
                        <div key={patientId} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                              {getPatientName(patientId).split(' ').map(part => part[0]).join('')}
                            </div>
                            <span>{getPatientName(patientId)}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleViewPatient(patientId)}>
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun patient assigné</p>
                  );
                })()}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Étapes du workflow ({selectedWorkflow.steps?.length || 0})</h3>
                {selectedWorkflow.steps && selectedWorkflow.steps.length > 0 ? (
                  <div className="space-y-3">
                    {(selectedWorkflow.steps as WorkflowStep[]).map((step, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex items-center">
                          <div className="bg-primary-50 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm text-gray-500">{step.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune étape définie</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWorkflowDetails(false)}
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    setShowWorkflowDetails(false);
                    handleEditClick(selectedWorkflow);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowsPage;
