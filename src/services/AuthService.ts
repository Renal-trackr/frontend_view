import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    role: string;
    firstname: string;
    lastName: string;
    token: string;
    expiresAt: string;
  };
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      
      if (response.data.success && response.data.data?.token) {
        this.setToken(response.data.data.token);
        this.setTokenExpiry(response.data.data.expiresAt);
        this.setUserInfo(response.data.data);
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
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }
      
      const response = await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        this.clearAuthData();
      }
      
      return response.data.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }
      
      const response = await axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success && response.data.data?.token) {
        this.setToken(response.data.data.token);
        this.setTokenExpiry(response.data.data.expiresAt);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiryString = this.getTokenExpiry();
    
    if (!token || !expiryString) {
      return false;
    }
    
    // Check if token is expired
    const expiry = new Date(expiryString);
    const now = new Date();
    
    if (now > expiry) {
      // Token expired, try to refresh
      return false;
    }
    
    return true;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  /**
   * Set token in storage
   */
  private setToken(token: string): void {
    localStorage.setItem('admin_token', token);
  }

  /**
   * Get token expiry
   */
  private getTokenExpiry(): string | null {
    return localStorage.getItem('token_expiry');
  }

  /**
   * Set token expiry in storage
   */
  private setTokenExpiry(expiry: string): void {
    localStorage.setItem('token_expiry', expiry);
  }

  /**
   * Store user info in local storage
   */
  private setUserInfo(userData: any): void {
    localStorage.setItem('admin_user', JSON.stringify({
      id: userData.userId,
      role: userData.role,
      firstname: userData.firstname,
      lastName: userData.lastName
    }));
  }

  /**
   * Clear all auth data from storage
   */
  private clearAuthData(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('admin_user');
  }
}

export default new AuthService();
