import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Rating,
  Divider,
  ImageList,
  ImageListItem,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Pool,
  Spa,
  Restaurant,
  Wifi,
  LocalParking,
  FitnessCenter,
} from '@mui/icons-material'

// Mock data for demonstration
const hotelData = {
  name: 'The Grand Hotel',
  rating: 4.8,
  reviews: 245,
  location: 'City Center, New York',
  description:
    'Experience luxury at its finest in the heart of the city. Our hotel offers spectacular views, world-class amenities, and unparalleled service.',
  images: [
    'https://source.unsplash.com/800x600/?hotel-room',
    'https://source.unsplash.com/800x600/?hotel-lobby',
    'https://source.unsplash.com/800x600/?hotel-pool',
    'https://source.unsplash.com/800x600/?hotel-restaurant',
    'https://source.unsplash.com/800x600/?hotel-spa',
    'https://source.unsplash.com/800x600/?hotel-gym',
  ],
  amenities: [
    { icon: <Pool />, name: 'Swimming Pool' },
    { icon: <Spa />, name: 'Spa & Wellness' },
    { icon: <Restaurant />, name: 'Restaurant' },
    { icon: <Wifi />, name: 'Free WiFi' },
    { icon: <LocalParking />, name: 'Parking' },
    { icon: <FitnessCenter />, name: 'Fitness Center' },
  ],
  rooms: [
    {
      id: 1,
      name: 'Deluxe Room',
      size: '35m²',
      price: 299,
      features: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar'],
    },
    {
      id: 2,
      name: 'Executive Suite',
      size: '55m²',
      price: 499,
      features: [
        'King Bed',
        'Living Room',
        'City View',
        'Free WiFi',
        'Mini Bar',
        'Bathtub',
      ],
    },
    {
      id: 3,
      name: 'Presidential Suite',
      size: '90m²',
      price: 899,
      features: [
        'King Bed',
        'Living Room',
        'Dining Area',
        'Panoramic View',
        'Free WiFi',
        'Mini Bar',
        'Jacuzzi',
      ],
    },
  ],
}

const HotelDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Gallery Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          component="img"
          src={hotelData.images[selectedImage]}
          alt="Hotel"
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 2,
          }}
        />
        <ImageList cols={6} rowHeight={100} gap={8}>
          {hotelData.images.map((image, index) => (
            <ImageListItem
              key={index}
              sx={{
                cursor: 'pointer',
                opacity: selectedImage === index ? 1 : 0.7,
                '&:hover': { opacity: 1 },
              }}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`Gallery ${index + 1}`} />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* Overview Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {hotelData.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={hotelData.rating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {hotelData.rating} ({hotelData.reviews} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            {hotelData.location}
          </Typography>
          <Typography variant="body1" paragraph>
            {hotelData.description}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Amenities
          </Typography>
          <List>
            <Grid container spacing={2}>
              {hotelData.amenities.map((amenity, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <ListItem>
                    <ListItemIcon>{amenity.icon}</ListItemIcon>
                    <ListItemText primary={amenity.name} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
        </Grid>

        {/* Room Options */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Available Rooms
          </Typography>
          <Grid container spacing={3}>
            {hotelData.rooms.map((room) => (
              <Grid item xs={12} key={room.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                          {room.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Room Size: {room.size}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {room.features.map((feature, index) => (
                            <Chip
                              key={index}
                              label={feature}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
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
                          ${room.price}
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {' '}
                            per night
                          </Typography>
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                        >
                          Book Now
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HotelDetails 