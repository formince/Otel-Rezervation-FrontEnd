// src/services/userService.ts

// Çevre değişkeninden API URL'sini al
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7174/api';
const API_URL = `${API_BASE_URL}/User`;

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  passwordHash: string;
  registrationDate: string | null;
  isActive: boolean | null;
}

export interface UserFormData {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  passwordHash?: string;
  isActive: boolean | null;
}

// API istekleri için ortak ayarlar
const getRequestOptions = (method: string, body?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // CORS sorunları yaşanıyorsa bu satırı kaldırın
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

export const userService = {
  // Tüm kullanıcıları getir
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(API_URL, getRequestOptions('GET'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },
  
  // Kullanıcı oluştur
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      // Şifre kontrolü - API null değer kabul etmiyor
      if (!userData.passwordHash || userData.passwordHash.trim() === '') {
        throw new Error('Password is required and cannot be empty');
      }

      // API'nin beklediği formata uygun veri hazırlama
      const apiUserData = {
        // Sadece API'nin beklediği alanları gönder
        fullName: userData.fullName.trim(),
        email: userData.email.trim(),
        phoneNumber: userData.phoneNumber || null,
        passwordHash: userData.passwordHash,
        isActive: userData.isActive === null ? true : userData.isActive
      };
      
      console.log('Sending data to API:', JSON.stringify({
        ...apiUserData,
        passwordHash: '******' // Logda şifreyi gizle
      }, null, 2));
      
      const response = await fetch(API_URL, getRequestOptions('POST', apiUserData));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },
  
  // Kullanıcı güncelle
  updateUser: async (userId: number, userData: Partial<UserFormData>): Promise<User> => {
    try {
      // API'nin beklediği formata uygun veri hazırlama
      const apiUserData: any = {
        userId,
        fullName: userData.fullName?.trim(),
        email: userData.email?.trim(),
        phoneNumber: userData.phoneNumber === '' ? null : userData.phoneNumber,
        isActive: userData.isActive
      };
      
      // Boş şifre gönderme
      if (userData.passwordHash && userData.passwordHash.trim() !== '') {
        apiUserData.passwordHash = userData.passwordHash;
      }
      
      console.log('Updating user data:', JSON.stringify(apiUserData, null, 2));
      
      const response = await fetch(`${API_URL}/${userId}`, getRequestOptions('PUT', apiUserData));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },
  
  // Kullanıcı sil
  deleteUser: async (userId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, getRequestOptions('DELETE'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}; 