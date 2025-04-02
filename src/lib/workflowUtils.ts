import { Workflow } from "@/services/WorkflowService";

/**
 * Normalise les données de workflow pour garantir que patients_ids est toujours un tableau
 */
export function normalizeWorkflowPatients(workflow: Workflow): Workflow {
  if (!workflow) return workflow;
  
  const normalizedWorkflow = { ...workflow };
  
  // Convertir patient_ids en patients_ids si nécessaire
  if (!normalizedWorkflow.patients_ids && normalizedWorkflow.patient_ids) {
    normalizedWorkflow.patients_ids = normalizedWorkflow.patient_ids;
  }
  
  // Si patients_ids n'existe pas ou est vide, mais patient_id existe
  if ((!normalizedWorkflow.patients_ids || normalizedWorkflow.patients_ids.length === 0) && 
      normalizedWorkflow.patient_id) {
    normalizedWorkflow.patients_ids = [normalizedWorkflow.patient_id];
  } 
  // Si patients_ids n'existe pas du tout
  else if (!normalizedWorkflow.patients_ids) {
    normalizedWorkflow.patients_ids = [];
  }
  
  return normalizedWorkflow;
}

/**
 * Récupère les IDs de patients d'un workflow, quelle que soit la structure
 */
export function getWorkflowPatientIds(workflow: Workflow): string[] {
  if (!workflow) return [];
  
  if (workflow.patients_ids && workflow.patients_ids.length > 0) {
    return workflow.patients_ids;
  } else if (workflow.patient_ids && workflow.patient_ids.length > 0) {
    return workflow.patient_ids;
  } else if (workflow.patient_id) {
    return [workflow.patient_id];
  }
  
  return [];
}

/**
 * Détermine si un workflow est affecté à plusieurs patients
 */
export function isMultiPatientWorkflow(workflow: Workflow): boolean {
  const patientIds = getWorkflowPatientIds(workflow);
  return patientIds.length > 1;
}
