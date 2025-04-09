import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Microscope,
  Calendar,
  Bell,
  ListTodo,
  AlertTriangle,
  GripVertical,
  Lightbulb,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowStep, WorkflowStepType } from "@/services/WorkflowService";
import WorkflowStepForm from "./WorkflowStepForm";
import WorkflowStepCard from "./WorkflowStepCard";

interface DraggableWorkflowBuilderProps {
  steps: WorkflowStep[];
  onStepsChange: (steps: WorkflowStep[]) => void;
}

interface SortableStepProps {
  step: WorkflowStep;
  index: number;
  onEdit: (step: WorkflowStep, index: number) => void;
  onDelete: (index: number) => void;
}

const StepTypeCard = ({ type, name, icon: Icon, onClick }) => (
  <Card 
    className="border border-[#91BDC8] cursor-move hover:border-[#2980BA] hover:shadow-md transition-all"
    onClick={onClick}
  >
    <CardContent className="p-3 flex items-center gap-3">
      <div className={`rounded-full p-1.5 bg-[#91BDC8]/10 text-[#2980BA]`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-[#021122]">{name}</p>
        <p className="text-xs text-[#619DB5]">Glisser pour ajouter</p>
      </div>
    </CardContent>
  </Card>
);

const SortableStep = ({ step, index, onEdit, onDelete }: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step._id || `step-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className={`shadow-sm border-[#91BDC8]/40 ${isDragging ? 'border-[#2980BA]' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center flex-1">
              <div 
                {...attributes} 
                {...listeners} 
                className="bg-[#91BDC8]/10 rounded p-1 mr-2 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-5 w-5 text-[#619DB5]" />
              </div>
              <div className="bg-[#91BDC8]/20 text-[#2980BA] rounded-full w-6 h-6 flex items-center justify-center mr-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[#021122]">{step.name}</h4>
                <p className="text-sm text-[#334349]">{step.description}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(step, index)}
                className="text-[#334349] hover:text-[#2980BA] hover:bg-[#ECE7E3]/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(index)}
                className="text-destructive hover:text-[#2980BA] hover:bg-[#ECE7E3]/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DraggableWorkflowBuilder: React.FC<DraggableWorkflowBuilderProps> = ({ 
  steps, 
  onStepsChange 
}) => {
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex(
        (step) => (step._id || `step-${steps.indexOf(step)}`) === active.id
      );
      const newIndex = steps.findIndex(
        (step) => (step._id || `step-${steps.indexOf(step)}`) === over.id
      );

      const newSteps = arrayMove(steps, oldIndex, newIndex).map((step, idx) => ({
        ...step,
        order: idx + 1,
      }));

      onStepsChange(newSteps);
    }
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
    const reorderedSteps = newSteps.map((step, idx) => ({
      ...step,
      order: idx + 1,
    }));
    
    onStepsChange(reorderedSteps);
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
    
    onStepsChange(newSteps);
    setShowStepForm(false);
  };

  const addTemplateStep = (type: string) => {
    let newStep: Partial<WorkflowStep> = {
      name: "",
      description: "",
      order: steps.length + 1,
      type: type as WorkflowStepType,
    };

    // Pré-remplir avec des informations par défaut selon le type
    switch (type) {
      case "analysis_test":
        newStep.name = "Test sanguin";
        newStep.description = "Effectuer un test sanguin";
        newStep.action = { test_type: "urea", requires_result: true };
        break;
      case "appointment":
        newStep.name = "Rendez-vous";
        newStep.description = "Planifier un rendez-vous médical";
        newStep.action = { type: "schedule_appointment", reason: "Consultation de suivi" };
        break;
      case "reminder":
        newStep.name = "Rappel";
        newStep.description = "Envoyer un rappel au patient";
        newStep.action = { type: "send_notification", message: "N'oubliez pas votre rendez-vous" };
        break;
      case "alert":
        newStep.name = "Alerte";
        newStep.description = "Alerte en cas de valeur anormale";
        newStep.action = { type: "create_alert", message: "Valeur anormale détectée" };
        break;
      default:
        newStep.name = "Nouvelle étape";
        newStep.description = "Description de l'étape";
    }

    setCurrentStepIndex(steps.length);
    setEditingStep(newStep as WorkflowStep);
    setShowStepForm(true);
    setShowTemplateLibrary(false);
  };

  const findStep = (id: string) => {
    return steps.find(
      (step) => (step._id || `step-${steps.indexOf(step)}`) === id
    );
  };

  // Récupérer l'étape active
  const activeStep = activeId ? findStep(activeId as string) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#021122]">Étapes du workflow</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowTemplateLibrary(true)}
            className="border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Étapes types
          </Button>
          <Button 
            onClick={handleAddStep} 
            variant="outline" 
            className="border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une étape
          </Button>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="border border-[#91BDC8] border-dashed rounded-md p-8 text-center text-[#334349]">
          <p className="mb-4">Aucune étape définie pour ce workflow.</p>
          <Button 
            variant="outline" 
            onClick={() => setShowTemplateLibrary(true)}
            className="border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Utiliser une étape type
          </Button>
          <p className="mt-2 text-sm">ou</p>
          <Button 
            onClick={handleAddStep} 
            variant="outline" 
            className="mt-2 border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer une étape personnalisée
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map(step => step._id || `step-${steps.indexOf(step)}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {steps.map((step, index) => (
                <SortableStep
                  key={step._id || `step-${index}`}
                  step={step}
                  index={index}
                  onEdit={handleEditStep}
                  onDelete={handleDeleteStep}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeStep ? (
              <Card className="shadow-md border-[#2980BA] bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-[#91BDC8]/20 text-[#2980BA] rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      {steps.indexOf(activeStep) + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#021122]">{activeStep.name}</h4>
                      <p className="text-sm text-[#334349]">{activeStep.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

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

      {/* Template Library Dialog */}
      <Dialog open={showTemplateLibrary} onOpenChange={setShowTemplateLibrary}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Bibliothèque d'étapes</DialogTitle>
            <DialogDescription>
              Sélectionnez un type d'étape à ajouter à votre workflow
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
            <StepTypeCard 
              type="analysis_test" 
              name="Test médical" 
              icon={Microscope}
              onClick={() => addTemplateStep("analysis_test")}
            />
            <StepTypeCard 
              type="appointment" 
              name="Rendez-vous" 
              icon={Calendar}
              onClick={() => addTemplateStep("appointment")}
            />
            <StepTypeCard 
              type="reminder" 
              name="Rappel" 
              icon={Bell}
              onClick={() => addTemplateStep("reminder")}
            />
            <StepTypeCard 
              type="task" 
              name="Tâche" 
              icon={ListTodo}
              onClick={() => addTemplateStep("task")}
            />
            <StepTypeCard 
              type="alert" 
              name="Alerte" 
              icon={AlertTriangle}
              onClick={() => addTemplateStep("alert")}
            />
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowTemplateLibrary(false)}
              className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DraggableWorkflowBuilder;
