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

// Interface for medical records
interface MedicalItem {
  id?: string;
  name: string;
  date?: string;
  description?: string;
}

interface PatientNote {
  id?: string;
  text: string;
  date: string;
  created_by?: string;
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

  /**
   * Update basic patient information
   * @param id - Patient ID
   * @param updateData - Data to update
   */
  async updatePatientInfo(id: string, updateData: Partial<PatientData>): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update patient information');
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
   * Add a treatment to a patient
   */
  async addTreatment(patientId: string, treatment: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/patients/${patientId}/treatments`,
        treatment,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add treatment');
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
   * Update a patient's treatment
   */
  async updateTreatment(patientId: string, treatmentId: string, updatedTreatment: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}/treatments/${treatmentId}`,
        updatedTreatment,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update treatment');
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
   * Remove a treatment from a patient
   */
  async removeTreatment(patientId: string, treatmentId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/patients/${patientId}/treatments/${treatmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove treatment');
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
   * Add medical history to a patient
   */
  async addMedicalHistory(patientId: string, historyItem: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/patients/${patientId}/medical-history`,
        historyItem,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add medical history');
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
   * Update a medical history item
   */
  async updateMedicalHistory(patientId: string, itemId: string, updatedItem: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}/medical-history/${itemId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update medical history');
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
   * Remove a medical history item
   */
  async removeMedicalHistory(patientId: string, itemId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/patients/${patientId}/medical-history/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove medical history item');
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
   * Add an antecedent (allergy) to a patient
   */
  async addAntecedent(patientId: string, antecedent: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/patients/${patientId}/antecedents`,
        antecedent,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add antecedent');
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
   * Update an antecedent
   */
  async updateAntecedent(patientId: string, antecedentId: string, updatedAntecedent: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}/antecedents/${antecedentId}`,
        updatedAntecedent,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update antecedent');
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
   * Remove an antecedent
   */
  async removeAntecedent(patientId: string, antecedentId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/patients/${patientId}/antecedents/${antecedentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove antecedent');
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
   * Add a note to a patient
   */
  async addNote(patientId: string, note: PatientNote): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/patients/${patientId}/notes`,
        note,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add note');
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
   * Update a patient note
   */
  async updateNote(patientId: string, noteId: string, updatedNote: PatientNote): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}/notes/${noteId}`,
        updatedNote,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update note');
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
   * Remove a note from a patient
   */
  async removeNote(patientId: string, noteId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/patients/${patientId}/notes/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove note');
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
   * Get patient medical history
   */
  async getPatientMedicalHistory(patientId: string): Promise<any[]> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const patient = await this.getPatientById(patientId);
      return patient.medical_history || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  /**
   * Get patient antecedents (allergies)
   */
  async getPatientAntecedents(patientId: string): Promise<any[]> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const patient = await this.getPatientById(patientId);
      return patient.antecedents || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  /**
   * Update medical history item
   * @param patientId - Patient ID
   * @param historyId - ID of the medical history item
   * @param updatedItem - Updated medical history data
   */
  async updateMedicalHistoryItem(patientId: string, historyId: string, updatedItem: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}/medical-history/${historyId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update medical history item');
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
   * Delete medical history item
   * @param patientId - Patient ID
   * @param historyId - ID of the medical history item to delete
   */
  async deleteMedicalHistoryItem(patientId: string, historyId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/patients/${patientId}/medical-history/${historyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete medical history item');
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
   * Update antecedent (allergy) item
   * @param patientId - Patient ID
   * @param antecedentId - ID of the antecedent item
   * @param updatedItem - Updated antecedent data
   */
  async updateAntecedentItem(patientId: string, antecedentId: string, updatedItem: MedicalItem): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}/antecedents/${antecedentId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update antecedent');
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
   * Delete antecedent (allergy) item
   * @param patientId - Patient ID
   * @param antecedentId - ID of the antecedent to delete
   */
  async deleteAntecedentItem(patientId: string, antecedentId: string): Promise<any> {
    try {
      const token = AuthService.getDoctorToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(
        `${API_URL}/api/patients/${patientId}/antecedents/${antecedentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete antecedent');
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
