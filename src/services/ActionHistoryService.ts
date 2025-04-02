import axios from 'axios';
import AuthService from './AuthService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ActionHistory {
  _id: string;
  user_id: string;
  action_type: string;
  description: string;
  timestamp: string;
  user?: {
    id: string;
    firstname: string;
    lastName: string;
    email: string;
    role_id: string;
  };
  doctor?: {
    id: string;
    firstname: string;
    lastname: string;
    speciality: string;
  };
}

class ActionHistoryService {
  /**
   * Get all action history (admin only)
   */
  async getAllActions(): Promise<ActionHistory[]> {
    try {
      const token = AuthService.getAdminToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/action-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch action history');
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
   * Get action history for a specific user
   */
  async getUserActions(userId: string): Promise<ActionHistory[]> {
    try {
      const token = AuthService.getAdminToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/action-history/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user action history');
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

export default new ActionHistoryService();
