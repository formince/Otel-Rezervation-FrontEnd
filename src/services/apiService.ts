import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Define role types
export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  HotelAdmin = 'HotelAdmin',
  User = 'User'
}

// Interface for authentication
interface AuthResponse {
  token: string;
  role: UserRole;
}

const API_BASE_URL = 'https://localhost:7174/api';

class ApiService {
  constructor() {
    this.setupInterceptors();
  }

  // Global error handling interceptor
  private setupInterceptors() {
    axios.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.handle401Error();
        }
        return Promise.reject(error);
      }
    );
  }

  // Handle 401 Unauthorized errors
  private handle401Error() {
    // Clear all authentication-related data
    this.clearAuth();

    // Clear local and session storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to home page (login page)
    window.location.href = '/';
  }

  // Set authentication token and role in cookies
  setAuth(authResponse: AuthResponse) {
    Cookies.set('auth_token', authResponse.token);
    Cookies.set('user_role', authResponse.role);
  }

  // Clear authentication by removing cookies
  clearAuth() {
    Cookies.remove('auth_token');
    Cookies.remove('user_role');
  }

  // Get current authentication token from cookies
  getToken(): string | undefined {
    return Cookies.get('auth_token');
  }

  // Get current user role from cookies
  getUserRole(): UserRole | undefined {
    const role = Cookies.get('user_role');
    return role as UserRole;
  }

  // Check if user has a specific role
  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  // Get authorization headers
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic GET method with error handling
  async get(endpoint: string, params?: any) {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        params,
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  // Generic POST method with error handling
  async post(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  // Generic PUT method with error handling
  async put(endpoint: string, data: any) {
    try {
      const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  // Generic DELETE method with error handling
  async delete(endpoint: string) {
    try {
      const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }

  // Placeholder for future methods if needed
  async placeholder() {
    // Empty method to maintain class structure
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

const apiService = new ApiService();
export default apiService;