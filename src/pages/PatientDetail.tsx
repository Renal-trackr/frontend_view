import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  ChevronRight, 
  ClipboardList, 
  Clock, 
  FileText, 
  Heart, 
  History, 
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
  Microscope
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

// Données patient factices
const patients = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Dupont",
    dateOfBirth: "12/05/1961",
    gender: "male",
    phoneNumber: "01 23 45 67 89",
    email: "jean.dupont@example.com",
    address: "15 rue des Lilas, 75001 Paris",
    status: PatientStatus.CRITICAL,
    mrcStage: MRCStage.STAGE_4,
    created: "15/01/2020",
    lastVisit: "20/06/2023",
    nextAppointment: "27/06/2023",
    medicalHistory: {
      conditions: ["Hypertension", "Diabète de type 2", "Maladie rénale chronique"],
      allergies: ["Pénicilline"],
      surgeries: ["Appendicectomie (2005)"],
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "1 fois par jour" },
        { name: "Metformine", dosage: "500mg", frequency: "2 fois par jour" },
        { name: "Furosémide", dosage: "40mg", frequency: "1 fois par jour" },
        { name: "Statine", dosage: "20mg", frequency: "Le soir" }
      ]
    }
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Martin",
    dateOfBirth: "23/09/1965",
    gender: "female",
    phoneNumber: "01 98 76 54 32",
    email: "marie.martin@example.com",
    address: "27 avenue Victor Hugo, 75016 Paris",
    status: PatientStatus.MONITORING,
    mrcStage: MRCStage.STAGE_3B,
    created: "03/03/2019",
    lastVisit: "10/06/2023",
    nextAppointment: "03/07/2023",
    medicalHistory: {
      conditions: ["Glomérulonéphrite", "Hypertension"],
      allergies: ["Sulfamides"],
      surgeries: ["Cholécystectomie (2010)"],
      medications: [
        { name: "Amlodipine", dosage: "5mg", frequency: "1 fois par jour" },
        { name: "Losartan", dosage: "50mg", frequency: "1 fois par jour" },
        { name: "Calcitriol", dosage: "0.25μg", frequency: "1 fois par jour" }
      ]
    }
  }
];

// Résultats d'analyses pour chaque patient
const patientRecords = {
  "1": [
    {
      id: "rec1",
      patientId: "1",
      date: "20/06/2023",
      type: "Analyse sanguine",
      results: [
        { key: "crea", name: "Créatinine", value: 2.1, unit: "mg/dL", normalRange: { min: 0.7, max: 1.3 }, isNormal: false },
        { key: "uree", name: "Urée", value: 28, unit: "mmol/L", normalRange: { min: 2.5, max: 7.5 }, isNormal: false },
        { key: "egfr", name: "DFG estimé", value: 29, unit: "mL/min/1.73m²", normalRange: { min: 90, max: 120 }, isNormal: false },
        { key: "potassium", name: "Potassium", value: 5.1, unit: "mmol/L", normalRange: { min: 3.5, max: 5.0 }, isNormal: false },
        { key: "calcium", name: "Calcium", value: 2.1, unit: "mmol/L", normalRange: { min: 2.2, max: 2.6 }, isNormal: false },
        { key: "phosphore", name: "Phosphore", value: 1.6, unit: "mmol/L", normalRange: { min: 0.8, max: 1.5 }, isNormal: false },
        { key: "albumine", name: "Albumine", value: 38, unit: "g/L", normalRange: { min: 35, max: 50 }, isNormal: true },
        { key: "hb", name: "Hémoglobine", value: 10.5, unit: "g/dL", normalRange: { min: 13, max: 17 }, isNormal: false },
      ],
      notes: "Détérioration continue de la fonction rénale. Anémie légère.",
      doctor: "Dr. Richard"
    },
    {
      id: "rec2",
      patientId: "1",
      date: "15/05/2023",
      type: "Analyse sanguine",
      results: [
        { key: "crea", name: "Créatinine", value: 1.9, unit: "mg/dL", normalRange: { min: 0.7, max: 1.3 }, isNormal: false },
        { key: "uree", name: "Urée", value: 26, unit: "mmol/L", normalRange: { min: 2.5, max: 7.5 }, isNormal: false },
        { key: "egfr", name: "DFG estimé", value: 32, unit: "mL/min/1.73m²", normalRange: { min: 90, max: 120 }, isNormal: false },
        { key: "potassium", name: "Potassium", value: 4.8, unit: "mmol/L", normalRange: { min: 3.5, max: 5.0 }, isNormal: true },
        { key: "calcium", name: "Calcium", value: 2.2, unit: "mmol/L", normalRange: { min: 2.2, max: 2.6 }, isNormal: true },
        { key: "phosphore", name: "Phosphore", value: 1.4, unit: "mmol/L", normalRange: { min: 0.8, max: 1.5 }, isNormal: true },
        { key: "albumine", name: "Albumine", value: 39, unit: "g/L", normalRange: { min: 35, max: 50 }, isNormal: true },
        { key: "hb", name: "Hémoglobine", value: 11.2, unit: "g/dL", normalRange: { min: 13, max: 17 }, isNormal: false },
      ],
      notes: "Fonction rénale stable par rapport au mois dernier, mais toujours inquiétante.",
      doctor: "Dr. Richard"
    },
    // Additional records for patient 1...
    {
      id: "rec3",
      patientId: "1",
      date: "10/04/2023",
      type: "Analyse sanguine",
      results: [
        { key: "crea", name: "Créatinine", value: 1.8, unit: "mg/dL", normalRange: { min: 0.7, max: 1.3 }, isNormal: false },
        { key: "uree", name: "Urée", value: 24, unit: "mmol/L", normalRange: { min: 2.5, max: 7.5 }, isNormal: false },
        { key: "egfr", name: "DFG estimé", value: 35, unit: "mL/min/1.73m²", normalRange: { min: 90, max: 120 }, isNormal: false },
        // ...more results
      ],
      notes: "Légère détérioration de la fonction rénale depuis la dernière visite.",
      doctor: "Dr. Richard"
    },
    // ...more records
  ],
  "2": [
    // Data for Marie Martin
    {
      id: "rec7",
      patientId: "2",
      date: "10/06/2023",
      type: "Analyse sanguine",
      results: [
        { key: "crea", name: "Créatinine", value: 1.5, unit: "mg/dL", normalRange: { min: 0.6, max: 1.1 }, isNormal: false },
        { key: "uree", name: "Urée", value: 17, unit: "mmol/L", normalRange: { min: 2.5, max: 7.5 }, isNormal: false },
        { key: "egfr", name: "DFG estimé", value: 45, unit: "mL/min/1.73m²", normalRange: { min: 90, max: 120 }, isNormal: false },
        // ...more results
      ],
      notes: "Fonction rénale stable. Continuer le traitement actuel.",
      doctor: "Dr. Richard"
    }
  ]
};

// Recommandations spécifiques par patient
const patientRecommendations = {
  "1": [
    {
      id: 1,
      date: "22/06/2023",
      title: "Ajustement du traitement antihypertenseur",
      description: "Les valeurs de pression artérielle sont encore élevées malgré le traitement actuel. Envisager d'augmenter la dose de Lisinopril à 20mg par jour.",
      urgence: "high",
      confiance: 92,
      basedOn: ["Tension artérielle récurrente > 140/90", "Progression de la maladie rénale"]
    },
    {
      id: 2,
      date: "22/06/2023",
      title: "Surveillance de l'hyperkaliémie",
      description: "Le potassium sérique est à la limite supérieure de la normale. Envisager une surveillance plus fréquente et un ajustement diététique.",
      urgence: "medium",
      confiance: 85,
      basedOn: ["Potassium sérique à 5.1 mmol/L", "Utilisation d'IEC"]
    },
    // More recommendations for patient 1...
  ],
  "2": [
    {
      id: 5,
      date: "12/06/2023",
      title: "Optimisation du contrôle de la pression artérielle",
      description: "Maintenir une surveillance régulière de la pression artérielle. Objectif < 130/80 mmHg pour protéger la fonction rénale.",
      urgence: "low",
      confiance: 90,
      basedOn: ["MRC stade 3b", "Historique d'hypertension"]
    }
  ]
};

// Notes du médecin par patient
const patientNotes = {
  "1": [
    {
      id: "note1",
      date: "20/06/2023",
      title: "Consultation de suivi",
      content: "Patient se plaint de fatigue accrue et d'œdèmes aux chevilles. Ajustement du traitement diurétique. Discussion entamée sur les options de dialyse à moyen terme.",
      author: "Dr. Richard"
    },
    // More notes...
  ],
  "2": [
    {
      id: "note3",
      date: "10/06/2023",
      title: "Consultation de suivi",
      content: "Patiente se porte bien. Bonnes habitudes alimentaires maintenues. Continuer le traitement actuel.",
      author: "Dr. Richard"
    }
  ]
};

// Formatage des données pour les graphiques
const getPatientChartData = (patientId) => {
  if (!patientRecords[patientId]) return [];

  return patientRecords[patientId]
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    })
    .map(record => {
      const data = { date: record.date };
      record.results.forEach(result => {
        data[result.key] = result.value;
      });
      return data;
    });
};

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
  const [patient, setPatient] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState('');
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState({
    patientId: id || "",
  });

  console.log("PatientDetail rendering with ID:", id);

  useEffect(() => {
    if (id) {
      console.log("Looking for patient with ID:", id);
      // Récupérer les données du patient
      const foundPatient = patients.find(p => p.id === id);
      console.log("Found patient:", foundPatient);
      
      if (foundPatient) {
        setPatient(foundPatient);
        
        // Récupérer les données de graphique
        const chartData = getPatientChartData(id);
        setChartData(chartData);
        
        // Récupérer les recommandations
        setRecommendationsData(patientRecommendations[id] || []);
        
        // Récupérer les notes
        setNotesData(patientNotes[id] || []);
        
        // Récupérer les résultats d'analyses
        setRecords(patientRecords[id] || []);
      } else {
        // Patient non trouvé, rediriger vers la liste
        setError(`Patient with ID ${id} not found`);
        console.error(`Patient with ID ${id} not found`);
        setTimeout(() => navigate('/patients'), 2000);
      }
    }
  }, [id, navigate]);

  const handleAppointmentSubmit = (appointmentData) => {
    // Ici, vous implémenteriez la logique pour enregistrer le rendez-vous
    console.log("Nouveau rendez-vous créé:", appointmentData);
    
    toast({
      title: "Rendez-vous programmé",
      description: `Rendez-vous programmé pour ${patient.firstName} ${patient.lastName} le ${appointmentData.date} à ${appointmentData.time}.`,
    });
    
    setShowAppointmentDialog(false);
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

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Chargement des données patient...</p>
        </div>
      </div>
    );
  }

  // Calculer l'âge du patient
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth.split('/').reverse().join('-'));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Obtenir la dernière analyse
  const getLatestRecord = () => {
    if (records.length === 0) return null;
    return records.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    })[0];
  };

  const latestRecord = getLatestRecord();
  
  // Données de tendance pour les principaux marqueurs
  const getTrend = (key) => {
    if (chartData.length < 2) return { direction: "stable", percentage: 0 };
    
    const latest = chartData[chartData.length - 1][key];
    const previous = chartData[chartData.length - 2][key];
    
    if (!latest || !previous) return { direction: "stable", percentage: 0 };
    
    const change = ((latest - previous) / previous) * 100;
    let direction = "stable";
    
    if (change > 2) {
      direction = key === "egfr" ? "up" : "down"; // Pour le DFG, une augmentation est positive
    } else if (change < -2) {
      direction = key === "egfr" ? "down" : "up"; // Pour le DFG, une diminution est négative
    }
    
    return { direction, percentage: Math.abs(change).toFixed(1) };
  };

  // Tendances
  const créatinineTrend = getTrend("crea");
  const egfrTrend = getTrend("egfr");

  return (
    <div className="space-y-6">
      {/* En-tête avec informations patient */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold mr-4">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h1>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span>{calculateAge(patient.dateOfBirth)} ans</span>
                <span className="mx-2">•</span>
                <span>{patient.gender === 'male' ? 'Homme' : 'Femme'}</span>
                <span className="mx-2">•</span>
                <span>ID: {patient.id}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant={
            patient.mrcStage === MRCStage.STAGE_1 || patient.mrcStage === MRCStage.STAGE_2 ? "outline" :
            patient.mrcStage === MRCStage.STAGE_3A || patient.mrcStage === MRCStage.STAGE_3B ? "secondary" :
            "destructive"
          } className="text-sm">
            MRC Stade {patient.mrcStage}
          </Badge>
          
          <Badge variant={
            patient.status === PatientStatus.STABLE ? "outline" :
            patient.status === PatientStatus.MONITORING ? "default" :
            "destructive"
          } className="text-sm">
            {patient.status === PatientStatus.STABLE ? "Stable" : 
             patient.status === PatientStatus.MONITORING ? "Surveillance" : "Critique"}
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
                    <p className="text-sm">{patient.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Adresse</p>
                    <p className="text-sm">{patient.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Prochain rendez-vous</p>
                    <p className="text-sm">{patient.nextAppointment || "Non planifié"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Derniers résultats */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Derniers résultats clés</CardTitle>
                <CardDescription>
                  {latestRecord ? `Analyse du ${latestRecord.date}` : "Aucune analyse récente"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestRecord ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Créatinine</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${latestRecord.results.find(r => r.key === 'crea')?.isNormal ? 'text-success-600' : 'text-danger-600'}`}>
                          {latestRecord.results.find(r => r.key === 'crea')?.value || '-'}
                        </span>
                        <span className="text-sm text-gray-500">mg/dL</span>
                        {créatinineTrend.direction !== "stable" && (
                          <span className={`flex items-center text-xs ${créatinineTrend.direction === "up" ? "text-danger-600" : "text-success-600"}`}>
                            {créatinineTrend.direction === "up" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {créatinineTrend.percentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Normal: 0.7-1.3 mg/dL</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium">DFG estimé</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${latestRecord.results.find(r => r.key === 'egfr')?.isNormal ? 'text-success-600' : 'text-danger-600'}`}>
                          {latestRecord.results.find(r => r.key === 'egfr')?.value || '-'}
                        </span>
                        <span className="text-sm text-gray-500">mL/min</span>
                        {egfrTrend.direction !== "stable" && (
                          <span className={`flex items-center text-xs ${egfrTrend.direction === "up" ? "text-success-600" : "text-danger-600"}`}>
                            {egfrTrend.direction === "up" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {egfrTrend.percentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Normal: >90 mL/min</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Potassium</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${latestRecord.results.find(r => r.key === 'potassium')?.isNormal ? 'text-success-600' : 'text-danger-600'}`}>
                          {latestRecord.results.find(r => r.key === 'potassium')?.value || '-'}
                        </span>
                        <span className="text-sm text-gray-500">mmol/L</span>
                      </div>
                      <p className="text-xs text-gray-500">Normal: 3.5-5.0 mmol/L</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun résultat d'analyse disponible.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Évolution du DFG */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution du DFG</CardTitle>
                <CardDescription>Tendance sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 120]} />
                    <Tooltip />
                    <defs>
                      <linearGradient id="egfrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    
                    {/* Zones de référence pour les stades MRC */}
                    {gfrLevels.map((level, i) => (
                      <ReferenceLine 
                        key={i}
                        y={level.min} 
                        stroke={level.color}
                        strokeDasharray="3 3"
                        label={{ 
                          value: `Stade ${level.stage}`, 
                          position: 'left',
                          fill: level.color,
                          fontSize: 10
                        }} 
                      />
                    ))}
                    
                    <Area 
                      type="monotone" 
                      dataKey="egfr" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#egfrGradient)" 
                      activeDot={{ r: 8 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
                  {recommendationsData.length > 0 ? (
                    recommendationsData.slice(0, 3).map(rec => (
                      <div key={rec.id} className="border rounded-lg p-4 bg-secondary-50">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            rec.urgence === "high" ? "bg-danger-100 text-danger-600" : 
                            rec.urgence === "medium" ? "bg-warning-100 text-warning-600" : 
                            "bg-secondary-100 text-secondary-600"
                          }`}>
                            <Brain className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-sm">{rec.title}</h4>
                              <Badge variant={
                                rec.urgence === "high" ? "destructive" : 
                                rec.urgence === "medium" ? "default" : 
                                "outline"
                              } className="ml-2 text-xs">
                                {rec.urgence === "high" ? "Urgent" : 
                                 rec.urgence === "medium" ? "Moyen" : "Faible"}
                              </Badge>
                            </div>
                            <p className="text-xs mt-1 text-gray-500">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucune recommandation disponible.</p>
                  )}
                </div>
              </CardContent>
              {recommendationsData.length > 3 && (
                <CardFooter>
                  <Button variant="outline" className="w-full">Voir toutes les recommandations</Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Alerte si le patient est critique */}
          {patient.status === PatientStatus.CRITICAL && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention - Patient critique</AlertTitle>
              <AlertDescription>
                Ce patient nécessite une surveillance rapprochée et des actions immédiates. Veuillez consulter les recommandations et planifier un suivi urgent.
              </AlertDescription>
            </Alert>
          )}
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
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">Tous les paramètres</TabsTrigger>
                  <TabsTrigger value="renal">Fonction rénale</TabsTrigger>
                  <TabsTrigger value="electrolytes">Électrolytes</TabsTrigger>
                  <TabsTrigger value="metabolic">Métaboliques</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="crea" name="Créatinine" stroke="#f87171" />
                        <Line yAxisId="left" type="monotone" dataKey="uree" name="Urée" stroke="#60a5fa" />
                        <Line yAxisId="right" type="monotone" dataKey="egfr" name="DFG" stroke="#4ade80" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="rounded-lg border">
                    <div className="flex items-center p-3 border-b bg-gray-50">
                      <div className="w-1/3 font-medium">Paramètre</div>
                      <div className="w-1/6 font-medium">Dernière valeur</div>
                      <div className="w-1/6 font-medium">Unité</div>
                      <div className="w-1/3 font-medium">Valeurs normales</div>
                    </div>
                    
                    {latestRecord?.results.map((result, i) => (
                      <div key={i} className={`flex items-center p-3 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                        <div className="w-1/3">{result.name}</div>
                        <div className={`w-1/6 font-medium ${result.isNormal ? 'text-success-600' : 'text-danger-600'}`}>
                          {result.value}
                        </div>
                        <div className="w-1/6 text-gray-500">{result.unit}</div>
                        <div className="w-1/3 text-gray-500">
                          {result.normalRange.min} - {result.normalRange.max} {result.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Content for other tabs... */}
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-4">Rapports d'analyses</h3>
            <div className="space-y-4">
              {records.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
              }).map((record) => (
                <div key={record.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary-50 p-2 rounded-md mr-4">
                      <FileText className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">{record.type}</p>
                      <p className="text-sm text-gray-500">Effectué le {record.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Détails</Button>
                    <Button variant="ghost" size="sm">Télécharger</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Contenu des autres onglets (history, treatment, notes)... */}
        <TabsContent value="history" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Affections chroniques</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {patient.medicalHistory.conditions.map((condition, i) => (
                    <li key={i} className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-danger-500" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {patient.medicalHistory.allergies.length > 0 ? (
                    patient.medicalHistory.allergies.map((allergy, i) => (
                      <li key={i} className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-warning-500" />
                        <span>{allergy}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Aucune allergie connue</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional history content... */}
        </TabsContent>
        
        <TabsContent value="treatment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Médicaments actuels</CardTitle>
              <CardDescription>
                Dernière mise à jour: {latestRecord?.date || "Non disponible"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border divide-y">
                {patient.medicalHistory.medications.map((med, i) => (
                  <div key={i} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start mb-2 md:mb-0">
                      <div className="bg-primary-50 p-2 rounded-md mr-3">
                        <Pill className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-500">{med.dosage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{med.frequency}</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un médicament
              </Button>
            </CardFooter>
          </Card>
          
          {/* Additional treatment content... */}
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
              <CardDescription>
                Workflows de suivi assignés à ce patient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Example workflow for this patient - in a real app, these would come from patient data */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-secondary-50 p-2 rounded-full mr-3">
                      <Activity className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {patient.mrcStage === MRCStage.STAGE_4 || patient.mrcStage === MRCStage.STAGE_5
                          ? "Préparation dialyse"
                          : patient.mrcStage === MRCStage.STAGE_3A || patient.mrcStage === MRCStage.STAGE_3B
                          ? "Suivi intensif MRC stade 3-4"
                          : "Suivi standard MRC stade 2"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {patient.mrcStage === MRCStage.STAGE_4 || patient.mrcStage === MRCStage.STAGE_5
                          ? "Préparation et éducation à la dialyse"
                          : patient.mrcStage === MRCStage.STAGE_3A || patient.mrcStage === MRCStage.STAGE_3B
                          ? "Suivi mensuel pour les patients à surveiller"
                          : "Suivi bisannuel pour les patients stables"}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline">Assigné le 15/06/2023</Badge>
                        <Badge variant={
                          patient.mrcStage === MRCStage.STAGE_1 || patient.mrcStage === MRCStage.STAGE_2 
                            ? "outline" 
                            : patient.mrcStage === MRCStage.STAGE_3A || patient.mrcStage === MRCStage.STAGE_3B 
                            ? "secondary" 
                            : "destructive"
                        }>
                          Stade {patient.mrcStage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Suspendre</Button>
                    <Button variant="outline" size="sm">Détails</Button>
                  </div>
                </div>
                
                <Separator className="my-4" />

                {/* Ajout d'une section pour les alertes actives */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-danger-600" />
                    Alertes actives
                  </h5>
                  {patient.mrcStage === MRCStage.STAGE_4 || patient.mrcStage === MRCStage.STAGE_3B ? (
                    <div className="bg-danger-50 border border-danger-200 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-danger-700 text-sm">Créatinine élevée</p>
                          <p className="text-xs text-danger-600">Valeur: 2.4 mg/dL (seuil: 2.0 mg/dL)</p>
                          <p className="text-xs text-gray-500 mt-1">Dernière mesure du 22/06/2023</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="xs">Ignorer</Button>
                          <Button size="xs" variant="destructive">Traiter</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune alerte active pour ce patient.</p>
                  )}
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-3">Prochaines tâches</h5>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-secondary-50 rounded-md">
                      <div className="p-2 rounded-full bg-white mr-3">
                        <Microscope className="h-4 w-4 text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">
                              {patient.mrcStage === MRCStage.STAGE_4 || patient.mrcStage === MRCStage.STAGE_5
                                ? "Bilan pré-dialyse"
                                : "Bilan sanguin complet"}
                            </p>
                            <p className="text-xs text-gray-500">Prévu pour le 28/06/2023</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Rappel: 3j avant
                          </Badge>
                        </div>
                        
                        {/* Ajout d'une section pour afficher les seuils d'alerte configurés */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-600">Seuils d'alerte:</p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="flex items-center text-xs">
                              <span className="text-gray-500">Créatinine:</span>
                              <span className="ml-1 font-medium">{'>'} 2.0 mg/dL</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <span className="text-gray-500">DFG:</span>
                              <span className="ml-1 font-medium">{'<'} 25 mL/min</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <span className="text-gray-500">Potassium:</span>
                              <span className="ml-1 font-medium">{'>'} 5.5 mmol/L</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-secondary-50 rounded-md">
                      <div className="p-2 rounded-full bg-white mr-3">
                        <Calendar className="h-4 w-4 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {patient.mrcStage === MRCStage.STAGE_4 || patient.mrcStage === MRCStage.STAGE_5
                            ? "Session d'éducation sur la dialyse"
                            : "Consultation néphrologue"}
                        </p>
                        <p className="text-xs text-gray-500">Prévu pour le 05/07/2023</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Ajout d'une section pour l'historique d'adhérence aux tâches */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-3">Historique de suivi</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Adhérence aux tâches</span>
                      <span className="text-sm font-medium text-success-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">17 tâches complétées sur 20 planifiées</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir toutes les tâches et l'historique
              </Button>
            </CardFooter>
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
              <div className="space-y-4">
                {notesData.length > 0 ? (
                  notesData.map(note => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-secondary-50 p-2 rounded-md mr-3">
                          <FileText className="h-5 w-5 text-secondary-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{note.title}</h4>
                            <span className="text-sm text-gray-500">{note.date}</span>
                          </div>
                          <p className="text-sm mt-2">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-2">Par {note.author}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucune note disponible.</p>
                )}
              </div>
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
              Programmez un nouveau rendez-vous pour {patient?.firstName} {patient?.lastName}.
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
