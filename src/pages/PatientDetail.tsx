import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Heart, 
  Mail, 
  MapPin, 
  Phone, 
  Pill, 
  Plus, 
  User, 
  AlertTriangle,
  Brain,
  TrendingUp,
  TrendingDown,
  Microscope,
  Loader2,
  Check,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Legend,
  ReferenceLine
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PatientStatus, MRCStage } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import { useToast } from "@/components/ui/use-toast";
import PatientService from "@/services/PatientService";
import MedicalHistoryForm from "@/components/patient/MedicalHistoryForm";
import AntecedentForm from "@/components/patient/AntecedentForm";
import WorkflowService, { Workflow, WorkflowStatus } from "@/services/WorkflowService";
import WorkflowList from "@/components/workflow/WorkflowList";

// Niveaux de DFG et leurs significations
const gfrLevels = [
  { stage: "1", min: 90, max: 120, color: "#4ade80", label: "Normale ou élevée" },
  { stage: "2", min: 60, max: 89, color: "#a3e635", label: "Légèrement diminuée" },
  { stage: "3A", min: 45, max: 59, color: "#facc15", label: "Légèrement à modérément diminuée" },
  { stage: "3B", min: 30, max: 44, color: "#fb923c", label: "Modérément à sévèrement diminuée" },
  { stage: "4", min: 15, max: 29, color: "#f87171", label: "Sévèrement diminuée" },
  { stage: "5", min: 0, max: 14, color: "#ef4444", label: "Insuffisance rénale" }
];

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [chartData, setChartData] = useState([]);
  const [latestResults, setLatestResults] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState({
    patientId: id || "",
  });

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [antecedents, setAntecedents] = useState([]);
  const [showMedicalHistoryForm, setShowMedicalHistoryForm] = useState(false);
  const [showAntecedentForm, setShowAntecedentForm] = useState(false);
  const [editingMedicalItem, setEditingMedicalItem] = useState(null);
  const [editingAntecedent, setEditingAntecedent] = useState(null);

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflowsLoading, setWorkflowsLoading] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!id) {
          setError('ID patient manquant');
          return;
        }
        
        // Appel API pour récupérer les données du patient
        const patientData = await PatientService.getPatientById(id);
        
        if (!patientData) {
          setError(`Patient avec l'ID ${id} non trouvé`);
          return;
        }
        
        setPatient(patientData);
        setMedicalHistory(patientData.medical_history || []);
        setAntecedents(patientData.antecedents || []);
        
        // Dans une application réelle, d'autres appels API seraient faits ici
        // pour récupérer l'historique des analyses, les résultats récents, etc.
        
        // Pour l'instant, utilisons des données vides ou minimales pour ces éléments
        setChartData([]);
        setLatestResults(null);
        
      } catch (err) {
        console.error("Erreur lors de la récupération des données patient:", err);
        setError(err.message || "Impossible de récupérer les données du patient");
        toast({
          title: "Erreur",
          description: err.message || "Impossible de récupérer les données du patient",
          variant: "destructive"
        });
        
        // Redirection vers la liste après délai en cas d'erreur
        setTimeout(() => navigate('/dashboard/patients'), 2000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [id, navigate, toast]);

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!id) return;
      
      try {
        setWorkflowsLoading(true);
        const workflowsData = await WorkflowService.getWorkflowsByPatient(id);
        setWorkflows(workflowsData);
      } catch (error) {
        console.error("Error fetching workflows:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les workflows du patient",
          variant: "destructive"
        });
      } finally {
        setWorkflowsLoading(false);
      }
    };
    
    if (patient) {
      fetchWorkflows();
    }
  }, [id, patient]);

  const handleAppointmentSubmit = (appointmentData) => {
    // Logique pour enregistrer le RDV à implémenter avec l'API
    console.log("Nouveau rendez-vous créé:", appointmentData);
    
    toast({
      title: "Rendez-vous programmé",
      description: `Rendez-vous programmé pour ${patient?.firstname} ${patient?.lastname} le ${appointmentData.date} à ${appointmentData.time}.`,
    });
    
    setShowAppointmentDialog(false);
  };

  // Handle medical history operations
  const handleAddMedicalHistory = async (historyItem) => {
    try {
      const result = await PatientService.addMedicalHistory(id, historyItem);
      
      // Update the medical history state
      setMedicalHistory(result.medical_history || []);
      
      toast({
        title: "Succès",
        description: "Élément ajouté à l'historique médical",
      });
      
      setShowMedicalHistoryForm(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'ajout à l'historique médical",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMedicalHistory = async (historyItem) => {
    try {
      if (!editingMedicalItem || !editingMedicalItem.id) return;
      
      const result = await PatientService.updateMedicalHistoryItem(
        id, 
        editingMedicalItem.id, 
        historyItem
      );
      
      // Update the medical history state
      setMedicalHistory(result.medical_history || []);
      
      toast({
        title: "Succès",
        description: "Historique médical mis à jour",
      });
      
      setEditingMedicalItem(null);
      setShowMedicalHistoryForm(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la mise à jour de l'historique médical",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMedicalHistory = async (historyId) => {
    try {
      const result = await PatientService.deleteMedicalHistoryItem(id, historyId);
      
      // Update the medical history state
      setMedicalHistory(result.medical_history || []);
      
      toast({
        title: "Succès",
        description: "Élément supprimé de l'historique médical",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la suppression de l'élément",
        variant: "destructive"
      });
    }
  };

  // Handle antecedent operations
  const handleAddAntecedent = async (antecedent) => {
    try {
      const result = await PatientService.addAntecedent(id, antecedent);
      
      // Update the antecedents state
      setAntecedents(result.antecedents || []);
      
      toast({
        title: "Succès",
        description: "Antécédent ajouté avec succès",
      });
      
      setShowAntecedentForm(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'ajout de l'antécédent",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAntecedent = async (antecedent) => {
    try {
      if (!editingAntecedent || !editingAntecedent.id) return;
      
      const result = await PatientService.updateAntecedentItem(
        id, 
        editingAntecedent.id, 
        antecedent
      );
      
      // Update the antecedents state
      setAntecedents(result.antecedents || []);
      
      toast({
        title: "Succès",
        description: "Antécédent mis à jour",
      });
      
      setEditingAntecedent(null);
      setShowAntecedentForm(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la mise à jour de l'antécédent",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAntecedent = async (antecedentId) => {
    try {
      const result = await PatientService.deleteAntecedentItem(id, antecedentId);
      
      // Update the antecedents state
      setAntecedents(result.antecedents || []);
      
      toast({
        title: "Succès",
        description: "Antécédent supprimé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la suppression de l'antécédent",
        variant: "destructive"
      });
    }
  };

  // Common functions
  const startEditingMedicalHistory = (item) => {
    setEditingMedicalItem(item);
    setShowMedicalHistoryForm(true);
  };

  const startEditingAntecedent = (item) => {
    setEditingAntecedent(item);
    setShowAntecedentForm(true);
  };

  const cancelMedicalHistoryForm = () => {
    setEditingMedicalItem(null);
    setShowMedicalHistoryForm(false);
  };

  const cancelAntecedentForm = () => {
    setEditingAntecedent(null);
    setShowAntecedentForm(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="mb-4">{error}</p>
          <p>Redirection vers la liste des patients...</p>
        </div>
      </div>
    );
  }

  if (loading || !patient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p>Chargement des données patient...</p>
        </div>
      </div>
    );
  }

  // Calculer l'âge du patient
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
      console.error("Erreur de calcul d'âge:", e);
      return "N/A";
    }
  };

  // Format date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (e) {
      return dateString; // Retourne la chaîne telle quelle en cas d'erreur
    }
  };

  const renderHistoryTab = () => (
    <TabsContent value="history" className="mt-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Medical History Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Affections chroniques</CardTitle>
              <Button 
                size="sm" 
                onClick={() => {
                  setEditingMedicalItem(null);
                  setShowMedicalHistoryForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showMedicalHistoryForm ? (
              <MedicalHistoryForm
                initialData={editingMedicalItem || { name: "", date: "", description: "" }}
                onSubmit={editingMedicalItem ? handleUpdateMedicalHistory : handleAddMedicalHistory}
                onCancel={cancelMedicalHistoryForm}
                isEditing={!!editingMedicalItem}
              />
            ) : medicalHistory.length === 0 ? (
              <p className="text-gray-500">Aucune affection chronique enregistrée</p>
            ) : (
              <div className="space-y-4">
                {medicalHistory.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      {item.date && (
                        <p className="text-sm text-gray-500">
                          Diagnostiqué le: {new Date(item.date).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => startEditingMedicalHistory(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMedicalHistory(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Antecedents/Allergies Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Allergies</CardTitle>
              <Button 
                size="sm" 
                onClick={() => {
                  setEditingAntecedent(null);
                  setShowAntecedentForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAntecedentForm ? (
              <AntecedentForm
                initialData={editingAntecedent || { name: "", date: "", description: "" }}
                onSubmit={editingAntecedent ? handleUpdateAntecedent : handleAddAntecedent}
                onCancel={cancelAntecedentForm}
                isEditing={!!editingAntecedent}
              />
            ) : antecedents.length === 0 ? (
              <p className="text-gray-500">Aucune allergie connue</p>
            ) : (
              <div className="space-y-4">
                {antecedents.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 border rounded-md bg-red-50">
                    <div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        <h4 className="font-medium">{item.name}</h4>
                      </div>
                      {item.date && (
                        <p className="text-sm text-gray-500">
                          Découvert le: {new Date(item.date).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => startEditingAntecedent(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAntecedent(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec informations patient */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard/patients')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold mr-4">
              {patient.firstname?.[0]}{patient.lastname?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patient.firstname} {patient.lastname}</h1>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span>{calculateAge(patient.birth_date)} ans</span>
                <span className="mx-2">•</span>
                <span>{patient.gender === 'male' ? 'Homme' : patient.gender === 'female' ? 'Femme' : 'Autre'}</span>
                <span className="mx-2">•</span>
                <span>ID: {patient._id}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant={
            patient.mrc_status === MRCStage.STAGE_1 || patient.mrc_status === MRCStage.STAGE_2 ? "outline" :
            patient.mrc_status === MRCStage.STAGE_3A || patient.mrc_status === MRCStage.STAGE_3B ? "secondary" :
            "destructive"
          } className="text-sm">
            MRC Stade {patient.mrc_status || "N/A"}
          </Badge>
          
          <Button variant="outline" size="sm" onClick={() => setShowAppointmentDialog(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Planifier un RDV
          </Button>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une note
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:bg-transparent"
          >
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:bg-transparent"
          >
            Résultats d'analyses
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:bg-transparent"
          >
            Historique médical
          </TabsTrigger>
          <TabsTrigger 
            value="treatment" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:bg-transparent"
          >
            Traitement
          </TabsTrigger>
          <TabsTrigger 
            value="workflows" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:bg-transparent"
          >
            Workflows
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:bg-transparent"
          >
            Notes
          </TabsTrigger>
        </TabsList>
        
        {/* Contenu de l'onglet Vue d'ensemble */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm">{patient.phoneNumber || "Non renseigné"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{patient.email || "Non renseigné"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Adresse</p>
                    <p className="text-sm">{patient.address || "Non renseignée"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Prochain rendez-vous</p>
                    <p className="text-sm">Non planifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Derniers résultats */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Derniers résultats clés</CardTitle>
                <CardDescription>
                  Aucune analyse récente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-8">
                  <p className="text-gray-500">Aucun résultat d'analyse disponible pour ce patient.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Évolution du DFG */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution du DFG</CardTitle>
                <CardDescription>Tendance</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Aucune donnée d'évolution disponible.</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations cliniques</CardTitle>
                <CardDescription>Basées sur les derniers résultats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-secondary-50">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full mr-3 bg-secondary-100 text-secondary-600">
                        <Brain className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-sm">Surveillance régulière de la fonction rénale</h4>
                          <Badge variant="outline" className="ml-2 text-xs">Priorité</Badge>
                        </div>
                        <p className="text-xs mt-1 text-gray-500">Programmez une analyse complète de la fonction rénale avec un suivi régulier.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Contenu de l'onglet Résultats d'analyses */}
        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des analyses</CardTitle>
              <CardDescription>
                Tendances et évolution des marqueurs biologiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Aucun résultat d'analyse disponible pour ce patient.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History tab - replace with the new implementation */}
        {renderHistoryTab()}
        
        {/* Contenu des autres onglets (treatment, workflows, notes) */}
        <TabsContent value="treatment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Médicaments actuels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Aucun médicament enregistré</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un médicament
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflows" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Workflows assignés</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Assigner un workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Aucun workflow assigné</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notes cliniques</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Aucune note disponible</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog de prise de rendez-vous */}
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Programmer un rendez-vous</DialogTitle>
            <DialogDescription>
              Programmez un nouveau rendez-vous pour {patient.firstname} {patient.lastname}
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            initialAppointment={appointmentFormData}
            selectedPatientId={id}
            onSubmit={handleAppointmentSubmit}
            onCancel={() => setShowAppointmentDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDetail;
