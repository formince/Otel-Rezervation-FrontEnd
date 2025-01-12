import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material'
import { Person, Hotel, Stars, Settings } from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

// Mock data for demonstration
const mockReservations = [
  {
    id: 1,
    hotelName: 'The Grand Hotel',
    checkIn: '2024-03-15',
    checkOut: '2024-03-20',
    status: 'upcoming',
    roomType: 'Deluxe Room',
    price: 1495,
  },
  {
    id: 2,
    hotelName: 'Seaside Resort',
    checkIn: '2024-02-01',
    checkOut: '2024-02-05',
    status: 'completed',
    roomType: 'Ocean View Suite',
    price: 996,
  },
]

const UserAccount = () => {
  const [tabValue, setTabValue] = useState(0)
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleProfileUpdate = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle profile update logic here
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since 2024
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="account tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} label="Profile" />
              <Tab icon={<Hotel />} label="Reservations" />
              <Tab icon={<Stars />} label="Points" />
              <Tab icon={<Settings />} label="Settings" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <form onSubmit={handleProfileUpdate}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {mockReservations.map((reservation) => (
                  <Grid item xs={12} key={reservation.id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              {reservation.hotelName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {reservation.roomType}
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Chip
                                label={reservation.status}
                                color={
                                  reservation.status === 'upcoming'
                                    ? 'primary'
                                    : 'default'
                                }
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2">
                              Check-in: {reservation.checkIn}
                            </Typography>
                            <Typography variant="body2">
                              Check-out: {reservation.checkOut}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: { xs: 'flex-start', sm: 'flex-end' },
                            }}
                          >
                            <Typography variant="h6" color="primary">
                              ${reservation.price}
                            </Typography>
                            {reservation.status === 'upcoming' && (
                              <Button
                                variant="outlined"
                                color="primary"
                                sx={{ mt: 2 }}
                              >
                                Modify Booking
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                  1,250
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Reward Points
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  You're just 750 points away from your next free night!
                </Typography>
                <Button variant="contained" color="primary">
                  View Rewards Catalog
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Notification Preferences
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Privacy Settings
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserAccount 