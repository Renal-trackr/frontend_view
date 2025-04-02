import axios from 'axios';
import AuthService from './AuthService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Workflow step types
export enum WorkflowStepType {
  REMINDER = 'reminder',
  TASK = 'task',
  ALERT = 'alert'
}

// Workflow status
export enum WorkflowStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

// Timing types for workflow steps
export enum TimingType {
  DELAY = 'delay',
  FIXED_TIME = 'fixed_time',
  CRON = 'cron'
}

// Interface for step condition
export interface StepCondition {
  timing?: {
    type: TimingType;
    value?: string;
    date?: string;
    expression?: string;
  };
  testResult?: {
    type: string;   // Type de test (par ex: "urea", "creatinine")
    operator: '>' | '<' | '==' | '>=' | '<=';  // Opérateur de comparaison
    value: number;  // Valeur seuil
    unit: string;   // Unité de mesure (mg/dL, etc.)
  };
  criteria?: {
    patientStage?: string;    // Stade MRC du patient
    patientAge?: {
      operator: '>' | '<' | '==' | '>=' | '<=';
      value: number;
    };
    // Autres critères possibles
  };
  dependsOn?: string; // ID of the step it depends on
  outcome?: string;   // Expected outcome of the dependency
  // Additional conditions can be added as needed
}

// Interface for step action
export interface StepAction {
  type?: string;
  message?: string;
  target?: string;
  timing?: {
    days?: number;
    hours?: number;
    date?: string;
  };
  reason?: string;
  alertType?: string;
  test_type?: string; // Type of medical test
  requires_result?: boolean; // Whether the test requires a result
}

// Interface for workflow step
export interface WorkflowStep {
  _id?: string;
  name: string;
  description?: string;
  order: number;
  type: WorkflowStepType;
  status?: string;
  condition?: StepCondition;
  action?: StepAction;
  workflow_id?: string;
}

// Interface for workflow
export interface Workflow {
  _id?: string;
  name: string;
  description: string;
  doctor_id: string;
  patient_id?: string; // Maintenu pour rétrocompatibilité
  patients_ids?: string[]; // Nouveau: remplace patient_ids
  status: WorkflowStatus;
  steps?: WorkflowStep[] | string[];
  created_at?: string;
  updated_at?: string;
  is_template?: boolean;
}

class WorkflowService {
  /**
   * Create a new workflow with scheduling
   * @param workflowData - The workflow data with steps
   */
  async createWorkflow(workflowData: Workflow & { steps: WorkflowStep[] }): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Vérification complète de la structure des données
      if (!workflowData) {
        throw new Error('Les données du workflow sont requises');
      }
      
      // Convertir patient_id ou patient_ids en patients_ids pour le backend
      if (!workflowData.patients_ids) {
        workflowData.patients_ids = [];
        
        // Si patient_id existe, l'utiliser pour créer patients_ids
        if (workflowData.patient_id) {
          workflowData.patients_ids.push(workflowData.patient_id);
        }
        
        // Si l'ancien patient_ids existe, ajouter ses valeurs à patients_ids
        if (workflowData['patient_ids'] && Array.isArray(workflowData['patient_ids'])) {
          workflowData.patients_ids = [...workflowData.patients_ids, ...workflowData['patient_ids']];
        }
      }
      
      // S'assurer que steps est un tableau et n'est pas null
      if (!workflowData.steps) {
        workflowData.steps = [];
      }
      
      // Filtrer les steps null ou undefined et valider chaque étape
      const validatedSteps = (workflowData.steps || [])
        .filter(step => step !== null && step !== undefined)
        .map(step => {
          // Créer un nouvel objet étape avec des valeurs par défaut pour les objets imbriqués
          const stepData = {
            name: step.name || '',
            description: step.description || '',
            order: step.order || 1,
            type: step.type || WorkflowStepType.TASK,
            // S'assurer que condition et ses propriétés imbriquées existent
            condition: {
              timing: {
                type: step.condition?.timing?.type || TimingType.DELAY,
                value: step.condition?.timing?.value || "1d",
                ...(step.condition?.timing?.date ? { date: step.condition.timing.date } : {})
              },
              // Conserver testResult s'il existe
              ...(step.condition?.testResult ? { 
                testResult: step.condition.testResult 
              } : {}),
              // Ajouter les dépendances si elles existent
              ...(step.condition?.dependsOn ? {
                dependsOn: step.condition.dependsOn,
                outcome: step.condition.outcome || 'completed'
              } : {})
            },
            // S'assurer que action et ses propriétés existent
            action: {
              type: step.action?.type || "schedule_appointment",
              message: step.action?.message || "",
              reason: step.action?.reason || "",
              // Ajouter les propriétés spécifiques aux tests médicaux
              ...(step.action?.test_type ? {
                test_type: step.action.test_type,
                requires_result: true
              } : {})
            }
          };
          
          return stepData;
        });
      
      // Formater les données selon ce que le backend attend
      const formattedWorkflowData = {
        ...workflowData,
        stepsData: validatedSteps, // Le backend attend "stepsData" au lieu de "steps"
      };
      
      // Supprimer les propriétés qui ne sont plus nécessaires
      delete formattedWorkflowData.steps;
      delete formattedWorkflowData.patient_ids;
      
      console.log("Sending validated workflow data:", JSON.stringify(formattedWorkflowData, null, 2));
      
      // Envoyer les données validées à l'API
      const response = await axios.post(
        `${API_URL}/api/workflows`,
        formattedWorkflowData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create workflow');
      }
      
      // Vérifier si la réponse contient plusieurs workflows ou un workflow unique
      let result;
      if (response.data.data.workflows) {
        // Cas multi-patients
        result = response.data.data.workflows[0]; // Retourne le premier workflow
      } else if (response.data.data.workflow) {
        // Cas patient unique dans nouvelle structure
        result = response.data.data.workflow;
      } else {
        // Ancienne structure - objet workflow direct
        result = response.data.data;
      }
      
      return result;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Assign workflow to additional patients
   * @param workflowId - The ID of the workflow
   * @param patientIds - Array of patient IDs to assign
   */
  async assignWorkflowToPatients(workflowId: string, patientIds: string[]): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/workflows/${workflowId}/assign`,
        { patientIds },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to assign workflow to patients');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Create a simplified test-based workflow
   * @param testWorkflowData - Test-based workflow configuration
   */
  async createTestBasedWorkflow(testWorkflowData: {
    name: string;
    patient_id: string;
    test: {
      type: string;
      description?: string;
      delay_days?: number;
    };
    alert_condition: {
      parameter: string;
      operator: string;
      threshold: number;
      unit?: string;
    };
    urgent_action?: {
      schedule_appointment: boolean;
      message?: string;
      urgency_level?: string;
    };
  }): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/workflows`,
        testWorkflowData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create test-based workflow');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Get workflow by ID
   * @param id - Workflow ID
   */
  async getWorkflowById(id: string): Promise<Workflow> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/workflows/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch workflow');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Get workflows for current doctor
   */
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/workflows`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch workflows');
      }
      
      // Normaliser les workflows pour s'assurer que patients_ids existe toujours
      return response.data.data.map(workflow => {
        // Remplacer patient_ids par patients_ids si nécessaire
        if (!workflow.patients_ids && workflow.patient_ids) {
          workflow.patients_ids = workflow.patient_ids;
        }
        
        // Si patients_ids n'existe pas mais patient_id existe
        if (!workflow.patients_ids && workflow.patient_id) {
          workflow.patients_ids = [workflow.patient_id];
        } else if (!workflow.patients_ids) {
          workflow.patients_ids = [];
        }
        
        return workflow;
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Get workflows for a specific patient
   * @param patientId - Patient ID
   */
  async getWorkflowsByPatient(patientId: string): Promise<Workflow[]> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/workflows/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch patient workflows');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Update an existing workflow
   * @param id - Workflow ID
   * @param updateData - Data to update
   */
  async updateWorkflow(id: string, updateData: Partial<Workflow> & { stepsData?: WorkflowStep[] }): Promise<Workflow> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Si stepsData n'est pas défini mais steps l'est, utilisez steps comme stepsData
      if (!updateData.stepsData && updateData.steps) {
        updateData.stepsData = updateData.steps as WorkflowStep[];
        delete updateData.steps;
      }
      
      const response = await axios.put(
        `${API_URL}/api/workflows/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update workflow');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Update workflow status
   * @param id - Workflow ID
   * @param status - New status (active, paused, completed)
   */
  async updateWorkflowStatus(id: string, status: WorkflowStatus): Promise<Workflow> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.patch(
        `${API_URL}/api/workflows/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update workflow status');
      }
      
      // La planification de workflow serait gérée côté backend
      // Pas besoin d'appeler WorkflowQueueService ici
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Delete a workflow
   * @param id - Workflow ID
   */
  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/workflows/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete workflow');
      }
      
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export default new WorkflowService();
