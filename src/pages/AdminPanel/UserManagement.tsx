import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Search, UserPlus, X, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { userService, User, UserFormData } from '@/services/userService';

interface UserManagementProps {}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view' | 'delete' | 'add'>('view');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    phoneNumber: null,
    passwordHash: '',
    isActive: true
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Failed to fetch users. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = (data: UserFormData) => {
    const errors: {[key: string]: string} = {};
    
    if (!data.fullName || data.fullName.trim() === '') {
      errors.fullName = 'Name is required';
    }
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (modalMode === 'add' && (!data.passwordHash || data.passwordHash.length < 6)) {
      errors.passwordHash = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      passwordHash: '',
      isActive: user.isActive
    });
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      passwordHash: '',
      isActive: user.isActive
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: null,
      passwordHash: '',
      isActive: true
    });
    setFormErrors({});
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm(formData)) return;

    setIsLoading(true);
    try {
      if (modalMode === 'edit' && selectedUser) {
        // Update existing user
        console.log('Updating user with data:', formData);
        await userService.updateUser(selectedUser.userId, formData);
        showNotification('User updated successfully', 'success');
      } else if (modalMode === 'add') {
        // Create new user
        console.log('Creating user with data:', formData);
        
        // Kullanıcı ekleme için veri hazırlama
        const newUserData = {
          ...formData,
          // Boş string yerine null kullan
          phoneNumber: formData.phoneNumber === '' ? null : formData.phoneNumber,
          // Şifre kontrolü
          passwordHash: formData.passwordHash || ''
        };
        
        console.log('Prepared data for API:', newUserData);
        await userService.createUser(newUserData);
        showNotification('User created successfully', 'success');
      }
      
      // Refresh user list
      await fetchUsers();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving user:', error);
      // Daha detaylı hata mesajı göster
      let errorMessage = 'Failed to save user. Please try again.';
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await userService.deleteUser(selectedUser.userId);
      showNotification('User deleted successfully', 'success');
      
      // Refresh user list
      await fetchUsers();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error.message || 'Failed to delete user. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Helper function to check if modalMode is view
  const isViewMode = () => modalMode === 'view';

  return (
    <div className="p-6 space-y-6">
      {notification.show && (
        <Alert className={`mb-4 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">User Management</h3>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddNew}
              disabled={isLoading}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full bg-gray-50 border-gray-200 focus:border-blue-500"
            />
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-600">ID</TableHead>
                  <TableHead className="font-semibold text-gray-600">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600">Email</TableHead>
                  <TableHead className="font-semibold text-gray-600">Phone</TableHead>
                  <TableHead className="font-semibold text-gray-600">Registration Date</TableHead>
                  <TableHead className="font-semibold text-gray-600">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                        <span>Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.userId} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{user.userId}</TableCell>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell>{user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.isActive ? 'default' : 'secondary'}
                          className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleView(user)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(user)}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {modalMode === 'edit' ? 'Edit User' : 
               modalMode === 'view' ? 'User Details' : 
               modalMode === 'add' ? 'Add New User' :
               'Delete User'}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          {modalMode === 'delete' ? (
            <div className="space-y-4">
              <p className="text-gray-500">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : 'Delete'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                {selectedUser && isViewMode() && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">User ID</Label>
                    <div className="col-span-3">
                      <p className="text-gray-700">{selectedUser.userId}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right font-medium">Full Name</Label>
                  <div className="col-span-3">
                    {isViewMode() ? (
                      <p className="text-gray-700">{formData.fullName}</p>
                    ) : (
                      <>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          disabled={isViewMode() || isLoading}
                          className={formErrors.fullName ? 'border-red-500' : ''}
                        />
                        {formErrors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right font-medium">Email</Label>
                  <div className="col-span-3">
                    {isViewMode() ? (
                      <p className="text-gray-700">{formData.email}</p>
                    ) : (
                      <>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={isViewMode() || isLoading}
                          className={formErrors.email ? 'border-red-500' : ''}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right font-medium">Phone Number</Label>
                  <div className="col-span-3">
                    {isViewMode() ? (
                      <p className="text-gray-700">{formData.phoneNumber || '-'}</p>
                    ) : (
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value || null)}
                        disabled={isViewMode() || isLoading}
                        placeholder="Optional"
                      />
                    )}
                  </div>
                </div>
                
                {modalMode === 'add' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="passwordHash" className="text-right font-medium">Password</Label>
                    <div className="col-span-3">
                      <Input
                        id="passwordHash"
                        type="password"
                        value={formData.passwordHash || ''}
                        onChange={(e) => handleInputChange('passwordHash', e.target.value)}
                        disabled={isLoading}
                        className={formErrors.passwordHash ? 'border-red-500' : ''}
                      />
                      {formErrors.passwordHash && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.passwordHash}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(modalMode === 'edit' || modalMode === 'add') && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right font-medium">Status</Label>
                    <div className="col-span-3">
                      <Select 
                        value={formData.isActive ? 'active' : 'inactive'} 
                        onValueChange={(value) => handleInputChange('isActive', value === 'active')}
                        disabled={isViewMode() || isLoading}
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
                )}
                
                {isViewMode() && selectedUser?.registrationDate && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">Registration Date</Label>
                    <div className="col-span-3">
                      <p className="text-gray-700">
                        {new Date(selectedUser.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {(modalMode === 'edit' || modalMode === 'add') && (
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
