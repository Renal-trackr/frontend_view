import axios from 'axios';
import AuthService from './AuthService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export enum WorkflowStepType {
  REMINDER = 'reminder',
  TASK = 'task',
  ALERT = 'alert'
}


export enum WorkflowStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export enum TimingType {
  DELAY = 'delay',
  FIXED_TIME = 'fixed_time',
  CRON = 'cron'
}


export interface StepCondition {
  timing?: {
    type: TimingType;
    value?: string;
    date?: string;
    expression?: string;
  };
  testResult?: {
    type: string;   
    operator: '>' | '<' | '==' | '>=' | '<='; 
    value: number;  
  };
  criteria?: {
    patientStage?: string;   
    patientAge?: {
      operator: '>' | '<' | '==' | '>=' | '<=';
      value: number;
    };
    
  };
  dependsOn?: string; 
  outcome?: string;   

}

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
  test_type?: string; 
  requires_result?: boolean; 
}


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


export interface Workflow {
  _id?: string;
  name: string;
  description: string;
  doctor_id: string;
  patient_id?: string; 
  patients_ids?: string[];
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
      
     
      if (!workflowData) {
        throw new Error('Les données du workflow sont requises');
      }
      
      
      if (!workflowData.patients_ids) {
        workflowData.patients_ids = [];
        
        
        if (workflowData.patient_id) {
          workflowData.patients_ids.push(workflowData.patient_id);
        }
        
       
        if (workflowData['patient_ids'] && Array.isArray(workflowData['patient_ids'])) {
          workflowData.patients_ids = [...workflowData.patients_ids, ...workflowData['patient_ids']];
        }
      }
      
      
      if (!workflowData.steps) {
        workflowData.steps = [];
      }
      
     
      const validatedSteps = (workflowData.steps || [])
        .filter(step => step !== null && step !== undefined)
        .map(step => {
          
          const stepData = {
            name: step.name || '',
            description: step.description || '',
            order: step.order || 1,
            type: step.type || WorkflowStepType.TASK,
            
            condition: {
              timing: {
                type: step.condition?.timing?.type || TimingType.DELAY,
                value: step.condition?.timing?.value || "1d",
                ...(step.condition?.timing?.date ? { date: step.condition.timing.date } : {})
              },
             
              ...(step.condition?.testResult ? { 
                testResult: step.condition.testResult 
              } : {}),
             
              ...(step.condition?.dependsOn ? {
                dependsOn: step.condition.dependsOn,
                outcome: step.condition.outcome || 'completed'
              } : {})
            },
            
            action: {
              type: step.action?.type || "schedule_appointment",
              message: step.action?.message || "",
              reason: step.action?.reason || "",
             
              ...(step.action?.test_type ? {
                test_type: step.action.test_type,
                requires_result: true
              } : {})
            }
          };
          
          return stepData;
        });
      
      
      const formattedWorkflowData = {
        ...workflowData,
        stepsData: validatedSteps, 
      };
      
      
      delete formattedWorkflowData.steps;
      delete formattedWorkflowData.patient_ids;
      
      console.log("Sending validated workflow data:", JSON.stringify(formattedWorkflowData, null, 2));
      
      
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
      
      
      let result;
      if (response.data.data.workflows) {
       
        result = response.data.data.workflows[0]; 
      } else if (response.data.data.workflow) {
       
        result = response.data.data.workflow;
      } else {
        
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
     
      return response.data.data.map(workflow => {
        
        if (!workflow.patients_ids && workflow.patient_ids) {
          workflow.patients_ids = workflow.patient_ids;
        }
        
        
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
