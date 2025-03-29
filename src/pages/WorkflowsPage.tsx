import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Plus, Calendar, Pill, Microscope, Users, AlertTriangle } from "lucide-react";
import { MRCStage, Workflow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WorkflowForm from "@/components/workflow/WorkflowForm";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

// Exemple de workflows prédéfinis
const initialWorkflows: Workflow[] = [
  {
    id: "wf1",
    name: "Suivi standard MRC stade 2",
    description: "Suivi bisannuel pour les patients stables",
    mrcStage: MRCStage.STAGE_2,
    tasks: [
      {
        id: "task1",
        name: "Analyse de créatinine sérique",
        type: "test",
        frequency: "Tous les 6 mois",
        description: "Mesure de la créatinine sérique pour évaluer la fonction rénale"
      },
      {
        id: "task2",
        name: "Consultation de suivi néphrologue",
        type: "appointment",
        frequency: "Tous les 6 mois",
        description: "Examen clinique et ajustement du traitement si nécessaire"
      },
      {
        id: "task3",
        name: "Contrôle de la pression artérielle",
        type: "monitoring",
        frequency: "Hebdomadaire",
        description: "Auto-mesure de la pression artérielle et consignation des résultats"
      }
    ]
  },
  {
    id: "wf2",
    name: "Suivi intensif MRC stade 3-4",
    description: "Suivi mensuel pour les patients à surveiller",
    mrcStage: MRCStage.STAGE_3B,
    tasks: [
      {
        id: "task4",
        name: "Bilan sanguin complet",
        type: "test",
        frequency: "Mensuel",
        description: "Créatinine, urée, électrolytes, albumine, hémoglobine"
      },
      {
        id: "task5",
        name: "Consultation néphrologue",
        type: "appointment",
        frequency: "Tous les 2 mois",
        description: "Évaluation de la progression de la maladie et ajustement du traitement"
      }
    ]
  },
  {
    id: "wf3",
    name: "Préparation dialyse",
    description: "Préparation et éducation à la dialyse",
    mrcStage: MRCStage.STAGE_5,
    tasks: [
      {
        id: "task6",
        name: "Session d'éducation sur la dialyse",
        type: "appointment",
        frequency: "Hebdomadaire",
        description: "Information sur les modalités de dialyse et choix de la méthode"
      },
      {
        id: "task7",
        name: "Bilan pré-dialyse",
        type: "test",
        frequency: "Mensuel",
        description: "Bilan biologique complet pour préparer la mise en dialyse"
      }
    ]
  }
];

const WorkflowsPage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showAlertsDashboard, setShowAlertsDashboard] = useState(false);
  const [alertsFilter, setAlertsFilter] = useState("all"); // "all", "urgent", "pending"

  // Ajouter un tableau d'alertes de test
  const mockAlerts = [
    {
      id: "alert1",
      patientId: "1",
      patientName: "Jean Dupont",
      workflowId: "wf2",
      taskId: "task4",
      metric: "créatinine",
      value: 2.4,
      threshold: 2.0,
      date: "22/06/2023",
      status: "urgent",
      seen: false
    },
    {
      id: "alert2",
      patientId: "2", 
      patientName: "Marie Martin",
      workflowId: "wf2",
      taskId: "task4",
      metric: "potassium",
      value: 5.7,
      threshold: 5.5,
      date: "21/06/2023",
      status: "pending",
      seen: true
    },
    {
      id: "alert3",
      patientId: "3",
      patientName: "Robert Dubois",
      workflowId: "wf1",
      taskId: "task3",
      metric: "tension artérielle",
      value: "160/95",
      threshold: "140/90",
      date: "23/06/2023",
      status: "urgent",
      seen: false
    }
  ];

  const handleWorkflowSubmit = (workflow: Workflow) => {
    if (editingWorkflow) {
      // Mise à jour d'un workflow existant
      setWorkflows(
        workflows.map((wf) => (wf.id === workflow.id ? workflow : wf))
      );
    } else {
      // Ajout d'un nouveau workflow
      setWorkflows([...workflows, workflow]);
    }
    
    setShowCreateDialog(false);
    setEditingWorkflow(null);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setShowCreateDialog(true);
  };

  const handleAssignWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setShowAssignDialog(true);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-secondary-600" />;
      case "medication":
        return <Pill className="h-5 w-5 text-secondary-600" />;
      case "test":
        return <Microscope className="h-5 w-5 text-secondary-600" />;
      case "monitoring":
        return <Activity className="h-5 w-5 text-secondary-600" />;
      default:
        return <Activity className="h-5 w-5 text-secondary-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAlertsDashboard(!showAlertsDashboard)}
          >
            <AlertTriangle className={`mr-2 h-4 w-4 ${showAlertsDashboard ? "text-primary-500" : ""}`} />
            Tableau des alertes
            <Badge variant="destructive" className="ml-2">{mockAlerts.filter(a => !a.seen).length}</Badge>
          </Button>
          <Button onClick={() => {
            setEditingWorkflow(null);
            setShowCreateDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau workflow
          </Button>
        </div>
      </div>

      {/* Tableau de bord des alertes */}
      {showAlertsDashboard && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Alertes actives</CardTitle>
              <div className="flex gap-2">
                <Select value={alertsFilter} onValueChange={setAlertsFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les alertes</SelectItem>
                    <SelectItem value="urgent">Urgentes uniquement</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">Marquer tout comme vu</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockAlerts
                .filter(alert => alertsFilter === "all" || alert.status === alertsFilter)
                .map(alert => (
                  <div key={alert.id} className={`flex items-start p-3 rounded-md border ${alert.seen ? 'bg-white' : 'bg-secondary-50'}`}>
                    <div className={`p-2 rounded-full mr-3 ${alert.status === "urgent" ? "bg-danger-100 text-danger-600" : "bg-warning-100 text-warning-600"}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">
                          <Link to={`/patients/${alert.patientId}`} className="hover:text-primary-600">{alert.patientName}</Link> - {alert.metric}
                        </h4>
                        <Badge variant={alert.status === "urgent" ? "destructive" : "default"}>
                          {alert.status === "urgent" ? "Urgent" : "En attente"}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">
                        Valeur: <span className="font-medium text-danger-600">{alert.value}</span> (seuil: {alert.threshold})
                      </p>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">{alert.date}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="xs">Ignorer</Button>
                          <Button size="xs">Traiter</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {mockAlerts.filter(alert => alertsFilter === "all" || alert.status === alertsFilter).length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  Aucune alerte {alertsFilter !== "all" ? alertsFilter : ""} à afficher.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflows de suivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-start p-4 border rounded-md">
                  <div className="bg-secondary-50 p-2 rounded-md mr-3">
                    <Activity className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-gray-500">
                          {workflow.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignWorkflow(workflow)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Assigner
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditWorkflow(workflow)}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Tâches ({workflow.tasks.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {workflow.tasks.slice(0, 4).map((task) => (
                          <div key={task.id} className="flex items-center text-sm">
                            {getTaskIcon(task.type)}
                            <span className="ml-2">{task.name}</span>
                            <span className="text-xs text-gray-500 ml-1">({task.frequency})</span>
                          </div>
                        ))}
                        {workflow.tasks.length > 4 && (
                          <div className="text-sm text-primary-600">
                            +{workflow.tasks.length - 4} autres tâches
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline">
                        Stade {workflow.mrcStage}
                      </Badge>
                      <Badge variant="secondary">
                        {workflow.tasks.length} tâches
                      </Badge>
                      <Badge variant="primary">
                        {workflow.id === "wf1" ? "5 patients" : 
                         workflow.id === "wf2" ? "8 patients" : "3 patients"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour créer/modifier un workflow */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow ? "Modifier le workflow" : "Créer un nouveau workflow"}
            </DialogTitle>
          </DialogHeader>
          <WorkflowForm
            initialWorkflow={editingWorkflow || undefined}
            onSubmit={handleWorkflowSubmit}
            onCancel={() => {
              setShowCreateDialog(false);
              setEditingWorkflow(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog pour assigner un workflow à un patient */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Assigner le workflow: {selectedWorkflow?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PatientWorkflowAssignment
              workflow={selectedWorkflow}
              onClose={() => setShowAssignDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant pour assigner des workflows à des patients
const PatientWorkflowAssignment = ({ workflow, onClose }) => {
  // Exemple de données patients fictives
  const patients = [
    { id: "1", name: "Jean Dupont", stage: MRCStage.STAGE_4, status: "Critique" },
    { id: "2", name: "Marie Martin", stage: MRCStage.STAGE_3B, status: "Surveillance" },
    { id: "3", name: "Robert Dubois", stage: MRCStage.STAGE_3A, status: "Surveillance" },
    { id: "4", name: "Françoise Bernard", stage: MRCStage.STAGE_2, status: "Stable" },
    { id: "5", name: "Pierre Leroy", stage: MRCStage.STAGE_1, status: "Stable" },
  ];

  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatients(
      selectedPatients.includes(patientId)
        ? selectedPatients.filter(id => id !== patientId)
        : [...selectedPatients, patientId]
    );
  };

  const filteredPatients = patients.filter(patient => {
    // On filtre les patients selon le stade MRC du workflow
    if (workflow) {
      // Pour simplifier, on considère que le workflow peut être appliqué au stade exact ou à un stade plus élevé
      const patientStageNumber = parseInt(patient.stage.replace(/[A-Za-z]/g, ''));
      const workflowStageNumber = parseInt(workflow.mrcStage.replace(/[A-Za-z]/g, ''));
      return patientStageNumber >= workflowStageNumber;
    }
    return true;
  });

  const handleAssign = () => {
    // Ici, vous implémenteriez la logique pour assigner le workflow aux patients sélectionnés
    console.log(`Assigning workflow ${workflow?.id} to patients:`, selectedPatients);
    alert(`Workflow assigné à ${selectedPatients.length} patient(s)`);
    onClose();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Sélectionnez les patients auxquels vous souhaitez assigner ce workflow.
        Ce workflow est recommandé pour les patients en stade {workflow?.mrcStage} ou plus.
      </p>

      <div className="border rounded-md overflow-hidden">
        <div className="flex items-center p-3 bg-secondary-50 border-b">
          <div className="w-8"></div>
          <div className="flex-1 font-medium">Patient</div>
          <div className="w-24 font-medium">Stade MRC</div>
          <div className="w-24 font-medium">Statut</div>
        </div>
        
        <div className="max-h-72 overflow-y-auto">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <div 
                key={patient.id} 
                className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => togglePatientSelection(patient.id)}
              >
                <div className="w-8">
                  <input 
                    type="checkbox" 
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => {}} // onChange géré par onClick du parent
                    className="rounded"
                  />
                </div>
                <div className="flex-1">{patient.name}</div>
                <div className="w-24">
                  <Badge variant={
                    parseInt(patient.stage) <= 2 ? "outline" :
                    parseInt(patient.stage) <= 4 ? "secondary" :
                    "destructive"
                  }>
                    Stade {patient.stage}
                  </Badge>
                </div>
                <div className="w-24">
                  <Badge variant={
                    patient.status === "Stable" ? "outline" :
                    patient.status === "Surveillance" ? "default" :
                    "destructive"
                  }>
                    {patient.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun patient compatible avec ce workflow.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          {selectedPatients.length} patient(s) sélectionné(s)
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedPatients.length === 0}
          >
            Assigner le workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowsPage;
