import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getWorkflowPatientIds } from "@/lib/workflowUtils";
import { Workflow } from "@/services/WorkflowService";

interface WorkflowPatientsBadgeProps {
  workflow: Workflow;
  className?: string;
}

const WorkflowPatientsBadge: React.FC<WorkflowPatientsBadgeProps> = ({ workflow, className }) => {
  const patientIds = getWorkflowPatientIds(workflow);
  
  if (patientIds.length === 0) {
    return <span className="text-gray-500">Aucun patient</span>;
  }
  
  return (
    <Badge variant="outline" className={className}>
      {patientIds.length} patient{patientIds.length > 1 ? 's' : ''}
    </Badge>
  );
};

export default WorkflowPatientsBadge;
