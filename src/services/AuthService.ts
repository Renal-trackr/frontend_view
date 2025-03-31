import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

class AuthService {
  /**
   * Login admin user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      
      if (response.data.success && response.data.data?.token) {
        this.setAdminToken(response.data.data.token);
        this.setAdminTokenExpiry(response.data.data.expiresAt);
        this.setAdminUserInfo(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Une erreur est survenue lors de la connexion'
      };
    }
  }

  /**
   * Login doctor user
   */
  async doctorLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/doctor/login`, credentials);
      
      if (response.data.success && response.data.data?.token) {
        this.setDoctorToken(response.data.data.token);
        this.setDoctorTokenExpiry(response.data.data.expiresAt);
        this.setDoctorUserInfo(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Une erreur est survenue lors de la connexion'
      };
    }
  }

  /**
   * Logout admin user
   */
  async logoutAdmin(): Promise<boolean> {
    try {
      const token = this.getAdminToken();
      
      if (!token) {
        return false;
      }
      
      const response = await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        this.clearAdminAuthData();
      }
      
      return response.data.success;
    } catch (error) {
      this.clearAdminAuthData(); // Nettoyage en cas d'erreur
      return true;
    }
  }

  /**
   * Logout doctor user
   */
  async logoutDoctor(): Promise<boolean> {
    try {
      const token = this.getDoctorToken();
      
      if (!token) {
        return true; // Already logged out
      }
      
      const response = await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        this.clearDoctorAuthData();
      }
      
      return response.data.success;
    } catch (error) {
      this.clearDoctorAuthData(); // Clean up anyway
      return true;
    }
  }

  /**
   * General logout based on current role
   */
  async logout(): Promise<boolean> {
    if (this.isAuthenticatedAdmin()) {
      return await this.logoutAdmin();
    } else if (this.isAuthenticatedDoctor()) {
      return await this.logoutDoctor();
    }
    return false;
  }

  /**
   * Refresh admin token
   */
  async refreshAdminToken(): Promise<boolean> {
    try {
      const token = this.getAdminToken();
      
      if (!token) {
        return false;
      }
      
      const response = await axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success && response.data.data?.token) {
        this.setAdminToken(response.data.data.token);
        this.setAdminTokenExpiry(response.data.data.expiresAt);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if admin is authenticated
   */
  isAuthenticatedAdmin(): boolean {
    const token = this.getAdminToken();
    const expiryString = this.getAdminTokenExpiry();
    
    if (!token || !expiryString) {
      return false;
    }
    
    // Check if token is expired
    const expiry = new Date(expiryString);
    const now = new Date();
    
    return now < expiry;
  }

  /**
   * Check if doctor is authenticated
   */
  isAuthenticatedDoctor(): boolean {
    const token = this.getDoctorToken();
    const expiryString = this.getDoctorTokenExpiry();
    
    if (!token || !expiryString) {
      return false;
    }
    
    // Check if token is expired
    const expiry = new Date(expiryString);
    const now = new Date();
    
    return now < expiry;
  }
  
  /**
   * Check if any user is authenticated
   */
  isAnyUserAuthenticated(): boolean {
    return this.isAuthenticatedAdmin() || this.isAuthenticatedDoctor();
  }
  
  /**
   * Get the role of the current authenticated user
   */
  getUserRole(): 'ADMIN' | 'DOCTOR' | null {
    if (this.isAuthenticatedAdmin()) {
      return 'ADMIN';
    } else if (this.isAuthenticatedDoctor()) {
      return 'DOCTOR';
    }
    return null;
  }

  /**
   * Get admin token
   */
  getAdminToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  /**
   * Set admin token in storage
   */
  private setAdminToken(token: string): void {
    localStorage.setItem('admin_token', token);
  }

  /**
   * Get admin token expiry
   */
  private getAdminTokenExpiry(): string | null {
    return localStorage.getItem('token_expiry');
  }

  /**
   * Set admin token expiry in storage
   */
  private setAdminTokenExpiry(expiry: string): void {
    localStorage.setItem('token_expiry', expiry);
  }

  /**
   * Store admin user info in local storage
   */
  private setAdminUserInfo(userData: any): void {
    localStorage.setItem('admin_user', JSON.stringify({
      id: userData.userId,
      role: userData.role,
      firstname: userData.firstname,
      lastName: userData.lastName
    }));
  }

  /**
   * Clear all admin auth data from storage
   */
  private clearAdminAuthData(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('admin_user');
  }

  /**
   * Get doctor token
   */
  getDoctorToken(): string | null {
    return localStorage.getItem('doctor_token');
  }
  
  /**
   * Set doctor token in storage
   */
  private setDoctorToken(token: string): void {
    localStorage.setItem('doctor_token', token);
  }
  
  /**
   * Get doctor token expiry
   */
  private getDoctorTokenExpiry(): string | null {
    return localStorage.getItem('doctor_token_expiry');
  }
  
  /**
   * Set doctor token expiry in storage
   */
  private setDoctorTokenExpiry(expiry: string): void {
    localStorage.setItem('doctor_token_expiry', expiry);
  }
  
  /**
   * Store doctor info in local storage
   */
  private setDoctorUserInfo(userData: any): void {
    localStorage.setItem('doctor_user', JSON.stringify({
      id: userData.userId,
      role: userData.role,
      doctor: userData.doctor
    }));
  }
  
  /**
   * Clear all doctor auth data from storage
   */
  private clearDoctorAuthData(): void {
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_token_expiry');
    localStorage.removeItem('doctor_user');
  }
  
  /**
   * Get doctor info from storage
   */
  getDoctorInfo() {
    const doctorUser = localStorage.getItem('doctor_user');
    if (!doctorUser) {
      return null;
    }
    
    try {
      return JSON.parse(doctorUser);
    } catch (error) {
      console.error("Error parsing doctor user data:", error);
      return null;
    }
  }
}

export default new AuthService();
