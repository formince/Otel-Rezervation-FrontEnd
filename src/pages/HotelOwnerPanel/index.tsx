import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material'

// Mock data for demonstration
const mockHotels = [
  {
    id: 1,
    name: 'The Grand Hotel',
    location: 'City Center, New York',
    description:
      'A luxury hotel in the heart of the city offering spectacular views and world-class amenities.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop',
    rooms: [
      {
        id: 1,
        type: 'Deluxe Room',
        price: 299,
        capacity: 2,
        available: true,
      },
      {
        id: 2,
        type: 'Executive Suite',
        price: 499,
        capacity: 3,
        available: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Seaside Resort', 
    location: 'Miami Beach, Florida',
    description:
      'A beachfront resort offering stunning ocean views and premium amenities.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
    rooms: [
      {
        id: 3,
        type: 'Ocean View Room',
        price: 399,
        capacity: 2,
        available: true,
      },
      {
        id: 4,
        type: 'Beach Suite',
        price: 599,
        capacity: 4,
        available: false,
      },
    ],
  },
]

interface HotelFormData {
  name: string
  location: string
  description: string
  image: string
}

interface RoomFormData {
  type: string
  price: number
  capacity: number
  available: boolean
}

const initialHotelForm: HotelFormData = {
  name: '',
  location: '',
  description: '',
  image: '',
}

const initialRoomForm: RoomFormData = {
  type: '',
  price: 0,
  capacity: 1,
  available: true,
}

const HotelOwnerPanel = () => {
  const [hotels, setHotels] = useState(mockHotels)
  const [openHotelDialog, setOpenHotelDialog] = useState(false)
  const [openRoomDialog, setOpenRoomDialog] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [hotelForm, setHotelForm] = useState<HotelFormData>(initialHotelForm)
  const [roomForm, setRoomForm] = useState<RoomFormData>(initialRoomForm)

  const handleAddHotel = () => {
    setSelectedHotel(null)
    setHotelForm(initialHotelForm)
    setOpenHotelDialog(true)
  }

  const handleEditHotel = (hotelId: number) => {
    const hotel = hotels.find((h) => h.id === hotelId)
    if (hotel) {
      setSelectedHotel(hotelId)
      setHotelForm({
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        image: hotel.image,
      })
      setOpenHotelDialog(true)
    }
  }

  const handleAddRoom = (hotelId: number) => {
    setSelectedHotel(hotelId)
    setSelectedRoom(null)
    setRoomForm(initialRoomForm)
    setOpenRoomDialog(true)
  }

  const handleEditRoom = (hotelId: number, roomId: number) => {
    const hotel = hotels.find((h) => h.id === hotelId)
    const room = hotel?.rooms.find((r) => r.id === roomId)
    if (room) {
      setSelectedHotel(hotelId)
      setSelectedRoom(roomId)
      setRoomForm({
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        available: room.available,
      })
      setOpenRoomDialog(true)
    }
  }

  const handleDeleteHotel = (hotelId: number) => {
    setHotels(hotels.filter((hotel) => hotel.id !== hotelId))
  }

  const handleDeleteRoom = (hotelId: number, roomId: number) => {
    setHotels(
      hotels.map((hotel) => {
        if (hotel.id === hotelId) {
          return {
            ...hotel,
            rooms: hotel.rooms.filter((room) => room.id !== roomId),
          }
        }
        return hotel
      })
    )
  }

  const handleSaveHotel = () => {
    if (selectedHotel) {
      // Edit existing hotel
      setHotels(
        hotels.map((hotel) => {
          if (hotel.id === selectedHotel) {
            return {
              ...hotel,
              ...hotelForm,
            }
          }
          return hotel
        })
      )
    } else {
      // Add new hotel
      const newHotel = {
        id: Math.max(...hotels.map((h) => h.id)) + 1,
        ...hotelForm,
        rooms: [],
      }
      setHotels([...hotels, newHotel])
    }
    setOpenHotelDialog(false)
  }

  const handleSaveRoom = () => {
    if (selectedHotel) {
      setHotels(
        hotels.map((hotel) => {
          if (hotel.id === selectedHotel) {
            if (selectedRoom) {
              // Edit existing room
              return {
                ...hotel,
                rooms: hotel.rooms.map((room) => {
                  if (room.id === selectedRoom) {
                    return {
                      ...room,
                      ...roomForm,
                    }
                  }
                  return room
                }),
              }
            } else {
              // Add new room
              const newRoom = {
                id: Math.max(...hotel.rooms.map((r) => r.id)) + 1,
                ...roomForm,
              }
              return {
                ...hotel,
                rooms: [...hotel.rooms, newRoom],
              }
            }
          }
          return hotel
        })
      )
    }
    setOpenRoomDialog(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, mt: 8 }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 6, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        borderRadius: 3,
        p: 4,
        color: 'white'
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Otel Yönetimi
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleAddHotel}
          sx={{
            backgroundColor: 'white',
            color: '#1a237e',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontWeight: 'bold'
          }}
        >
          Yeni Otel Ekle
        </Button>
      </Box>

      {/* Hotels Grid */}
      <Grid container spacing={4}>
        {hotels.map((hotel) => (
          <Grid item xs={12} key={hotel.id}>
            <Card sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={hotel.image}
                    alt={hotel.name}
                    sx={{ objectFit: 'cover' }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 3
                    }}>
                      <div>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                          {hotel.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {hotel.location}
                        </Typography>
                      </div>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditHotel(hotel.id)}
                          sx={{ 
                            mr: 1,
                            '&:hover': { backgroundColor: '#e3f2fd' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteHotel(hotel.id)}
                          sx={{ '&:hover': { backgroundColor: '#ffebee' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="body1" paragraph sx={{ color: '#546e7a' }}>
                      {hotel.description}
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                      }}>
                        <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                          Odalar
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddRoom(hotel.id)}
                          sx={{
                            borderColor: '#1a237e',
                            color: '#1a237e',
                            '&:hover': {
                              borderColor: '#0d47a1',
                              backgroundColor: '#e3f2fd'
                            }
                          }}
                        >
                          Oda Ekle
                        </Button>
                      </Box>

                      <Grid container spacing={3}>
                        {hotel.rooms.map((room) => (
                          <Grid item xs={12} sm={6} key={room.id}>
                            <Paper sx={{ 
                              p: 3,
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              transition: 'transform 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                              }
                            }}>
                              <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                              }}>
                                <div>
                                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
                                    {room.type}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Kapasite: {room.capacity} kişi
                                  </Typography>
                                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                    ${room.price}/gece
                                  </Typography>
                                  <Chip
                                    label={room.available ? 'Müsait' : 'Dolu'}
                                    color={room.available ? 'success' : 'default'}
                                    size="small"
                                    sx={{ mt: 1 }}
                                  />
                                </div>
                                <Box>
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEditRoom(hotel.id, room.id)}
                                    sx={{ 
                                      mr: 1,
                                      '&:hover': { backgroundColor: '#e3f2fd' }
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteRoom(hotel.id, room.id)}
                                    sx={{ '&:hover': { backgroundColor: '#ffebee' } }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Hotel Dialog */}
      <Dialog
        open={openHotelDialog}
        onClose={() => setOpenHotelDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1a237e',
          color: 'white',
          py: 2
        }}>
          {selectedHotel ? 'Oteli Düzenle' : 'Yeni Otel Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Otel Adı"
              fullWidth
              value={hotelForm.name}
              onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Konum"
              fullWidth
              value={hotelForm.location}
              onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Açıklama"
              fullWidth
              multiline
              rows={4}
              value={hotelForm.description}
              onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Resim URL"
              fullWidth
              value={hotelForm.image}
              onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenHotelDialog(false)}
            sx={{ 
              color: '#1a237e',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleSaveHotel} 
            variant="contained" 
            sx={{
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' },
              px: 3
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Dialog */}
      <Dialog
        open={openRoomDialog}
        onClose={() => setOpenRoomDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1a237e',
          color: 'white',
          py: 2
        }}>
          {selectedRoom ? 'Odayı Düzenle' : 'Yeni Oda Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Oda Tipi"
              fullWidth
              value={roomForm.type}
              onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Fiyat"
              type="number"
              fullWidth
              value={roomForm.price}
              onChange={(e) => setRoomForm({ ...roomForm, price: Number(e.target.value) })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Kapasite"
              type="number"
              fullWidth
              value={roomForm.capacity}
              onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel>Durum</InputLabel>
              <Select
                value={roomForm.available ? "true" : "false"}
                label="Durum"
                onChange={(e) => setRoomForm({ ...roomForm, available: e.target.value === "true" })}
              >
                <MenuItem value="true">Müsait</MenuItem>
                <MenuItem value="false">Dolu</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenRoomDialog(false)}
            sx={{ 
              color: '#1a237e',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleSaveRoom} 
            variant="contained" 
            sx={{
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' },
              px: 3
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default HotelOwnerPanel 