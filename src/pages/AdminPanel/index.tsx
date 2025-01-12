import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { 
  HotelIcon, 
  UsersIcon, 
  DollarSignIcon, 
  ActivityIcon 
} from 'lucide-react';

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'hotel_owner',
    status: 'active',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'admin',
    status: 'active',
  },
]

const mockPendingHotels = [
  {
    id: 1,
    name: 'Luxury Palace Hotel',
    owner: 'Jane Smith',
    location: 'Paris, France',
    status: 'pending',
    submittedDate: '2024-02-15',
  },
  {
    id: 2,
    name: 'Mountain View Resort',
    owner: 'Robert Brown',
    location: 'Swiss Alps',
    status: 'pending',
    submittedDate: '2024-02-14',
  },
]

// Mock data for charts
const hotelData = [
  { name: 'Ocak', oteller: 40 },
  { name: 'Şubat', oteller: 30 },
  { name: 'Mart', oteller: 50 },
  { name: 'Nisan', oteller: 45 },
  { name: 'Mayıs', oteller: 60 },
  { name: 'Haziran', oteller: 55 },
];

const userData = [
  { name: 'Ocak', kullanıcılar: 400 },
  { name: 'Şubat', kullanıcılar: 300 },
  { name: 'Mart', kullanıcılar: 500 },
  { name: 'Nisan', kullanıcılar: 450 },
  { name: 'Mayıs', kullanıcılar: 600 },
  { name: 'Haziran', kullanıcılar: 550 },
];

const gelirData = [
  { name: 'Ocak', gelir: 4000 },
  { name: 'Şubat', gelir: 3000 },
  { name: 'Mart', gelir: 5000 },
  { name: 'Nisan', gelir: 4500 },
  { name: 'Mayıs', gelir: 6000 },
  { name: 'Haziran', gelir: 5500 },
];

const otelStatusData = [
  { name: 'Aktif', value: 400 },
  { name: 'Askıda', value: 300 },
  { name: 'Beklemede', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminPanel = () => {
  const [users, setUsers] = useState(mockUsers)
  const [pendingHotels, setPendingHotels] = useState(mockPendingHotels)
  const [openUserDialog, setOpenUserDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  const handleEditUser = (userId: number) => {
    setSelectedUser(userId)
    setOpenUserDialog(true)
  }

  const handleApproveHotel = (hotelId: number) => {
    setPendingHotels((prev) =>
      prev.filter((hotel) => hotel.id !== hotelId)
    )
  }

  const handleRejectHotel = (hotelId: number) => {
    setPendingHotels((prev) =>
      prev.filter((hotel) => hotel.id !== hotelId)
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* User Management Section */}
        

        

        {/* Dashboard Section */}
        <Grid item xs={12}>
          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Yönetim Paneli</h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Otel Sayısı Kartı */}
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                <HotelIcon className="w-12 h-12 text-blue-500 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold">Toplam Otel Sayısı</h2>
                  <p className="text-2xl font-bold text-gray-700">120</p>
                </div>
              </div>

              {/* Kullanıcı Sayısı Kartı */}
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                <UsersIcon className="w-12 h-12 text-green-500 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold">Toplam Kullanıcı</h2>
                  <p className="text-2xl font-bold text-gray-700">1,250</p>
                </div>
              </div>

              {/* Gelir Kartı */}
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                <DollarSignIcon className="w-12 h-12 text-purple-500 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold">Toplam Gelir</h2>
                  <p className="text-2xl font-bold text-gray-700">₺250,000</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* Otel Sayısı Grafiği */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Aylık Otel Sayısı</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hotelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="oteller" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Kullanıcı Sayısı Grafiği */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Aylık Kullanıcı Sayısı</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="kullanıcılar" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Otel Durumu Pasta Grafiği */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Otel Durumları</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={otelStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} %${(percent * 100).toFixed(0)}`}
                    >
                      {otelStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Edit User Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Name" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" type="email" />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role">
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="hotel_owner">Hotel Owner</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminPanel