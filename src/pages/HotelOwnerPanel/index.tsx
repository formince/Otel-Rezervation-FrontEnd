import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
  CardActions,
  MenuItem,
} from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon, LocationOn as LocationOnIcon, Edit as EditIcon, ViewList as ViewListIcon, Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { LoadScript, Autocomplete as GoogleAutocomplete } from '@react-google-maps/api'
import CryptoJS from 'crypto-js'
import { useNavigate } from 'react-router-dom'

interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  rooms: Room[];
  imageUrl?: string;
}

interface Room {
  roomId: number;
  roomNumber: string;
  floorNumber: number;
  title: string;
  description: string;
  size: number;
  view: string;
  hasBalcony: boolean;
  capacity: number;
  basePrice: number;
  isAvailable: boolean;
  specialFeatures: string;
  hotelId: number;
}

interface HotelFormData {
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  images: File[];
}

interface RoomFormData {
  roomId: number;
  roomNumber: string;
  floorNumber: number;
  images: string[];
  description: string;
  title: string;
  size: number;
  view: string;
  hasBalcony: boolean;
  capacity: number;
  basePrice: number;
  isAvailable: boolean;
  specialFeatures: string;
  hotelId?: number;
  roomTypeName?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface RoomsDialogProps {
  open: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  rooms: Room[];
  loading: boolean;
  onAddRoom: () => void;
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

const initialFormData: HotelFormData = {
  name: '',
  description: '',
  location: '',
  latitude: 0,
  longitude: 0,
  images: []
}

const initialRoomFormData: RoomFormData = {
  roomId: 0,
  roomNumber: '',
  floorNumber: 0,
  images: [],
  description: '',
  title: '',
  size: 0,
  view: '',
  hasBalcony: false,
  capacity: 0,
  basePrice: 0,
  isAvailable: true,
  specialFeatures: '',
  roomTypeName: 'Standart'
}

const libraries: ("places")[] = ["places"];

// Google Maps Wrapper Component
const GoogleMapsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
};

// RoomsDialog bileşeni
const RoomsDialog: React.FC<RoomsDialogProps> = ({
  open,
  onClose,
  hotel,
  rooms,
  loading,
  onAddRoom,
  onEdit,
  onDelete
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {hotel?.name} - Odalar
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : rooms.length === 0 ? (
          <Box textAlign="center" p={3}>
            <Typography gutterBottom>Bu otele ait oda bulunmamaktadır.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onAddRoom}
              startIcon={<AddIcon />}
            >
              Yeni Oda Ekle
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Oda Adı</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell align="right">Fiyat</TableCell>
                  <TableCell align="right">Kapasite</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.roomId}>
                    <TableCell>{room.title}</TableCell>
                    <TableCell>{room.description}</TableCell>
                    <TableCell align="right">{room.basePrice} ₺</TableCell>
                    <TableCell align="right">{room.capacity} Kişi</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => onEdit(room)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(room.roomId)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      {!loading && rooms.length > 0 && (
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={onAddRoom}
            startIcon={<AddIcon />}
          >
            Yeni Oda Ekle
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

const HotelOwnerPanel: React.FC = () => {
  const navigate = useNavigate();
  // State tanımlamaları
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isRoomsDialogOpen, setIsRoomsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<HotelFormData>(initialFormData);
  const [roomFormData, setRoomFormData] = useState<RoomFormData>(initialRoomFormData);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newImage, setNewImage] = useState('')
  const [ setSearchInput] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Google Maps API yükleme durumunu kontrol eden fonksiyon
  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      // Google Maps API'sinin yüklendiğinden emin oluyoruz
      const loadGoogleMapsScript = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDX5nGHv35MMEaIFpAiIlW_0xigMdsZZuY&libraries=places`;
        script.async = true;
        script.onload = initializeAutocomplete;
        document.body.appendChild(script);
      };

      const initializeAutocomplete = () => {
        const input = document.getElementById('location-input') as HTMLInputElement;
        if (input && window.google && window.google.maps) {
          const autocomplete = new google.maps.places.Autocomplete(input, {
            componentRestrictions: { country: 'tr' },
            types: ['geocode', 'establishment']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log('Seçilen yer:', place);

            if (place.geometry && place.geometry.location) {
              const selectedLocation = {
                address: place.formatted_address ||  '',
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              console.log('Seçilen konum:', selectedLocation);
              setFormData(prev => ({
                ...prev,
                location: selectedLocation.address,
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng
              }));
              setSelectedPlace(selectedLocation);
            }
          });
        }
      };

      // Google Maps API'si yüklü değilse yükle
      if (!window.google) {
        loadGoogleMapsScript();
      } else {
        initializeAutocomplete();
      }
    }
  }, [isDialogOpen]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Hotel/my-hotels`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Gelen otel verileri:', response.data);
      setHotels(response.data || []);
    } catch (error) {
      console.error('Oteller getirilirken hata oluştu:', error);
      toast.error('Oteller yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (hotel?: Hotel) => {
    if (hotel) {
      setSelectedHotel(hotel)
      setFormData({
        name: hotel.name,
        description: hotel.description,
        location: hotel.location,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        images: hotel.images.map(img => new File([], img))
      })
      setCoordinates({ lat: hotel.latitude, lng: hotel.longitude });
    } else {
      setSelectedHotel(null)
      setFormData(initialFormData)
      setCoordinates(null);
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedHotel(null)
    setFormData(initialFormData)
    setSelectedFiles([]);
    setPreviewUrls([]);
    setCoordinates(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Sayısal alanlar için
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } 
    // Diğer alanlar için
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'capacity' ? Number(value) : value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Önizleme URL'lerini oluştur
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const handleRemoveImage = (index: number, isExistingImage: boolean) => {
    if (isExistingImage) {
      // Mevcut resmi sil
      setRoomFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      // Yeni yüklenen resmi sil
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => {
        // URL'i serbest bırak
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const generateSignature = (timestamp: string) => {
    // Burada imza oluşturma işlemi yapılacak
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
      console.log('Cloudinary\'ye gönderilen veriler:', {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        timestamp,
        signature
      });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            console.log('Yükleme ilerlemesi:', percentCompleted);
          }
        }
      );

      console.log('Cloudinary yanıtı:', response.data);
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary yükleme hatası:', error);
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error('Detaylı hata bilgisi:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: responseData,
          headers: error.response?.headers
        });
        
        toast.error(`Resim yüklenirken hata oluştu: ${responseData?.error?.message || error.message}`);
      }
      throw error;
    }
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoordinates({ lat, lng });
        setFormData(prev => ({
          ...prev,
          location: place.formatted_address || '',
          latitude: lat,
          longitude: lng
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Önce tüm resimleri Cloudinary'ye yükle
      const uploadedImageUrls = await Promise.all(
        formData.images.map(file => uploadToCloudinary(file))
      );

      // API'ye gönderilecek veriyi hazırla
      const submitData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        latitude: coordinates?.lat || formData.latitude,
        longitude: coordinates?.lng || formData.longitude,
        images: uploadedImageUrls
      };

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      if (selectedHotel?.id) {
        // Güncelleme işlemi
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/Hotel/${selectedHotel.id}`,
          submitData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Otel başarıyla güncellendi!');
      } else {
        // Yeni otel ekleme işlemi
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/Hotel`,
          submitData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Otel başarıyla eklendi!');
      }

      setFormData(initialFormData);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCoordinates(null);
      handleCloseDialog();
      await fetchHotels();
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      toast.error('İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!window.confirm('Bu odayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      console.log('Silinecek oda ID:', roomId);
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/Room/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Oda başarıyla silindi!');
      
      // Odalar listesini güncelle
      if (selectedHotel) {
        await fetchRooms(selectedHotel.id);
      }
    } catch (error) {
      console.error('Oda silinirken hata:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Hata Detayı:', error.response?.data);
      }
      toast.error('Oda silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    if (window.confirm('Bu oteli silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/Hotel/${hotelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Otel başarıyla silindi!');
        await fetchHotels();
      } catch (error) {
        console.error('Otel silinirken hata oluştu:', error);
        toast.error('Otel silinirken bir hata oluştu');
      }
    }
  };

  // Odaları getirme fonksiyonu
  const fetchRooms = async (hotelId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      console.log('Odalar getiriliyor, Hotel ID:', hotelId);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Room/hotel/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Gelen odalar:', response.data);
      setRooms(response.data || []);
    } catch (error) {
      console.error('Odalar yüklenirken hata oluştu:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Hata Detayı:', error.response?.data);
      }
      toast.error('Odalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Odaları gösterme dialog'unu açma fonksiyonu
  const handleOpenRoomsDialog = async (hotel: Hotel) => {
    try {
      setSelectedHotel(hotel);
      setIsRoomsDialogOpen(true);
      await fetchRooms(hotel.id);
    } catch (error) {
      console.error('Odalar yüklenirken hata:', error);
      toast.error('Odalar yüklenirken bir hata oluştu');
    }
  };

  // Oda ekleme dialog'unu açma fonksiyonu
  const handleOpenRoomDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setRoomFormData(initialRoomFormData);
    setIsRoomDialogOpen(true);
  };

  // Dialog'ları kapatma fonksiyonları
  const handleCloseRoomDialog = () => {
    setIsRoomDialogOpen(false);
    setRoomFormData(initialRoomFormData);
  };

  const handleCloseRoomsDialog = () => {
    setIsRoomsDialogOpen(false);
    setRooms([]);
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) {
      toast.error('Lütfen önce bir otel seçin');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      // Mevcut resimleri koru
      let imageUrls: string[] = [...(roomFormData.images || [])];

      // Yeni seçilen resimleri yükle
      for (const file of selectedFiles) {
        try {
          const timestamp = Math.round((new Date).getTime() / 1000).toString();
          const str_to_sign = `timestamp=${timestamp}${import.meta.env.VITE_CLOUDINARY_API_SECRET}`;
          const signature = CryptoJS.SHA1(str_to_sign).toString();
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
          formData.append('timestamp', timestamp);
          formData.append('signature', signature);

          const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
          );
          
          if (cloudinaryResponse.data.secure_url) {
            imageUrls.push(cloudinaryResponse.data.secure_url);
          }
        } catch (cloudinaryError) {
          console.error('Resim yükleme hatası:', cloudinaryError);
          toast.error(`${file.name} yüklenirken hata oluştu`);
        }
      }

      const roomData = {
        roomId: selectedRoom?.roomId || 0,
        roomNumber: roomFormData.roomNumber,
        floorNumber: parseInt(roomFormData.floorNumber.toString()),
        images: imageUrls,
        description: roomFormData.description,
        title: roomFormData.title,
        size: parseInt(roomFormData.size.toString()),
        view: roomFormData.view,
        hasBalcony: roomFormData.hasBalcony,
        capacity: parseInt(roomFormData.capacity.toString()),
        basePrice: parseFloat(roomFormData.basePrice.toString()),
        isAvailable: true,
        specialFeatures: roomFormData.specialFeatures,
        hotelId: selectedHotel.id,
        roomTypeName: roomFormData.roomTypeName
      };

      console.log('API\'ye gönderilen veri:', roomData);

      if (selectedRoom) {
        // Güncelleme işlemi
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/Room/${selectedRoom.roomId}`,
          roomData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Güncelleme yanıtı:', response.data);
        toast.success('Oda başarıyla güncellendi!');
      } else {
        // Yeni oda ekleme işlemi
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/Room`,
          roomData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Ekleme yanıtı:', response.data);
        toast.success('Oda başarıyla eklendi!');
      }

      // Form ve dialog'u sıfırla
      setRoomFormData(initialRoomFormData);
      setSelectedRoom(null);
      setSelectedFiles([]);
      setPreviewUrls(urls => {
        // Tüm URL'leri serbest bırak
        urls.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
      setIsRoomDialogOpen(false);
      
      // Odalar listesini güncelle
      if (selectedHotel) {
        await fetchRooms(selectedHotel.id);
      }
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Hata Detayı:', error.response?.data);
        // Daha detaylı hata mesajı göster
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error?.message ||
                           'İşlem sırasında bir hata oluştu';
        toast.error(errorMessage);
      } else {
        toast.error('İşlem sırasında beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resim seçme fonksiyonu
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Yeni resimlerin önizlemelerini oluştur
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{ 
          backgroundColor: '#f5f5f5',
          width: '100%'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Otellerim
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/add-hotel')}
          sx={{
            backgroundColor: 'white',
            color: '#2196F3',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Yeni Otel Ekle
        </Button>
      </Box>

      {hotels.length === 0 ? (
        <Box 
          textAlign="center" 
          py={8}
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            padding: '40px'
          }}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Henüz hiç oteliniz bulunmuyor.
          </Typography>
          <Typography color="textSecondary">
            Yeni otel eklemek için yukarıdaki butonu kullanabilirsiniz.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <CardMedia
                    component="img"
                    image={hotel.imageUrl || hotel.images?.[0] || '/default-hotel.jpg'}
                    alt={hotel.name}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {hotel.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1
                    }}
                  >
                    {hotel.description}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                    {hotel.location}
                  </Typography>
                </CardContent>
                
                {/* Oda Yönetimi Butonları */}
                <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenRoomDialog(hotel)}
                    startIcon={<AddIcon />}
                    fullWidth
                    size="small"
                  >
                    Oda Ekle
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenRoomsDialog(hotel)}
                    startIcon={<ViewListIcon />}
                    fullWidth
                    size="small"
                  >
                    Odaları Göster
                  </Button>
                </Box>

                {/* Otel Yönetimi Butonları */}
                <Box sx={{ p: 2, pt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(hotel)}
                    startIcon={<EditIcon />}
                    fullWidth
                    size="small"
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteHotel(hotel.id)}
                    startIcon={<DeleteIcon />}
                    fullWidth
                    size="small"
                  >
                    Sil
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Otel Ekleme/Düzenleme Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            py: 2
          }}
        >
          {selectedHotel ? 'Oteli Düzenle' : 'Yeni Otel Ekle'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Otel Adı"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
              />
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
              <TextField
                id="location-input"
                label="Konum"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
              />

              {/* Resim Ekleme Bölümü */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Otel Resimleri
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      multiple
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file" style={{ width: '100%', display: 'block' }}>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        startIcon={<AddIcon />}
                        sx={{
                          height: '40px',
                          minWidth: '120px'
                        }}
                      >
                        Resim Seç
                      </Button>
                    </label>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <ImageList 
                    sx={{ 
                      maxHeight: 300,
                      borderRadius: '8px',
                      overflow: 'auto'
                    }} 
                    cols={3} 
                    rowHeight={100}
                    gap={8}
                  >
                    {previewUrls.map((url, index) => (
                      <ImageListItem 
                        key={index} 
                        sx={{ 
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '4px'
                        }}
                      >
                        <img 
                          src={url} 
                          alt={`Otel resmi ${index + 1}`} 
                          loading="lazy"
                          style={{
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%'
                          }}
                        />
                        <IconButton
                          onClick={() => handleRemoveImage(index, false)}
                          sx={{ 
                            position: 'absolute',
                            right: 4,
                            top: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            padding: '4px',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)'
                            }
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none'
              }}
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{
                borderRadius: '8px',
                textTransform: 'none'
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : selectedHotel ? (
                'Güncelle'
              ) : (
                'Ekle'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Odaları Listeleme Dialog */}
      <RoomsDialog
        open={isRoomsDialogOpen}
        onClose={handleCloseRoomsDialog}
        hotel={selectedHotel}
        rooms={rooms}
        loading={loading}
        onAddRoom={() => {
          setSelectedRoom(null);
          setRoomFormData(initialRoomFormData);
          setIsRoomDialogOpen(true);
        }}
        onEdit={(room) => {
          setSelectedRoom(room);
          setRoomFormData({
            roomId: room.roomId,
            roomNumber: room.roomNumber,
            floorNumber: room.floorNumber,
            images: room.images,
            description: room.description,
            title: room.title,
            size: room.size,
            view: room.view,
            hasBalcony: room.hasBalcony,
            capacity: room.capacity,
            basePrice: room.basePrice,
            isAvailable: room.isAvailable,
            specialFeatures: room.specialFeatures,
            hotelId: room.hotelId,
            roomTypeName: room.roomTypeName
          });
          setIsRoomDialogOpen(true);
        }}
        onDelete={(roomId) => handleDeleteRoom(roomId)}
      />

      {/* Oda Ekleme/Düzenleme Dialog */}
      <Dialog
        open={isRoomDialogOpen}
        onClose={handleCloseRoomDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedHotel?.name} - {selectedRoom ? 'Odayı Düzenle' : 'Yeni Oda Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Oda Numarası"
                  name="roomNumber"
                  value={roomFormData.roomNumber}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kat Numarası"
                  name="floorNumber"
                  type="number"
                  value={roomFormData.floorNumber}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, floorNumber: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Oda Başlığı"
                  name="title"
                  value={roomFormData.title}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  name="description"
                  multiline
                  rows={3}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Oda Boyutu (m²)"
                  name="size"
                  type="number"
                  value={roomFormData.size}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, size: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manzara"
                  name="view"
                  value={roomFormData.view}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, view: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={roomFormData.hasBalcony}
                      onChange={(e) => setRoomFormData(prev => ({ ...prev, hasBalcony: e.target.checked }))}
                      name="hasBalcony"
                    />
                  }
                  label="Balkon"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kapasite"
                  name="capacity"
                  type="number"
                  value={roomFormData.capacity}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fiyat"
                  name="basePrice"
                  type="number"
                  value={roomFormData.basePrice}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Özel Özellikler"
                  name="specialFeatures"
                  multiline
                  rows={2}
                  value={roomFormData.specialFeatures}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, specialFeatures: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Oda Tipi"
                  name="roomTypeName"
                  value={roomFormData.roomTypeName || 'Standart'}
                  onChange={(e) => setRoomFormData(prev => ({ ...prev, roomTypeName: e.target.value }))}
                  fullWidth
                  required
                >
                  <MenuItem value="KingSize">KingSize</MenuItem>
                  <MenuItem value="Standart">Standart</MenuItem>
                  <MenuItem value="Deluxe">Deluxe</MenuItem>
                  <MenuItem value="Suite">Suite</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="room-images"
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                  />
                  <label htmlFor="room-images">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Oda Resimleri Yükle
                    </Button>
                  </label>
                </Box>
                
                {/* Mevcut resimler */}
                {roomFormData.images && roomFormData.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Mevcut Resimler
                    </Typography>
                    <Grid container spacing={1}>
                      {roomFormData.images.map((url, index) => (
                        <Grid item xs={4} key={`existing-${index}`}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={url}
                              alt={`Oda resmi ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                              }}
                              onClick={() => handleRemoveImage(index, true)}
                            >
                              <DeleteIcon sx={{ color: 'white' }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Yeni seçilen resimlerin önizlemesi */}
                {previewUrls.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Yeni Seçilen Resimler
                    </Typography>
                    <Grid container spacing={1}>
                      {previewUrls.map((url, index) => (
                        <Grid item xs={4} key={`preview-${index}`}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={url}
                              alt={`Yeni resim ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                              }}
                              onClick={() => handleRemoveImage(index, false)}
                            >
                              <DeleteIcon sx={{ color: 'white' }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoomDialog}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleRoomSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (selectedRoom ? 'Güncelle' : 'Ekle')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

// Wrapper ile export
export default function WrappedHotelOwnerPanel() {
  return (
    <GoogleMapsWrapper>
      <HotelOwnerPanel />
    </GoogleMapsWrapper>
  );
} 