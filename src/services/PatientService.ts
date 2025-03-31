import axios from 'axios';
import AuthService from './AuthService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PatientData {
  firstname: string;
  lastname: string;
  birth_date: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  blood_group: string;
  mrc_status: string;
  current_treatments?: Array<any>;
  medical_history?: Array<any>;
  antecedents?: Array<any>;
  doctor_ref: string;
}

class PatientService {
  /**
   * Register a new patient
   * @param patientData - Patient data to register
   */
  async registerPatient(patientData: PatientData): Promise<any> {
    try {
      // Get the doctor token for authentication
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/patients`,
        patientData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to register patient');
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
   * Get all patients for the logged-in doctor
   */
  async getPatients(): Promise<any[]> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Get the doctor info
      const doctorInfo = AuthService.getDoctorInfo();
      if (!doctorInfo || !doctorInfo.doctor || !doctorInfo.doctor.id) {
        throw new Error('Doctor information not found');
      }
      
      const response = await axios.get(
        `${API_URL}/api/patients/doctor/${doctorInfo.doctor.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch patients');
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
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch patient');
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

export default new PatientService();
