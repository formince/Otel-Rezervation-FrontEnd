import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService, User } from '@/services/userService';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Pencil } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface UserViewProps {}

const UserView: React.FC<UserViewProps> = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Kullanıcı verilerini getir
  useEffect(() => {
    if (userId) {
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
    setIsLoading(true);
    try {
      const users = await userService.getUsers();
      const foundUser = users.find(u => u.userId === id);
      
      if (foundUser) {
        setUser(foundUser);
      } else {
        showNotification('User not found', 'error');
        navigate('/admin/user-management');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showNotification('Failed to fetch user details', 'error');
      navigate('/admin/user-management');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const handleBack = () => {
    navigate('/admin/user-management');
  };

  const handleEdit = () => {
    if (userId) {
      navigate(`/admin/user-management/${userId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>User not found</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
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
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Information</CardTitle>
            <Badge 
              variant={user.isActive ? 'default' : 'secondary'}
              className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">User ID</h3>
              <p className="mt-1 text-lg">{user.userId}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
              <p className="mt-1 text-lg">
                {user.registrationDate 
                  ? new Date(user.registrationDate).toLocaleDateString() 
                  : 'Not available'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-lg font-medium">{user.fullName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="mt-1 text-lg">{user.phoneNumber || 'Not provided'}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserView; 