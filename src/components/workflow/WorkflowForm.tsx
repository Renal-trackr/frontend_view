import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Lightbulb } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Workflow, WorkflowStep, WorkflowStatus, TimingType } from "@/services/WorkflowService";
import AuthService from "@/services/AuthService";
import DraggableWorkflowBuilder from "./DraggableWorkflowBuilder";

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

  const handleStepsChange = (newSteps: WorkflowStep[]) => {
    setSteps(newSteps);
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
          ...condition,
          timing: {
            type: timing.type || TimingType.DELAY,
            value: timing.value || "1d",
            ...(timing.date ? { date: timing.date } : {})
          }
        },
        action: {
          type: action.type || "schedule_appointment",
          message: action.message || "",
          reason: action.reason || "",
          ...action
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {isTemplate && (
          <div className="bg-[#91BDC8]/10 border border-[#91BDC8] rounded-md p-4 mb-6">
            <div className="flex items-start">
              <Users className="h-5 w-5 text-[#2980BA] mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#021122]">Workflow à assigner à plusieurs patients</h3>
                <p className="text-sm text-[#334349]">
                  Ce workflow sera assigné à {selectedPatientsCount} patient(s) sélectionné(s).
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Example section */}
        <div className="bg-[#91BDC8]/10 border border-[#91BDC8] rounded-md p-4 mb-6">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-[#2980BA] mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-[#021122]">Exemple de workflow</h3>
              <p className="text-sm text-[#334349] mb-2">
                Pour créer un workflow de suivi du taux d'urée:
              </p>
              <ol className="text-xs text-[#334349] list-decimal pl-4 space-y-1">
                <li>Créez une étape "Tâche" de type "Prescrire un test médical" pour l'urée</li>
                <li>Ajoutez une condition sur le résultat (ex: si urée {'>'} 3 mg/dL)</li>
                <li>Créez une deuxième étape "Alerte" qui sera déclenchée si la condition est remplie</li>
                <li>Enfin, ajoutez une étape "Tâche" pour planifier un rendez-vous d'urgence</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#334349]">Nom du workflow</Label>
              <Input
                id="name"
                name="name"
                value={workflow.name}
                onChange={handleChange}
                placeholder="Ex: Suivi maladie rénale stade 3"
                className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#334349]">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={workflow.description}
                onChange={handleChange}
                placeholder="Détaillez l'objectif et le fonctionnement de ce workflow"
                rows={3}
                className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            {/* Intégration du constructeur d'étapes par drag and drop */}
            <DraggableWorkflowBuilder 
              steps={steps} 
              onStepsChange={handleStepsChange} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 py-3 pt-4 mt-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={workflow.name === "" || steps.length === 0}
          className="bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]"
        >
          {initialData?._id ? "Mettre à jour" : "Créer"} le workflow
        </Button>
      </div>
    </form>
  );
};

export default WorkflowForm;
