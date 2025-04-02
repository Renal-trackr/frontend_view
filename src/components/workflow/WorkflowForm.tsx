import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ArrowDown, ArrowUp, Edit, Trash2, Users, Lightbulb } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import WorkflowStepForm from "./WorkflowStepForm";
import { Workflow, WorkflowStep, WorkflowStatus, TimingType } from "@/services/WorkflowService";
import AuthService from "@/services/AuthService";

interface WorkflowFormProps {
  patientId: string;
  initialData?: Partial<Workflow>;
  onSubmit: (data: Workflow) => void;
  onCancel: () => void;
  isTemplate?: boolean;
  selectedPatientsCount?: number;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({
  patientId,
  initialData,
  onSubmit,
  onCancel,
  isTemplate = false,
  selectedPatientsCount = 0,
}) => {
  const { toast } = useToast();
  const doctorInfo = AuthService.getDoctorInfo();
  
  const [workflow, setWorkflow] = useState<Partial<Workflow>>({
    name: "",
    description: "",
    doctor_id: doctorInfo?.doctor?.id || "",
    patient_id: patientId,
    status: WorkflowStatus.ACTIVE,
    ...initialData,
  });
  
  const [steps, setSteps] = useState<WorkflowStep[]>(
    (initialData?.steps as WorkflowStep[]) || []
  );
  
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

  useEffect(() => {
    if (initialData) {
      setWorkflow({
        ...initialData,
        patient_id: patientId,
        doctor_id: doctorInfo?.doctor?.id || initialData.doctor_id,
      });
      
      if (initialData.steps && Array.isArray(initialData.steps)) {
        setSteps(initialData.steps as WorkflowStep[]);
      }
    }
  }, [initialData, patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkflow(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStep = () => {
    setCurrentStepIndex(steps.length);
    setEditingStep(null);
    setShowStepForm(true);
  };

  const handleEditStep = (step: WorkflowStep, index: number) => {
    setCurrentStepIndex(index);
    setEditingStep(step);
    setShowStepForm(true);
  };

  const handleDeleteStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    
    // Reorder steps
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });
    
    setSteps(newSteps);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap steps
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    // Update order
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });
    
    setSteps(newSteps);
  };

  const handleStepSubmit = (stepData: WorkflowStep) => {
    const newSteps = [...steps];
    
    if (editingStep) {
      // Edit existing step
      newSteps[currentStepIndex] = {
        ...stepData,
        order: currentStepIndex + 1
      };
    } else {
      // Add new step
      newSteps.push({
        ...stepData,
        order: steps.length + 1
      });
    }
    
    setSteps(newSteps);
    setShowStepForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (steps.length === 0) {
      toast({
        title: "Erreur",
        description: "Vous devez ajouter au moins une étape au workflow",
        variant: "destructive"
      });
      return;
    }
    
    // Validation plus stricte des étapes
    const validatedSteps = steps.map(step => {
      // S'assurer que condition est toujours un objet avec une propriété timing
      const condition = step.condition || {};
      const timing = condition.timing || {};
      
      // S'assurer que action est toujours un objet valide
      const action = step.action || {};
      
      return {
        ...step,
        condition: {
          timing: {
            type: timing.type || TimingType.DELAY,
            value: timing.value || "1d",
            ...(timing.date ? { date: timing.date } : {})
          }
        },
        action: {
          type: action.type || "schedule_appointment",
          message: action.message || "",
          reason: action.reason || ""
        }
      };
    });
    
    // Prepare workflow data with validated steps
    const workflowData: Workflow = {
      ...workflow as Workflow,
      steps: validatedSteps
    };
    
    // Log pour debugging
    console.log("Workflow data being submitted:", JSON.stringify(workflowData, null, 2));
    
    onSubmit(workflowData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {isTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Workflow à assigner à plusieurs patients</h3>
                  <p className="text-sm text-blue-600">
                    Ce workflow sera assigné à {selectedPatientsCount} patient(s) sélectionné(s).
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Ajouter cette section d'exemple au début du formulaire */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Exemple de workflow</h3>
                <p className="text-sm text-blue-600 mb-2">
                  Pour créer un workflow de suivi du taux d'urée:
                </p>
                <ol className="text-xs text-blue-600 list-decimal pl-4 space-y-1">
                  <li>Créez une étape "Tâche" de type "Prescrire un test médical" pour l'urée</li>
                  <li>Ajoutez une condition sur le résultat (ex: si urée > 3 mg/dL)</li>
                  <li>Créez une deuxième étape "Alerte" qui sera déclenchée si la condition est remplie</li>
                  <li>Enfin, ajoutez une étape "Tâche" pour planifier un rendez-vous d'urgence</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du workflow</Label>
                <Input
                  id="name"
                  name="name"
                  value={workflow.name}
                  onChange={handleChange}
                  placeholder="Ex: Suivi maladie rénale stade 3"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={workflow.description}
                  onChange={handleChange}
                  placeholder="Détaillez l'objectif et le fonctionnement de ce workflow"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Étapes du workflow</h3>
                <Button type="button" onClick={handleAddStep} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une étape
                </Button>
              </div>
              
              {steps.length === 0 ? (
                <div className="border rounded-md p-8 text-center text-gray-500">
                  Aucune étape définie. Cliquez sur "Ajouter une étape" pour commencer.
                </div>
              ) : (
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <Card key={step._id || index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="bg-primary-50 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{step.name}</h4>
                              <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveStep(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveStep(index, 'down')}
                              disabled={index === steps.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStep(step, index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStep(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 py-3 pt-4 bg-white mt-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={workflow.name === "" || steps.length === 0}>
            {initialData?._id ? "Mettre à jour" : "Créer"} le workflow
          </Button>
        </div>
      </form>

      {/* Step Form Dialog */}
      <Dialog open={showStepForm} onOpenChange={setShowStepForm}>
        <DialogContent className="sm:max-w-[850px]">
          <DialogHeader>
            <DialogTitle>
              {editingStep ? "Modifier l'étape" : "Ajouter une étape"}
            </DialogTitle>
            <DialogDescription>
              Définissez les détails pour cette étape du workflow.
            </DialogDescription>
          </DialogHeader>
          
          <WorkflowStepForm
            initialData={editingStep || undefined}
            onSubmit={handleStepSubmit}
            onCancel={() => {
              setEditingStep(null);
              setShowStepForm(false);
            }}
            stepIndex={currentStepIndex}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkflowForm;
