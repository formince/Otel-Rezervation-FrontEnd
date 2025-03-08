import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Search, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { hotelAssignmentService, Hotel, User } from '@/services/hotelAssignmentService';

interface HotelAssignmentPageProps {}

const HotelAssignmentPage: React.FC<HotelAssignmentPageProps> = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [hotelSearchTerm, setHotelSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Verileri yükle
  useEffect(() => {
    fetchData();
  }, []);

  // Bildirim zamanlayıcısı
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Önce kullanıcı verilerini getir
      console.log('Fetching users...');
      const usersData = await hotelAssignmentService.getUsers();
      console.log('Fetched users:', usersData);
      setUsers(usersData);
      
      // Sonra otel verilerini getir
      console.log('Fetching hotels...');
      const hotelsData = await hotelAssignmentService.getHotels();
      console.log('Fetched hotels:', hotelsData);
      setHotels(hotelsData);
      
      console.log('Hotels loaded:', hotelsData.length);
      console.log('Users loaded:', usersData.length);
      
      if (usersData.length === 0) {
        showNotification('No users found. Please check the user API.', 'error');
      }
      
      if (hotelsData.length === 0) {
        showNotification('No hotels found. Please check the hotel API.', 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Failed to fetch data. Please try again later.', 'error');
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

  const handleAssignUser = async () => {
    if (!selectedUserId || !selectedHotelId) {
      showNotification('Please select both a user and a hotel', 'error');
      return;
    }

    setIsAssigning(true);
    try {
      await hotelAssignmentService.assignUserToHotel(selectedUserId, selectedHotelId);
      showNotification('User assigned to hotel successfully', 'success');
      
      // Seçimleri sıfırla
      setSelectedUserId(null);
      setSelectedHotelId(null);
      setUserSearchTerm('');
      setHotelSearchTerm('');
    } catch (error: any) {
      console.error('Error assigning user to hotel:', error);
      const errorMessage = error.message || 'Failed to assign user to hotel. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveUser = () => {
    if (!selectedUserId || !selectedHotelId) {
      showNotification('Please select both a user and a hotel', 'error');
      return;
    }

    // Onay dialogunu aç
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedUserId || !selectedHotelId) return;

    setIsRemoving(true);
    try {
      await hotelAssignmentService.removeUserFromHotel(selectedUserId, selectedHotelId);
      showNotification('User removed from hotel successfully', 'success');
      
      // Seçimleri sıfırla
      setSelectedUserId(null);
      setSelectedHotelId(null);
      setUserSearchTerm('');
      setHotelSearchTerm('');
      setIsConfirmDialogOpen(false);
    } catch (error: any) {
      console.error('Error removing user from hotel:', error);
      const errorMessage = error.message || 'Failed to remove user from hotel. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  // Kullanıcı ve otel listelerini filtrele
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );
  
  const filteredHotels = hotels.filter(hotel => 
    hotel.name?.toLowerCase().includes(hotelSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {notification.show && (
        <Alert className={`mb-4 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-white shadow-md max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Hotel User Assignment</CardTitle>
          <CardDescription>Assign or remove a user from a hotel</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
              <span>Loading data...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-gray-50 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Select 
                  value={selectedUserId?.toString() || ''} 
                  onValueChange={(value) => setSelectedUserId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <SelectItem value="no-results" disabled>No users found</SelectItem>
                    ) : filteredUsers.map((user) => (
                      <SelectItem key={user.userId} value={user.userId.toString()}>
                        {user.fullName} {user.email ? `(${user.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredUsers.length} users found
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hotel">Select Hotel</Label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search hotels..."
                    value={hotelSearchTerm}
                    onChange={(e) => setHotelSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-gray-50 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Select 
                  value={selectedHotelId?.toString() || ''} 
                  onValueChange={(value) => setSelectedHotelId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hotel" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {filteredHotels.length === 0 ? (
                      <SelectItem value="no-results" disabled>No hotels found</SelectItem>
                    ) : filteredHotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id.toString()}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredHotels.length} hotels found
                </p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button 
            onClick={handleAssignUser}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
            disabled={isLoading || isAssigning || !selectedUserId || !selectedHotelId}
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : 'Assign User to Hotel'}
          </Button>
          
          <Button 
            onClick={handleRemoveUser}
            className="bg-red-600 hover:bg-red-700 flex-1"
            disabled={isLoading || isRemoving || !selectedUserId || !selectedHotelId}
          >
            {isRemoving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove User from Hotel
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Onay Dialogu */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Removal</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-500">
              Are you sure you want to remove this user from the hotel? This action cannot be undone.
            </p>
            
            {selectedUserId && selectedHotelId && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p><strong>User:</strong> {filteredUsers.find(u => u.userId === selectedUserId)?.fullName || 'Unknown User'}</p>
                <p><strong>Hotel:</strong> {filteredHotels.find(h => h.id === selectedHotelId)?.name || 'Unknown Hotel'}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmRemove}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelAssignmentPage; 