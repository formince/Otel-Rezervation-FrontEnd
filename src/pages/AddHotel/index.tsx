import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  ImageList,
  ImageListItem,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { LoadScript } from '@react-google-maps/api';
import CryptoJS from 'crypto-js';

interface HotelFormData {
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  images: File[];
}

const libraries: ("places")[] = ["places"];

const initialFormData: HotelFormData = {
  name: '',
  description: '',
  location: '',
  latitude: 0,
  longitude: 0,
  images: []
};

const generateSignature = (timestamp: string) => {
  const str = `timestamp=${timestamp}${import.meta.env.VITE_CLOUDINARY_API_SECRET}`;
  return CryptoJS.SHA1(str).toString();
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const timestamp = String(Math.round(new Date().getTime() / 1000));
  const signature = generateSignature(timestamp);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  
  try {
    console.log('Cloudinary yükleme başlıyor:', {
      fileName: file.name,
      fileSize: file.size,
      timestamp,
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    });

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Cloudinary yanıtı:', response.data);
    
    if (!response.data?.secure_url) {
      console.error('Cloudinary yanıt detayı:', response.data);
      throw new Error('Resim URL\'i alınamadı');
    }

    return response.data.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Cloudinary hata detayı:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.error?.message
      });
    }
    throw error;
  }
};

const AddHotel: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HotelFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Konum kontrolünü aktif ediyoruz
      if (!formData.latitude || !formData.longitude) {
        toast.error('Lütfen haritadan bir konum seçin');
        return;
      }

      // Resim kontrolü
      if (selectedFiles.length === 0) {
        toast.error('Lütfen en az bir resim seçin');
        return;
      }

      // Önce resimleri yükle
      const uploadedImageUrls: string[] = [];
      for (const file of selectedFiles) {
        try {
          const imageUrl = await uploadToCloudinary(file);
          uploadedImageUrls.push(imageUrl);
        } catch (error) {
          console.error('Resim yükleme hatası:', error);
          toast.error('Resimler yüklenirken bir hata oluştu');
          return;
        }
      }

      // API'ye gönderilecek veriyi hazırla
      const hotelData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: uploadedImageUrls
      };

      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      // Oteli API'ye gönder
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Hotel`,
        hotelData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Otel başarıyla eklendi!');
      navigate('/hotel-owner');
    } catch (error) {
      console.error('API hatası:', error);
      toast.error('Otel eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
    setTimeout(() => {
      initializeAutocomplete();
    }, 1000);
  }, []);

  const initializeAutocomplete = useCallback(() => {
    try {
      if (!window.google || !inputRef.current) {
        console.error('Google Maps API veya input elementi bulunamadı');
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'tr' },
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['establishment', 'geocode']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry?.location) {
          console.error('Seçilen yerin koordinatları bulunamadı');
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || '';

        setFormData(prev => ({
          ...prev,
          location: address,
          latitude: lat,
          longitude: lng
        }));

        console.log('Seçilen konum:', { address, lat, lng });
      });
    } catch (error) {
      console.error('Autocomplete başlatılırken hata:', error);
    }
  }, []);

  useEffect(() => {
    if (isMapLoaded && inputRef.current) {
      initializeAutocomplete();
    }
  }, [isMapLoaded, initializeAutocomplete]);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      onLoad={handleMapLoad}
    >
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Yeni Otel Ekle
          </Typography>

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
                />
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  inputRef={inputRef}
                  label="Konum"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  helperText="Konum seçmek için yazmaya başlayın"
                />
              </Grid>

              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                  >
                    Otel Resimleri Seç
                  </Button>
                </label>
              </Grid>

              {previewUrls.length > 0 && (
                <Grid item xs={12}>
                  <ImageList sx={{ maxHeight: 300 }} cols={3} rowHeight={160}>
                    {previewUrls.map((url, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={url}
                          alt={`Otel resmi ${index + 1}`}
                          loading="lazy"
                          style={{ height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            bgcolor: 'background.paper'
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/hotel-owner')}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Oteli Kaydet'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LoadScript>
  );
};

export default AddHotel; 