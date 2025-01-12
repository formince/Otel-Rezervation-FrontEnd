import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Rating,
  TextField,
} from '@mui/material'
import { FaWifi, FaParking, FaSwimmingPool, FaUtensils } from 'react-icons/fa'

const RoomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  // Mock data - gerçek uygulamada API'den gelecek
  const roomData = {
    id: 1,
    name: 'Deluxe Deniz Manzaralı Oda',
    description: 'Muhteşem deniz manzarası ve lüks konfora sahip geniş oda',
    price: 1500,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop'
    ],
    rating: 4.8,
    amenities: ['wifi', 'parking', 'pool', 'restaurant'],
    size: '45m²',
    capacity: '2 Yetişkin + 1 Çocuk',
    features: [
      'King Size Yatak',
      'Özel Balkon',
      'Mini Bar',
      'Klima',
      'Ücretsiz Wi-Fi',
      'LED TV'
    ]
  }

  const handleReservation = () => {
    if (!checkIn || !checkOut) {
      alert('Lütfen giriş ve çıkış tarihlerini seçin')
      return
    }
    // Rezervasyon işlemi burada yapılacak
    console.log('Rezervasyon yapıldı:', { checkIn, checkOut })
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
                  {roomData.features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{feature}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

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
                  <Rating value={roomData.rating} precision={0.5} readOnly />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {roomData.size} • {roomData.capacity}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Giriş Tarihi"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Çıkış Tarihi"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{ shrink: true }}
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