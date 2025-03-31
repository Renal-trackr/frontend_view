import axios from 'axios';
import AuthService from './AuthService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DoctorData {
  firstname: string;
  lastname: string;
  email: string;
  speciality: string;
  phoneNumber: string;
}

interface Doctor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  speciality: string;
  phoneNumber: string;
  isActive?: boolean;
}

class DoctorService {
  /**
   * Create a new doctor
   * @param doctorData - Doctor data to create
   */
  async createDoctor(doctorData: DoctorData): Promise<Doctor> {
    try {
      const token = AuthService.getAdminToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/api/doctors`,
        doctorData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create doctor');
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
   * Get all doctors
   */
  async getDoctors(): Promise<Doctor[]> {
    try {
      const token = AuthService.getAdminToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/doctors`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch doctors');
      }
      
      // Transform API data into the expected format for our UI
      return response.data.data.map((doctor: any) => ({
        id: doctor._id,
        firstname: doctor.firstname,
        lastname: doctor.lastname,
        email: doctor.email,
        speciality: doctor.speciality,
        phoneNumber: doctor.phoneNumber,
        status: doctor.isActive === false ? 'inactive' : 'active'
      }));
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Get doctor by ID
   */
  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const token = AuthService.getAdminToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(
        `${API_URL}/api/doctors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch doctor');
      }
      
      const doctor = response.data.data;
      
      return {
        id: doctor._id,
        firstname: doctor.firstname,
        lastname: doctor.lastname,
        email: doctor.email,
        speciality: doctor.speciality,
        phoneNumber: doctor.phoneNumber,
        status: doctor.isActive === false ? 'inactive' : 'active'
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  
  /**
   * Toggle doctor active status
   */
  async toggleDoctorStatus(id: string, setActive: boolean): Promise<void> {
    try {
      const token = AuthService.getAdminToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Assuming the backend has a route to toggle status
      // If not, this would need to be implemented in the backend
      await axios.patch(
        `${API_URL}/api/doctors/${id}/status`,
        { isActive: setActive },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export default new DoctorService();
