import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  TextField,
  Divider,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const RoomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(1)

  // Mock data - gerçek uygulamada API'den gelecek
  const roomData = {
    id: 1,
    name: 'Deluxe Deniz Manzaralı Oda',
    description: 'Boğaz manzaralı, lüks döşenmiş geniş oda',
    price: 2500,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1974&auto=format&fit=crop'
    ],
    size: '45m²',
    maxGuests: 2,
    amenities: [
      'King Size Yatak',
      'Özel Balkon',
      'Mini Bar',
      'Klima',
      'Ücretsiz Wi-Fi',
      'LED TV',
      'Deniz Manzarası',
      'Özel Banyo'
    ]
  }

  const handleReservation = () => {
    if (!checkIn || !checkOut) {
      alert('Lütfen giriş ve çıkış tarihlerini seçin')
      return
    }
    // Rezervasyon işlemi burada yapılacak
    console.log('Rezervasyon yapıldı:', { checkIn, checkOut, guests })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pt: 12, pb: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            {/* Sol Taraf - Oda Bilgileri */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                {roomData.name}
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <img
                  src={roomData.images[0]}
                  alt={roomData.name}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Oda Özellikleri
                </Typography>
                <Grid container spacing={2}>
                  {roomData.amenities.map((amenity, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{amenity}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Oda Hakkında
                </Typography>
                <Typography paragraph>
                  {roomData.description}
                </Typography>
              </Box>
            </Grid>

            {/* Sağ Taraf - Rezervasyon Formu */}
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                  ₺{roomData.price}
                  <Typography component="span" variant="body1" color="text.secondary">
                    /gece
                  </Typography>
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {roomData.size} • Maksimum {roomData.maxGuests} Misafir
                  </Typography>
                </Box>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ mb: 3 }}>
                    <DatePicker
                      label="Giriş Tarihi"
                      value={checkIn}
                      onChange={(newValue) => setCheckIn(newValue)}
                      sx={{ width: '100%', mb: 2 }}
                    />
                    <DatePicker
                      label="Çıkış Tarihi"
                      value={checkOut}
                      onChange={(newValue) => setCheckOut(newValue)}
                      sx={{ width: '100%' }}
                    />
                  </Box>
                </LocalizationProvider>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Misafir Sayısı"
                    value={guests}
                    onChange={(e) => setGuests(Math.min(roomData.maxGuests, Math.max(1, parseInt(e.target.value))))}
                    InputProps={{ inputProps: { min: 1, max: roomData.maxGuests } }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleReservation}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Rezervasyon Yap
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

export default RoomDetail 