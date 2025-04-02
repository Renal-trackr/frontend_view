import axios from 'axios';
import AuthService from './AuthService';
import { WorkflowStep, WorkflowStepType, TimingType } from './WorkflowService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface QueueJobData {
  workflow_id: string;
  step_id: string;
  patient_id: string;
  action: {
    type: string;
    [key: string]: any;
  };
  condition?: {
    [key: string]: any;
  };
  metadata?: {
    [key: string]: any;
  };
}

class WorkflowQueueService {
  /**
   * Schedule a workflow step
   * @param step - The workflow step to schedule
   * @param workflowId - The ID of the workflow
   * @param patientId - The ID of the patient
   */
  async scheduleWorkflowStep(
    step: WorkflowStep, 
    workflowId: string, 
    patientId: string
  ): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Prepare job data
      const jobData: QueueJobData = {
        workflow_id: workflowId,
        step_id: step._id,
        patient_id: patientId,
        action: step.action,
        condition: step.condition,
        metadata: {
          step_name: step.name,
          step_type: step.type,
          step_order: step.order
        }
      };
      
      // Calculate delay based on timing type
      let delay = 0;
      if (step.condition?.timing) {
        if (step.condition.timing.type === TimingType.DELAY) {
          const value = step.condition.timing.value;
          // Parse delay value (e.g., "7d" for 7 days)
          if (value?.endsWith('d')) {
            delay = parseInt(value) * 24 * 60 * 60 * 1000; // days to ms
          } else if (value?.endsWith('h')) {
            delay = parseInt(value) * 60 * 60 * 1000; // hours to ms
          } else if (value?.endsWith('m')) {
            delay = parseInt(value) * 60 * 1000; // minutes to ms
          }
        } else if (step.condition.timing.type === TimingType.FIXED_TIME && step.condition.timing.date) {
          const targetDate = new Date(step.condition.timing.date);
          const now = new Date();
          delay = targetDate.getTime() - now.getTime();
          
          // If date is in the past, set delay to execute immediately
          if (delay < 0) {
            delay = 0;
          }
        }
      }
      
      // Send job to the BullMQ queue on the backend
      const response = await axios.post(
        `${API_URL}/api/workflows/queue/job`,
        {
          jobData,
          delay,
          stepType: step.type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to schedule workflow job');
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
   * Schedule all steps of a workflow
   * @param workflowId - The ID of the workflow
   */
  async scheduleWorkflow(workflowId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/workflows/${workflowId}/schedule`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to schedule workflow');
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
   * Cancel a scheduled workflow
   * @param workflowId - The ID of the workflow to cancel
   */
  async cancelWorkflow(workflowId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/workflows/${workflowId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to cancel workflow');
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
   * Get workflow execution history
   * @param workflowId - The ID of the workflow
   */
  async getWorkflowHistory(workflowId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/workflows/${workflowId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch workflow history');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export default new WorkflowQueueService();
