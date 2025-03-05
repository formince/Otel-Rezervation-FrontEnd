import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// Icons
import { 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaBed, 
  FaRegClock,
  FaTimesCircle,
  FaCheckCircle,
  FaHotel,
  FaMapMarkerAlt
} from 'react-icons/fa';

// Styles
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Types
interface Reservation {
  id: number;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  latitude: number;
  longitude: number;
}

interface ReservationsResponse {
  reservations: Reservation[];
}

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Get API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    fetchReservations();
  }, [userId, navigate]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ReservationsResponse>(
        `${API_BASE_URL}/ReservationGetUser/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setReservations(response.data.reservations);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Rezervasyonlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      setCancelLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/ReservationGetUser/cancel/${selectedReservation.id}`, null, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Rezervasyonunuz başarıyla iptal edildi.');
      setOpenDialog(false);
      // Rezervasyon listesini güncelle
      fetchReservations();
    } catch (error: any) {
      if (error.response?.status === 401 && !localStorage.getItem('token')) {
        toast.error('Bu işlemi gerçekleştirmek için giriş yapmanız gerekmektedir.');
        navigate('/login');
      } else if (error.response?.data) {
        // API'den gelen hata mesajını göster
        toast.error(error.response.data.message || 'Rezervasyon iptal edilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } else {
        toast.error('Rezervasyon iptal edilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
      console.error('Rezervasyon iptal hatası:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const openCancelDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'Onaylandı';
      case 'Pending':
        return 'Beklemede';
      case 'Cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <FaCheckCircle color="#2e7d32" />;
      case 'Pending':
        return <FaRegClock color="#ed6c02" />;
      case 'Cancelled':
        return <FaTimesCircle color="#d32f2f" />;
      default:
        return null;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    return differenceInDays(new Date(checkOut), new Date(checkIn));
  };

  const filteredReservations = reservations.filter(reservation => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return reservation.status !== 'Cancelled';
    if (activeFilter === 'cancelled') return reservation.status === 'Cancelled';
    if (activeFilter === 'upcoming') {
      return reservation.status !== 'Cancelled' && new Date(reservation.checkInDate) > new Date();
    }
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 1
          }}
        >
          Rezervasyonlarım
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }}>
          Tüm rezervasyonlarınızı buradan görüntüleyebilir ve yönetebilirsiniz.
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, flexWrap: 'wrap', gap: 1 }}>
        <Button 
          variant={activeFilter === 'all' ? 'contained' : 'outlined'}
          onClick={() => setActiveFilter('all')}
          sx={{ borderRadius: '20px', px: 3 }}
        >
          Tümü
        </Button>
        <Button 
          variant={activeFilter === 'active' ? 'contained' : 'outlined'}
          onClick={() => setActiveFilter('active')}
          color="success"
          sx={{ borderRadius: '20px', px: 3 }}
        >
          Aktif
        </Button>
        <Button 
          variant={activeFilter === 'upcoming' ? 'contained' : 'outlined'}
          onClick={() => setActiveFilter('upcoming')}
          color="info"
          sx={{ borderRadius: '20px', px: 3 }}
        >
          Yaklaşan
        </Button>
        <Button 
          variant={activeFilter === 'cancelled' ? 'contained' : 'outlined'}
          onClick={() => setActiveFilter('cancelled')}
          color="error"
          sx={{ borderRadius: '20px', px: 3 }}
        >
          İptal Edilenler
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px'
          }}
        >
          <FaTimesCircle size={40} style={{ marginBottom: '16px' }} />
          <Typography variant="h6" align="center">{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => fetchReservations()}
          >
            Tekrar Dene
          </Button>
        </Paper>
      ) : reservations.length === 0 ? (
        <Paper 
          elevation={3}
          sx={{ 
            p: 5, 
            borderRadius: 3,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)'
          }}
        >
          <FaHotel size={60} style={{ marginBottom: '24px', opacity: 0.7 }} />
          <Typography variant="h5" gutterBottom>Henüz bir rezervasyonunuz bulunmamaktadır.</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '500px' }}>
            Mükemmel bir tatil deneyimi için hemen otel aramaya başlayın ve ilk rezervasyonunuzu oluşturun.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              mt: 2, 
              borderRadius: '30px', 
              px: 4, 
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
            }}
            onClick={() => navigate('/')}
          >
            Otel Ara
          </Button>
        </Paper>
      ) : filteredReservations.length === 0 ? (
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>Bu filtreye uygun rezervasyon bulunamadı.</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => setActiveFilter('all')}
          >
            Tüm Rezervasyonları Göster
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredReservations.map((reservation) => {
            const nights = calculateNights(reservation.checkInDate, reservation.checkOutDate);
            return (
              <Grid item xs={12} key={reservation.id}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    },
                    position: 'relative'
                  }}
                >
                  {/* Status Badge */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 20, 
                      right: 20, 
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: reservation.status === 'Confirmed' ? 'rgba(46, 125, 50, 0.9)' : 
                               reservation.status === 'Pending' ? 'rgba(237, 108, 2, 0.9)' : 
                               'rgba(211, 47, 47, 0.9)',
                      color: 'white',
                      py: 0.75,
                      px: 2,
                      borderRadius: '20px',
                      boxShadow: 2
                    }}
                  >
                    {getStatusIcon(reservation.status)}
                    <Typography variant="body2" fontWeight="bold">
                      {getStatusText(reservation.status)}
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 0 }}>
                    <Grid container>
                      {/* Left Side - Hotel Info */}
                      <Grid item xs={12} md={8} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              width: 50, 
                              height: 50,
                              mr: 2
                            }}
                          >
                            <FaBed size={24} />
                          </Avatar>
                          <Typography variant="h5" component="h2" fontWeight="bold">
                            {reservation.hotelName}
                          </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <FaCalendarAlt color="#1976d2" style={{ marginRight: '8px' }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Giriş Tarihi
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {formatDate(reservation.checkInDate)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <FaCalendarAlt color="#1976d2" style={{ marginRight: '8px' }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Çıkış Tarihi
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {formatDate(reservation.checkOutDate)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex' }}>
                            <Chip 
                              label={`${nights} Gece`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ mr: 1, borderRadius: '16px' }}
                            />
                            <Chip 
                              label="Konaklama" 
                              size="small" 
                              color="default" 
                              variant="outlined"
                              sx={{ borderRadius: '16px' }}
                            />
                          </Box>
                          
                          {/* Location Button - Relocated here */}
                          {reservation.latitude && reservation.longitude && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              sx={{ 
                                borderRadius: '10px',
                                ml: 1,
                                fontWeight: 500,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(25, 118, 210, 0.15)'
                                }
                              }}
                              startIcon={<FaMapMarkerAlt />}
                              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.hotelName)}`, '_blank')}
                            >
                              Google Maps'te Ara
                            </Button>
                          )}
                        </Box>
                      </Grid>

                      {/* Right Side - Price & Actions */}
                      <Grid 
                        item 
                        xs={12} 
                        md={4} 
                        sx={{ 
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderLeft: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.1)' },
                          borderTop: { xs: '1px solid rgba(0, 0, 0, 0.1)', md: 'none' }
                        }}
                      >
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FaMoneyBillWave color="#2e7d32" style={{ marginRight: '8px' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Toplam Tutar
                              </Typography>
                              <Typography variant="h6" fontWeight="bold" color="primary.main">
                                {reservation.totalPrice.toLocaleString('tr-TR')} ₺
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {reservation.status !== 'Cancelled' && 
                         !(reservation.status === 'Confirmed' && new Date(reservation.checkOutDate) < new Date()) && (
                          <Button 
                            variant="outlined" 
                            color="error"
                            fullWidth
                            startIcon={<FaTimesCircle />}
                            onClick={() => openCancelDialog(reservation)}
                            sx={{ 
                              mt: 2, 
                              borderRadius: '8px',
                              py: 1
                            }}
                          >
                            Rezervasyonu İptal Et
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">Rezervasyon İptali</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedReservation && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">
                  <strong>{selectedReservation.hotelName}</strong> için olan rezervasyonunuzu iptal etmek istediğinize emin misiniz?
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Giriş Tarihi</Typography>
                      <Typography variant="body1">{formatDate(selectedReservation.checkInDate)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Çıkış Tarihi</Typography>
                      <Typography variant="body1">{formatDate(selectedReservation.checkOutDate)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Toplam Tutar</Typography>
                      <Typography variant="body1" fontWeight="bold">{selectedReservation.totalPrice.toLocaleString('tr-TR')} ₺</Typography>
                    </Grid>
                    {selectedReservation.latitude && selectedReservation.longitude && (
                      <Grid item xs={12} sx={{ mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          startIcon={<FaMapMarkerAlt />}
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedReservation.hotelName)}`, '_blank')}
                          fullWidth
                          sx={{ borderRadius: '8px' }}
                        >
                          Google Maps'te Ara
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                  * İptal işlemi geri alınamaz. İptal koşulları ve iade politikası için lütfen otel ile iletişime geçin.
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Vazgeç
          </Button>
          <Button 
            onClick={handleCancelReservation} 
            color="error" 
            variant="contained"
            disabled={cancelLoading}
            sx={{ 
              borderRadius: '8px',
              position: 'relative'
            }}
          >
            {cancelLoading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'error.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
                <span style={{ visibility: 'hidden' }}>İptal Et</span>
              </>
            ) : (
              'İptal Et'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reservations; 