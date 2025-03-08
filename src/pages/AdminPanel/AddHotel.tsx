import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

interface HotelFormData {
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
}

const AddHotel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    location: '',
    description: '',
    latitude: 0,
    longitude: 0,
    images: []
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dibsxfpzx';
  const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '179239479323255';
  const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'zui6wKpuiVbUmfRHEofjgXvFf18';
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Google Maps API yükleme
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    // Google Maps API'si yüklü değilse yükle
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeAutocomplete();
    }
  }, [GOOGLE_MAPS_API_KEY]);

  const initializeAutocomplete = () => {
    if (!window.google || !document.getElementById('location-input')) return;

    const input = document.getElementById('location-input') as HTMLInputElement;
    const autocomplete = new window.google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setFormData({
        ...formData,
        location: place.formatted_address || input.value,
        latitude: lat,
        longitude: lng
      });
      setCoordinates({ lat, lng });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Önizleme URL'lerini oluştur
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Önizleme URL'ini serbest bırak
    URL.revokeObjectURL(previewUrls[index]);
    
    // Dizilerden kaldır
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const timestamp = String(Math.round(new Date().getTime() / 1000));
    const str_to_sign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = CryptoJS.SHA1(str_to_sign).toString();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    
    try {
      console.log('Cloudinary\'ye gönderilen veriler:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
        timestamp,
        signature
      });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Cloudinary yanıtı:', response.data);
      return response.data.secure_url;
    } catch (error: any) {
      console.error('Cloudinary yükleme hatası:', error);
      
      // Detaylı hata mesajları
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error('Detaylı hata bilgisi:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: responseData,
        });
      }
      
      throw new Error('Görsel yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.name.trim()) {
      toast.error('Otel adı gereklidir');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Konum bilgisi gereklidir');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Açıklama gereklidir');
      return;
    }
    if (formData.latitude === 0 && formData.longitude === 0) {
      toast.error('Geçerli bir konum seçiniz');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('En az bir otel görseli ekleyiniz');
      return;
    }

    try {
      setLoading(true);
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      // Önce tüm resimleri Cloudinary'ye yükle
      const uploadedImageUrls = [];
      for (const file of selectedFiles) {
        try {
          const url = await uploadToCloudinary(file);
          uploadedImageUrls.push(url);
        } catch (error) {
          console.error(`${file.name} yüklenirken hata:`, error);
          toast.error(`${file.name} yüklenirken hata oluştu`);
        }
      }

      if (uploadedImageUrls.length === 0) {
        toast.error('Hiçbir görsel yüklenemedi. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      // API'ye gönderilecek veriyi hazırla
      const submitData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        latitude: coordinates?.lat || formData.latitude,
        longitude: coordinates?.lng || formData.longitude,
        images: uploadedImageUrls
      };

      console.log('Gönderilen hotel verileri:', submitData);

      // Otel ekleme isteği
      const response = await axios.post(
        `${API_BASE_URL}/AdminHotel`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Hotel add response:', response.data);
      toast.success('Otel başarıyla eklendi');
      
      // Oteller sayfasına geri dön
      navigate('/admin/hotels');
    } catch (error: any) {
      console.error('Error adding hotel:', error);
      
      // Hata mesajlarını göster
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        } else if (status === 403) {
          toast.error('Bu işlemi yapmaya yetkiniz yok.');
        } else {
          toast.error(error.response.data?.message || 'Otel eklenirken bir hata oluştu');
        }
      } else {
        toast.error('Otel eklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={() => navigate('/admin/hotels')} 
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Yeni Otel Ekle
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Otel Adı"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="location-input"
                label="Konum"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                placeholder="Google Maps'ten konum seçin"
              />
              {coordinates && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Konum seçildi: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Otel Görselleri
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Görsel Seç
                </Button>
              </label>

              {previewUrls.length > 0 && (
                <ImageList sx={{ maxHeight: 300 }} cols={3} rowHeight={160}>
                  {previewUrls.map((url, index) => (
                    <ImageListItem key={index} sx={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        loading="lazy"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                        }}
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 5 }
                }}
              >
                {loading ? 'Kaydediliyor...' : 'Oteli Kaydet'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

declare global {
  interface Window {
    google: any;
  }
}

export default AddHotel; 