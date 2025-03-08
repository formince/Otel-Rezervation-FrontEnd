import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService, User, UserFormData } from '@/services/userService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface UserFormProps {}

const UserForm: React.FC<UserFormProps> = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isEditMode = !!userId;
  
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    phoneNumber: null,
    passwordHash: '',
    isActive: true
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Kullanıcı verilerini getir (düzenleme modu için)
  useEffect(() => {
    if (isEditMode && userId) {
      fetchUser(parseInt(userId));
    }
  }, [userId]);

  // Bildirim zamanlayıcısı
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchUser = async (id: number) => {
    setIsFetching(true);
    try {
      const users = await userService.getUsers();
      const user = users.find(u => u.userId === id);
      
      if (user) {
        setFormData({
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          passwordHash: '', // Şifre alanını boş bırak
          isActive: user.isActive
        });
      } else {
        showNotification('User not found', 'error');
        navigate('/admin/user-management');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showNotification('Failed to fetch user details', 'error');
      navigate('/admin/user-management');
    } finally {
      setIsFetching(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const validateForm = (data: UserFormData) => {
    const errors: {[key: string]: string} = {};
    
    if (!data.fullName || data.fullName.trim() === '') {
      errors.fullName = 'Name is required';
    }
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Valid email is required';
    }
    
    // Şifre kontrolü - yeni kullanıcı için zorunlu
    if (!isEditMode) {
      if (!data.passwordHash) {
        errors.passwordHash = 'Password is required';
      } else if (data.passwordHash.length < 6) {
        errors.passwordHash = 'Password must be at least 6 characters';
      }
    } else if (data.passwordHash && data.passwordHash.length > 0 && data.passwordHash.length < 6) {
      // Düzenleme modunda şifre girilmişse kontrol et
      errors.passwordHash = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    // Telefon numarası için özel işlem
    if (field === 'phoneNumber' && value === '') {
      value = null;
    }
    
    // Boolean değerler için dönüşüm
    if (field === 'isActive' && typeof value === 'string') {
      value = value === 'active';
    }
    
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Hata varsa temizle
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;

    setIsLoading(true);
    try {
      if (isEditMode && userId) {
        // Kullanıcı güncelleme
        console.log('Updating user with data:', formData);
        await userService.updateUser(parseInt(userId), formData);
        showNotification('User updated successfully', 'success');
        
        // Başarılı güncelleme sonrası kullanıcı listesine yönlendir
        setTimeout(() => {
          navigate('/admin/user-management');
        }, 1500);
      } else {
        // Yeni kullanıcı oluşturma
        console.log('Creating user with data:', formData);
        await userService.createUser(formData);
        showNotification('User created successfully', 'success');
        
        // Başarılı oluşturma sonrası kullanıcı listesine yönlendir
        setTimeout(() => {
          navigate('/admin/user-management');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage = error.message || 'Failed to save user. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/user-management');
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {notification.show && (
        <Alert className={`mb-6 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit User Information' : 'Create New User'}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Update the user information below.' 
              : 'Fill in the details to create a new user account.'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={isLoading}
                  className={formErrors.fullName ? 'border-red-500' : ''}
                  placeholder="Enter full name"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-sm">{formErrors.fullName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  className={formErrors.email ? 'border-red-500' : ''}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.isActive ? 'active' : 'inactive'} 
                  onValueChange={(value) => handleInputChange('isActive', value === 'active')}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passwordHash">
                {isEditMode ? 'Password (Leave blank to keep current)' : 'Password'}
              </Label>
              <Input
                id="passwordHash"
                type="password"
                value={formData.passwordHash || ''}
                onChange={(e) => handleInputChange('passwordHash', e.target.value)}
                disabled={isLoading}
                className={formErrors.passwordHash ? 'border-red-500' : ''}
                placeholder={isEditMode ? 'Enter new password (optional)' : 'Enter password'}
              />
              {formErrors.passwordHash && (
                <p className="text-red-500 text-sm">{formErrors.passwordHash}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update User' : 'Create User'}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserForm; 