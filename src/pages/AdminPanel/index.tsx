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
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                User Management
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role.replace('_', ' ')}
                            color={
                              user.role === 'admin'
                                ? 'error'
                                : user.role === 'hotel_owner'
                                ? 'warning'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Hotel Approvals Section */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Pending Hotel Approvals
              </Typography>
              <Grid container spacing={3}>
                {pendingHotels.map((hotel) => (
                  <Grid item xs={12} md={6} key={hotel.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {hotel.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Owner: {hotel.owner}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Location: {hotel.location}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Submitted: {hotel.submittedDate}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={() => handleRejectHotel(hotel.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => handleApproveHotel(hotel.id)}
                          >
                            Approve
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
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