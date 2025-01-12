import React, { useState } from 'react';
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
import { Eye, Pencil, Trash2, Search, UserPlus, X } from 'lucide-react';
import { User, mockUsers } from '@/data/mockUsers';
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

interface UserManagementProps {}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view' | 'delete' | 'add'>('view');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = (user: Partial<User>) => {
    const errors: {[key: string]: string} = {};
    
    if (!user.name || user.name.trim() === '') {
      errors.name = 'Name is required';
    }
    
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (!user.role) {
      errors.role = 'Role is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser({
      id: Date.now(), // Temporary ID
      name: '',
      email: '',
      role: 'user', // Default role to resolve type issue
      joinDate: new Date().toISOString(),
      status: 'active'
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedUser) return;

    if (!validateForm(selectedUser)) return;

    if (modalMode === 'edit') {
      setUsers(users.map(user =>
        user.id === selectedUser.id ? selectedUser : user
      ));
    } else if (modalMode === 'add') {
      setUsers([...users, selectedUser]);
    }
    
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsModalOpen(false);
    }
  };

  const updateUserField = (field: keyof User, value: string) => {
    if (selectedUser) {
      setSelectedUser({...selectedUser, [field]: value});
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (value: string) => {
    if (selectedUser) {
      updateUserField('role', value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (selectedUser) {
      updateUserField('status', value);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">User Management</h3>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddNew}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full bg-gray-50 border-gray-200 focus:border-blue-500"
            />
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-600">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600">Email</TableHead>
                  <TableHead className="font-semibold text-gray-600">Role</TableHead>
                  <TableHead className="font-semibold text-gray-600">Join Date</TableHead>
                  <TableHead className="font-semibold text-gray-600">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {user.status}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
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
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      value={selectedUser?.name || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateUserField('name', e.target.value)}
                      disabled={modalMode === 'view'}
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <div className="col-span-3">
                    <Input
                      id="email"
                      type="email"
                      value={selectedUser?.email || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateUserField('email', e.target.value)}
                      disabled={modalMode === 'view'}
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <div className="col-span-3">
                    <Select 
                      value={selectedUser?.role || ''} 
                      onValueChange={handleRoleChange}
                      disabled={modalMode === 'view'}
                    >
                      <SelectTrigger className={formErrors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <div className="col-span-3">
                    <Select 
                      value={selectedUser?.status || 'active'} 
                      onValueChange={handleStatusChange}
                      disabled={modalMode === 'view'}
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
              </div>
              {(modalMode === 'edit' || modalMode === 'add') && (
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
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
