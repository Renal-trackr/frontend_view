import { Microscope, Calendar, Bell, ListTodo, AlertTriangle } from "lucide-react";
import { WorkflowStep } from "@/services/WorkflowService";
import { Badge } from "@/components/ui/badge";

interface WorkflowStepCardProps {
  step: WorkflowStep;
  index: number;
}

export const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({ step, index }) => {
  // Fonction pour obtenir l'icône en fonction du type d'étape
  const getStepIcon = () => {
    switch (step.type) {
      case 'reminder':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <ListTodo className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'analysis_test':
        return <Microscope className="h-4 w-4 text-teal-500" />;
      default:
        return <ListTodo className="h-4 w-4 text-gray-500" />;
    }
  };

  // Fonction pour obtenir la description de la condition
  const getConditionDescription = () => {
    if (step.condition?.dependsOn) {
      return `Dépend de l'étape ${step.condition.dependsOn} avec résultat "${step.condition.outcome || 'completed'}"`;
    }
    
    if (step.condition?.testResult) {
      const { type, operator, value, unit } = step.condition.testResult;
      return `Si ${type} ${operator} ${value} ${unit}`;
    }
    
    if (step.condition?.timing?.type === 'delay') {
      return `Délai de ${step.condition.timing.value} après l'étape précédente`;
    }
    
    if (step.condition?.timing?.type === 'fixed_time' && step.condition.timing.date) {
      const date = new Date(step.condition.timing.date);
      return `À la date du ${date.toLocaleDateString('fr-FR')}`;
    }
    
    return "Condition non définie";
  };

  // Fonction pour obtenir le libellé du type d'étape
  const getStepTypeLabel = () => {
    switch (step.type) {
      case 'reminder':
        return "Rappel";
      case 'task':
        return "Tâche";
      case 'alert':
        return "Alerte";
      case 'appointment':
        return "Rendez-vous";
      case 'analysis_test':
        return "Test médical";
      default:
        return step.type;
    }
  };

  return (
    <div className="border border-[#91BDC8]/30 rounded-md p-3 bg-white hover:bg-[#ECE7E3]/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-[#91BDC8]/20 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-[#2980BA]">
            {index + 1}
          </div>
          <div className="font-medium flex items-center text-[#021122]">
            {getStepIcon()}
            <span className="ml-1">{step.name}</span>
          </div>
        </div>
        <Badge variant="outline" className="border-[#91BDC8] text-[#334349]">{getStepTypeLabel()}</Badge>
      </div>
      
      {step.description && (
        <p className="text-sm text-[#334349] mb-2">{step.description}</p>
      )}
      
      <div className="text-xs text-[#619DB5]">
        <div className="flex items-center">
          <span className="mr-1 text-[#334349]">Condition:</span>
          <span>{getConditionDescription()}</span>
        </div>
        
        {step.type === 'analysis_test' && step.action?.test_type && (
          <div className="mt-1">
            <span className="font-medium text-[#334349]">Type de test:</span> {step.action.test_type}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStepCard;
