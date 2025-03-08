import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Badge 
} from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldOff, 
  Shield,
  Loader2,
  MapPin,
  Image,
  Upload,
  Plus,
  Trash,
  Edit,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';

// API'den gelen hotel yapısı
interface Hotel {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude?: number;
  images: string[];
  description?: string;
  // Mevcut alanları opsiyonel olarak tutuyoruz
  status?: 'pending' | 'active' | 'suspended';
}

// Yeni otel form değerleri
interface HotelFormValues {
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
}

const HotelsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<HotelFormValues>({
    name: '',
    location: '',
    description: '',
    latitude: 0,
    longitude: 0,
    images: []
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dibsxfpzx';
  const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '179239479323255';
  const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'zui6wKpuiVbUmfRHEofjgXvFf18';
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // API'den otel verilerini çek
  useEffect(() => {
    fetchHotels();
  }, []);

  const getStatusBadgeVariant = (status: Hotel['status']) => {
    switch(status) {
      case 'pending': return 'secondary';
      case 'active': return 'default';
      case 'suspended': return 'destructive';
      default: return 'default';
    }
  };

  const handleApprove = (hotelId: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, status: 'active' } 
        : hotel
    ));
  };

  const handleReject = (hotelId: number) => {
    setHotels(hotels.filter(hotel => hotel.id !== hotelId));
  };

  const handleSuspend = (hotelId: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, status: 'suspended' } 
        : hotel
    ));
  };

  const handleRepublish = (hotelId: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, status: 'active' } 
        : hotel
    ));
  };

  const handleViewOnMap = (latitude: number, longitude: number, name: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      // Mevcut API'yi kullan
      const response = await axios.get(`${API_BASE_URL}/AdminHotel`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Hotel data from API:', response.data);
      
      // API'den gelen verileri işle, ancak frontend'de sadece temel bilgileri tut
      const processedHotels: Hotel[] = Array.isArray(response.data) 
        ? response.data.map((hotel: any) => {
            // Tam veriyi hafızada tut (detay görünümü için)
            const fullHotel = {
              id: hotel.id,
              name: hotel.name,
              location: hotel.location || '',
              latitude: hotel.latitude || 0,
              longitude: hotel.longitude || 0,
              images: hotel.images || [],
              description: hotel.description || '',
              status: hotel.status || 'active'
            };
            
            // Tam veriyi localStorage'a kaydet (detay görünümü için)
            localStorage.setItem(`hotel_${hotel.id}`, JSON.stringify(fullHotel));
            
            // Sadece temel bilgileri döndür (kart görünümü için)
            return fullHotel;
          })
        : [];
      
      setHotels(processedHotels);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          toast.error('Bu işlemi yapmak için yetkiniz bulunmuyor. Lütfen yönetici ile iletişime geçin.');
          console.log('403 Forbidden error - Authorization header:', error.config?.headers?.Authorization);
        } else if (error.response.status === 401) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        } else {
          toast.error('Otelleri getirirken bir hata oluştu: ' + (error.response.data?.message || error.message));
        }
      } else {
        toast.error('Otelleri getirirken bir hata oluştu');
      }
      
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async () => {
    if (!selectedHotel) return;

    try {
      setDeleteLoading(true);
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      console.log('Deleting hotel with ID:', selectedHotel.id);
      
      // DELETE isteği
      const response = await axios({
        method: 'DELETE',
        url: `${API_BASE_URL}/AdminHotel/${selectedHotel.id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response:', response.data);
      toast.success('Otel başarıyla silindi');
      
      // Otelleri yeniden yükle
      fetchHotels();
      setIsDeleteDialogOpen(false);
      setSelectedHotel(null);
    } catch (error: any) {
      console.error('Error deleting hotel:', error);
      
      // Hata mesajlarını göster
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        } else if (status === 403) {
          toast.error('Bu işlemi yapmaya yetkiniz yok.');
        } else {
          toast.error(error.response.data?.message || 'Otel silinirken bir hata oluştu');
        }
      } else {
        toast.error('Otel silinirken bir hata oluştu');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsDeleteDialogOpen(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    navigate(`/admin/edit-hotel/${hotel.id}`);
  };

  const openDetailDialog = async (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsDetailDialogOpen(true);
    
    // Eğer localStorage'da tam veri varsa, oradan al
    const cachedHotel = localStorage.getItem(`hotel_${hotel.id}`);
    if (cachedHotel) {
      try {
        const parsedHotel = JSON.parse(cachedHotel);
        setSelectedHotel(parsedHotel);
        return;
      } catch (e) {
        console.error('Error parsing cached hotel:', e);
        // Hata durumunda API'den almaya devam et
      }
    }
    
    // Eğer tam veri yoksa veya parse edilemezse, API'den al
    try {
      setDetailLoading(true);
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      // Otel detaylarını getir
      const response = await axios.get(`${API_BASE_URL}/AdminHotel/${hotel.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Hotel details:', response.data);
      
      // Seçili oteli güncelle
      setSelectedHotel(response.data);
      
      // Oteller listesindeki ilgili oteli de güncelle
      setHotels(prevHotels => 
        prevHotels.map(h => 
          h.id === hotel.id ? { ...h, ...response.data } : h
        )
      );
      
      // Güncel veriyi localStorage'a kaydet
      localStorage.setItem(`hotel_${hotel.id}`, JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Error fetching hotel details:', error);
      toast.error('Otel detayları yüklenirken bir hata oluştu');
    } finally {
      setDetailLoading(false);
    }
  };

  const renderHotelCard = (hotel: Hotel, isApprovalTab: boolean = false) => (
    <Card key={hotel.id} className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{hotel.name}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>ID:</strong> {hotel.id}
          </p>
        </div>
        <Badge 
          variant={getStatusBadgeVariant(hotel.status)}
          className="flex items-center gap-1"
        >
          {hotel.status ? hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1) : 'Active'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mt-2">
            {isApprovalTab ? (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleApprove(hotel.id)}
                  className="hover:bg-green-50 text-black"
                >
                  <Check className="mr-2 h-4 w-4" /> Onayla
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleReject(hotel.id)}
                  className="hover:bg-red-50 text-black"
                >
                  <X className="mr-2 h-4 w-4" /> Reddet
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="hover:bg-blue-50 text-black"
                  onClick={() => openDetailDialog(hotel)}
                >
                  <Info className="mr-2 h-4 w-4" /> Ayrıntılar
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="hover:bg-amber-50 text-black"
                  onClick={() => handleEditHotel(hotel)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Düzenle
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="hover:bg-red-50 text-red-600"
                  onClick={() => openDeleteDialog(hotel)}
                >
                  <Trash className="mr-2 h-4 w-4" /> Sil
                </Button>
                
                {hotel.status === 'active' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleSuspend(hotel.id)}
                    className="hover:bg-red-50 text-black"
                  >
                    <ShieldOff className="mr-2 h-4 w-4" /> Askıya Al
                  </Button>
                )}
                
                {hotel.status === 'suspended' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRepublish(hotel.id)}
                    className="hover:bg-green-50 text-black"
                  >
                    <Shield className="mr-2 h-4 w-4" /> Tekrar Yayına Al
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Otel Yönetimi</h2>
        <div className="flex gap-2">
          <Button onClick={fetchHotels} variant="outline" className="flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Yenile
          </Button>
          <Button onClick={() => navigate('/admin/add-hotel')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Otel Ekle
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin mr-2 text-primary" size={24} />
          <span>Oteller yükleniyor...</span>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
          <Button onClick={fetchHotels} variant="outline" className="mt-4">
            Tekrar Dene
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="inspection" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approval">Onay Bekleyen Oteller</TabsTrigger>
            <TabsTrigger value="inspection">Aktif Oteller</TabsTrigger>
          </TabsList>
          
          <TabsContent value="approval" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels
              .filter(hotel => hotel.status === 'pending')
              .map(hotel => renderHotelCard(hotel, true))
            }
            {hotels.filter(hotel => hotel.status === 'pending').length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">
                Onay bekleyen otel başvurusu bulunmuyor
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="inspection" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels
              .filter(hotel => hotel.status !== 'pending')
              .map(hotel => renderHotelCard(hotel, false))
            }
            {hotels.filter(hotel => hotel.status !== 'pending').length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">
                Listelenecek otel bulunmuyor
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Oteli Sil
            </DialogTitle>
            <DialogDescription>
              Bu oteli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          
          {selectedHotel && (
            <div className="py-4">
              <p className="font-medium">{selectedHotel.name}</p>
              <p className="text-sm text-muted-foreground mt-1">ID: {selectedHotel.id}</p>
              <p className="text-sm text-muted-foreground">{selectedHotel.location}</p>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteHotel}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                'Oteli Sil'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hotel Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Otel Detayları
            </DialogTitle>
          </DialogHeader>
          
          {detailLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin mr-2 text-primary" size={24} />
              <span>Detaylar yükleniyor...</span>
            </div>
          ) : selectedHotel ? (
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{selectedHotel.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedHotel.id}</p>
                </div>
                <Badge 
                  variant={getStatusBadgeVariant(selectedHotel.status)}
                >
                  {selectedHotel.status ? selectedHotel.status.charAt(0).toUpperCase() + selectedHotel.status.slice(1) : 'Active'}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Konum</h4>
                <p className="text-sm text-muted-foreground">{selectedHotel.location}</p>
                
                {selectedHotel.latitude && selectedHotel.longitude && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2 hover:bg-blue-50"
                    onClick={() => handleViewOnMap(selectedHotel.latitude, selectedHotel.longitude || 0, selectedHotel.name)}
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Konumu Gör
                  </Button>
                )}
              </div>
              
              {selectedHotel.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Açıklama</h4>
                  <p className="text-sm text-muted-foreground">{selectedHotel.description}</p>
                </div>
              )}
              
              {selectedHotel.images && selectedHotel.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Görseller</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedHotel.images.map((img, index) => (
                      <a 
                        key={index} 
                        href={img} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block h-24 rounded overflow-hidden"
                      >
                        <img src={img} alt={`${selectedHotel.name} ${index+1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Otel detayları bulunamadı</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Kapat
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDetailDialogOpen(false);
                if (selectedHotel) {
                  handleEditHotel(selectedHotel);
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Düzenle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelsOverview;
