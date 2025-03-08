// src/services/hotelAssignmentService.ts

// Çevre değişkeninden API URL'sini al
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7174/api';
const API_URL = `${API_BASE_URL}/AdminHotel`;

// API istekleri için ortak ayarlar
const getRequestOptions = (method: string) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  };

  return options;
};

// Basit hotel arayüzü - sadece id ve name
export interface Hotel {
  id: number;
  name: string;
}

// Diğer servislerden import et
import { userService, User as UserServiceUser } from './userService';

// Re-export User type from userService
export type User = UserServiceUser;

export const hotelAssignmentService = {
  // Tüm otelleri getir - Doğrudan AdminHotel API'sinden
  getHotels: async (): Promise<Hotel[]> => {
    try {
      console.log('Fetching hotels from AdminHotel API...');
      
      // AdminHotel API'sine istek at
      const response = await fetch(API_URL, getRequestOptions('GET'));
      
      if (!response.ok) {
        console.error(`AdminHotel API error: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      console.log('Hotels fetched successfully:', data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('AdminHotel API returned empty data');
        return [];
      }
      
      // Sadece id ve name al
      return data.map(hotel => ({
        id: hotel.id,
        name: hotel.name
      }));
    } catch (error) {
      console.error('Error in getHotels:', error);
      return [];
    }
  },
  
  // Tüm kullanıcıları getir - userService'i kullan
  getUsers: async (): Promise<User[]> => {
    try {
      console.log('Fetching users from API...');
      // UserService'den kullanıcıları al
      const users = await userService.getUsers();
      console.log('Users fetched successfully:', users);
      
      if (!users || !Array.isArray(users) || users.length === 0) {
        console.warn('User API returned empty data');
        return [];
      }
      
      return users;
    } catch (error) {
      console.error('Error in getUsers:', error);
      return [];
    }
  },
  
  // Kullanıcıyı otele ata
  assignUserToHotel: async (userId: number, hotelId: number): Promise<void> => {
    try {
      console.log(`Assigning user ${userId} to hotel ${hotelId}`);
      const response = await fetch(`${API_URL}/assign?userId=${userId}&hotelId=${hotelId}`, getRequestOptions('POST'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      
      console.log('Assignment successful');
    } catch (error) {
      console.error('Error in assignUserToHotel:', error);
      throw error;
    }
  },
  
  // Kullanıcıyı otelden kaldır
  removeUserFromHotel: async (userId: number, hotelId: number): Promise<void> => {
    try {
      console.log(`Removing user ${userId} from hotel ${hotelId}`);
      // Use a standard RESTful approach with query parameters
      const response = await fetch(`${API_URL}/assign?userId=${userId}&hotelId=${hotelId}`, getRequestOptions('DELETE'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      
      console.log('Removal successful');
    } catch (error) {
      console.error('Error in removeUserFromHotel:', error);
      throw error;
    }
  }
}; 