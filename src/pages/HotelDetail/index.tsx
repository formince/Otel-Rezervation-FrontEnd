import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaHeart, FaMapMarkerAlt, FaBed, FaShower, FaTv, FaCoffee, FaWind, FaInfoCircle, FaPhone, FaEnvelope, FaCheck, FaSearch, FaUser, FaCalendarAlt, FaPlus, FaMinus, FaCrown } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import Lottie from 'lottie-react'
import discountAnimation from '../../assets/animations/discount.json'

interface Room {
  id?: number;  // Opsiyonel olarak id ekleyelim
  roomId: number;  // roomId ekleyelim
  roomNumber: string | null;
  roomTypeName: string | null;
  title: string | null;
  price: number;
  capacity: number;
  description: string | null;
  isAvailable: boolean;
  images: string[];  // Cloudinary URL'leri için
  size: string | null;
  features?: string[];
  basePrice: number;
  specialFeatures: string[] | null;
  hotelId: number;
  discountedPrice?: number; // İndirimli fiyat için yeni alan
  isDiscountApplied?: boolean; // İndirim uygulanıp uygulanmadığını takip etmek için
}

interface HotelDetails {
  id: number;
  name: string;
  description: string;
  location: string;  // address yerine location kullanıyoruz
  rating: number;
  rooms: Room[];
  images: string[];  // Cloudinary URL'leri için
}

interface LoyaltyInfo {
  levelName: string;
  discountPercentage: number;
  specialPerks: string;
}

const HotelDetail = () => {
  const { id: hotelId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupedRooms, setGroupedRooms] = useState<Record<string, Room[]>>({})
  const [selectedImage, setSelectedImage] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [showGuestInput, setShowGuestInput] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [adults, setAdults] = useState(parseInt(searchParams.get('adults') || '2'))
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null)
  const [discountedRooms, setDiscountedRooms] = useState<Record<number, boolean>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true)
        const searchParams = new URLSearchParams(location.search)
        const checkInDate = searchParams.get('checkIn') || new Date().toISOString().split('T')[0]
        const checkOutDate = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0]
        const adults = searchParams.get('adults') || '2'

        setCheckIn(checkInDate)
        setCheckOut(checkOutDate)

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/HotelDetails/${hotelId}?checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=${adults}`
        )

        console.log('API Yanıtı:', response.data)
        console.log('Otel Odaları:', response.data.rooms)

        // API'den gelen veriyi düzenle
  const hotelData = {
          ...response.data,
          hotelImages: response.data.images || [],
          address: response.data.location,
          rooms: response.data.rooms.map((room: any) => {
            console.log('İşlenen oda:', room);
            return {
              ...room,
              id: room.roomId, // roomId'yi id olarak kullan
              price: room.basePrice
            };
          })
        };

        console.log('Düzenlenmiş otel verileri:', hotelData)
        console.log('Düzenlenmiş odalar:', hotelData.rooms)

        setHotelDetails(hotelData)
        
        // Odaları gruplandır
        const rooms = hotelData.rooms as Room[];
        console.log('Düzenlenmiş odalar:', rooms);

        // Önce odaları türlerine göre grupla
        const groupedByType = rooms.reduce((groups: Record<string, Room[]>, room: Room) => {
          const roomType = room.roomTypeName || 'Standart';
          if (!groups[roomType]) {
            groups[roomType] = [];
          }
          groups[roomType].push(room);
          return groups;
        }, {});

        // Her oda türü için sadece bir müsait oda seç
        const grouped = Object.entries(groupedByType).reduce((acc: Record<string, Room[]>, [type, rooms]) => {
          // O türdeki müsait odaları bul
          const availableRooms = rooms.filter(room => room.isAvailable);
          
          // Eğer müsait oda varsa, sadece birini seç
          if (availableRooms.length > 0) {
            acc[type] = [availableRooms[0]];
          }
          
          return acc;
        }, {});

        console.log('Gruplandırılmış ve filtrelenmiş odalar:', grouped);
        setGroupedRooms(grouped)
      } catch (err) {
        console.error('API Hatası:', err)
        toast.error('Otel detayları yüklenirken bir hata oluştu')
        setError('Otel detayları yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    const fetchLoyaltyInfo = async () => {
      try {
        const response = await axios.get('https://localhost:7174/api/Loyalty/get-loyalty-level?userId=7');
        setLoyaltyInfo(response.data);
      } catch (error) {
        console.error('Sadakat bilgileri alınamadı:', error);
      }
    };

    if (hotelId) {
      fetchHotelDetails()
      fetchLoyaltyInfo()
    }
  }, [hotelId, location.search])

  const handleRoomSelect = async (roomId: number) => {
    if (!isLoggedIn) {
      toast.error('Rezervasyon yapabilmek için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    const selectedRoom = Object.values(groupedRooms)
      .flat()
      .find((room: Room) => room.roomId === roomId);

    if (!selectedRoom) {
      toast.error('Seçilen oda bulunamadı');
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      toast.error('Lütfen geçerli bir tarih aralığı seçin');
      return;
    }

    try {
      // İndirimli fiyat varsa onu, yoksa normal fiyatı kullan
      const totalPrice = selectedRoom.discountedPrice || selectedRoom.basePrice;

      // Ödeme sayfasına yönlendir
      navigate('/payment', {
        state: {
          paymentData: {
            userId: Number(localStorage.getItem('userId')),
            roomId: selectedRoom.roomId,
            hotelId: Number(hotelId),
            checkIn: checkIn,
            checkOut: checkOut,
            totalPrice: totalPrice,
            email: localStorage.getItem('userEmail')
          },
          roomDetails: {
            roomNumber: selectedRoom.roomNumber,
            roomType: selectedRoom.roomTypeName,
            nights: nights,
            basePrice: selectedRoom.basePrice
          }
        }
      });
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      toast.error('Rezervasyon işlemi sırasında bir hata oluştu');
    }
  };

  // Tarih ve kişi sayısı değiştiğinde API isteği yapacak fonksiyon
  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      toast.warning('Lütfen giriş ve çıkış tarihlerini seçin')
      return
    }

    setIsSearching(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/HotelDetails/${hotelId}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`
      )

      setHotelDetails(response.data)
      
      // Odaları gruplandır
      const rooms = response.data.rooms as Room[];
      console.log('API\'den gelen odalar:', rooms);

      // Önce odaları türlerine göre grupla
      const groupedByType = rooms.reduce((groups: Record<string, Room[]>, room: Room) => {
        const roomType = room.roomTypeName || 'Standart';
        if (!groups[roomType]) {
          groups[roomType] = [];
        }
        groups[roomType].push(room);
        return groups;
      }, {});

      // Her oda türü için sadece bir müsait oda seç
      const grouped = Object.entries(groupedByType).reduce((acc: Record<string, Room[]>, [type, rooms]) => {
        // O türdeki müsait odaları bul
        const availableRooms = rooms.filter(room => room.isAvailable);
        
        // Eğer müsait oda varsa, sadece birini seç
        if (availableRooms.length > 0) {
          acc[type] = [availableRooms[0]];
        }
        
        return acc;
      }, {});

      console.log('Gruplandırılmış ve filtrelenmiş odalar:', grouped);
      setGroupedRooms(grouped)

      // URL'i güncelle
      const searchParams = new URLSearchParams({
        checkIn,
        checkOut,
        adults: adults.toString()
      })
      navigate(`/hotel/${hotelId}?${searchParams.toString()}`, { replace: true })

    } catch (err) {
      console.error('API Hatası:', err)
      toast.error('Otel detayları yüklenirken bir hata oluştu')
    } finally {
      setIsSearching(false)
    }
  }

  const incrementAdults = () => {
    if (adults < 10) {
      setAdults(prev => prev + 1)
    }
  }

  const decrementAdults = () => {
    if (adults > 1) {
      setAdults(prev => prev - 1)
    }
  }

  // Gece sayısını hesaplayan fonksiyon
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const applyDiscount = async (room: Room) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Lütfen giriş yapın');
        return;
      }

      const response = await axios.post('https://localhost:7174/api/Discount/preview', {
        userId: Number(userId),
        orderAmount: room.basePrice
      });

      const { discountedAmount } = response.data;

      // Odanın indirimli fiyatını güncelle
      const updatedRooms = { ...groupedRooms };
      Object.keys(updatedRooms).forEach(roomType => {
        updatedRooms[roomType] = updatedRooms[roomType].map(r => {
          if (r.roomId === room.roomId) {
            return {
              ...r,
              discountedPrice: discountedAmount,
              isDiscountApplied: true
            };
          }
          return r;
        });
      });

      setGroupedRooms(updatedRooms);
      setDiscountedRooms({ ...discountedRooms, [room.roomId]: true });
      toast.success('İndirim uygulandı!');
    } catch (error) {
      console.error('İndirim uygulanırken hata:', error);
      toast.error('İndirim uygulanırken bir hata oluştu');
    }
  };

  const removeDiscount = (room: Room) => {
    const updatedRooms = { ...groupedRooms };
    Object.keys(updatedRooms).forEach(roomType => {
      updatedRooms[roomType] = updatedRooms[roomType].map(r => {
        if (r.roomId === room.roomId) {
          const { discountedPrice, isDiscountApplied, ...rest } = r;
          return rest;
        }
        return r;
      });
    });

    setGroupedRooms(updatedRooms);
    setDiscountedRooms({ ...discountedRooms, [room.roomId]: false });
    toast.info('İndirim kaldırıldı');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !hotelDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Bir hata oluştu</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Otel Başlığı ve Galerisi */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mb-8 border border-white/50">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  {hotelDetails.name}
                </h1>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span className="text-gray-700">{hotelDetails.location}</span>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                    <FaStar className="text-yellow-500 mr-2" />
                    <span className="text-gray-700 font-medium">{hotelDetails.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resim Galerisi */}
          <div className="relative">
            <motion.div 
              className="aspect-w-16 aspect-h-9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={hotelDetails?.images?.[selectedImage] || '/placeholder-hotel.jpg'}
                alt={hotelDetails?.name}
                className="w-full h-[600px] object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-3 overflow-x-auto pb-2 px-2">
                {hotelDetails?.images?.map((image, index) => (
                  <motion.button
                    key={`hotel-image-${index}`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    className={`flex-shrink-0 ${
                      selectedImage === index
                        ? 'ring-3 ring-blue-500 shadow-lg transform scale-105'
                        : 'ring-2 ring-white/70 hover:ring-blue-400'
                    } transition-all duration-200`}
                  >
                    <img
                      src={image}
                      alt={`${hotelDetails.name} ${index + 1}`}
                      className="h-24 w-36 object-cover rounded-lg"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Arama Bölümü */}
            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Rezervasyon Detayları</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Check-in Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giriş Tarihi
                    </label>
                  <div className="relative group">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 transition-colors duration-200" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Çıkış Tarihi
                    </label>
                  <div className="relative group">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 transition-colors duration-200" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Misafir Sayısı
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setShowGuestInput(!showGuestInput)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl cursor-pointer flex items-center bg-white/50 hover:bg-white transition-all duration-200"
                    >
                      <FaUser className="absolute left-3 text-blue-500" />
                      <span className="text-gray-700">{adults} Kişi</span>
                </div>
                    {showGuestInput && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={decrementAdults}
                            className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
                            disabled={adults <= 1}
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="mx-4 font-medium text-gray-700">{adults}</span>
                          <button
                            onClick={incrementAdults}
                            className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
                            disabled={adults >= 10}
                          >
                            <FaPlus size={14} />
                          </button>
            </div>
          </motion.div>
                    )}
                  </div>
        </div>
      </div>

              {/* Search Button */}
              <div className="mt-6">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 font-medium shadow-lg"
                >
                  {isSearching ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaSearch className="text-white/90" />
                      <span>Müsaitlik Ara</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Otel Açıklaması */}
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Otel Hakkında
              </h2>
              <p className="text-gray-600 leading-relaxed">{hotelDetails.description}</p>
            </motion.div>

            {/* Odalar */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Müsait Odalar
              </h2>
              {Object.entries(groupedRooms || {}).map(([roomType, rooms], index) => (
                <motion.div
                  key={`room-type-${roomType}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50"
                >
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">{roomType}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {rooms.map((room) => {
                      // Debug için room objesini kontrol et
                      console.log(`Render edilen oda (${roomType}):`, {
                        id: room.id,
                        roomNumber: room.roomNumber,
                        roomType: room.roomTypeName,
                        fullRoom: room
                      });

                      return (
                        <div key={`room-${room.id || Math.random()}`} className="p-6 hover:bg-blue-50/50 transition-colors duration-200">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                              <img
                                src={room.images?.[0] || '/placeholder-room.jpg'}
                                alt={`${roomType} - Oda ${room.roomNumber || ''}`}
                                className="w-full h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    {room.title || 'Standart Oda'}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                      <FaBed className="text-blue-500" />
                                      <span className="text-gray-700">{room.capacity} Kişilik</span>
                                    </div>
                                    {room.size && (
                                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                        <FaMapMarkerAlt className="text-green-500" />
                                        <span className="text-gray-700">{room.size}</span>
                                      </div>
                                    )}
                                    {room.roomTypeName && (
                                      <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                                        <span className="text-purple-600">{room.roomTypeName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {calculateNights() > 0 ? (
                                    <>
                                      <div className="text-sm text-gray-500">{calculateNights()} Gece için</div>
                                      {room.isDiscountApplied ? (
                                        <>
                                          <div className="text-lg line-through text-gray-400">₺{room.basePrice}</div>
                                          <div className="text-2xl font-bold text-green-600">₺{room.discountedPrice}</div>
                                        </>
                                      ) : (
                                        <div className="text-2xl font-bold text-blue-600">₺{room.basePrice}</div>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-sm text-gray-500">Gecelik</div>
                                      {room.isDiscountApplied ? (
                                        <>
                                          <div className="text-lg line-through text-gray-400">₺{room.basePrice}</div>
                                          <div className="text-2xl font-bold text-green-600">₺{room.discountedPrice}</div>
                                        </>
                                      ) : (
                                        <div className="text-2xl font-bold text-blue-600">₺{room.basePrice}</div>
                                      )}
                                    </>
                                  )}
                                  {loyaltyInfo && (
                                    <button
                                      onClick={() => room.isDiscountApplied ? removeDiscount(room) : applyDiscount(room)}
                                      className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
                                        room.isDiscountApplied
                                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                                      } transition-colors duration-200`}
                                    >
                                      {room.isDiscountApplied ? 'İndirimi Kaldır' : 'İndirimi Uygula'}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {room.description && (
                                <p className="text-gray-600 mb-4">{room.description}</p>
                              )}

                              {room.specialFeatures && room.specialFeatures.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {room.specialFeatures.map((feature, index) => (
                                    <span
                                      key={`feature-${room.id}-${index}`}
                                      className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm border border-gray-100"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    <FaCheck className="text-green-500" />
                                    <span className="text-sm">Ücretsiz İptal</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    // Debug için tıklama anında room objesini kontrol et
                                    console.log('Tıklanan oda detayları:', {
                                      id: room.id,
                                      roomNumber: room.roomNumber,
                                      roomType: room.roomTypeName,
                                      fullRoom: room
                                    });
                                    if (!room.id) {
                                      console.error('Oda ID\'si bulunamadı:', room);
                                      toast.error('Oda bilgisi eksik');
                                      return;
                                    }
                                    handleRoomSelect(room.roomId);
                                  }}
                                  className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg ${
                                    room.isAvailable
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                  disabled={!room.isAvailable}
                                >
                                  {room.isAvailable ? (
                                    <>
                                      <span>Rezervasyon Yap</span>
                                      <FaCheck className="text-white/90" />
                                    </>
                                  ) : (
                                    'Müsait Değil'
                                  )}
                                </button>
                              </div>
                            </div>
                    </div>
                  </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
                </div>
                </div>

          {/* Sağ Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <motion.div 
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Öne Çıkan Özellikler
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: FaCheck, text: 'Ücretsiz İptal', color: 'text-green-500', bg: 'bg-green-50' },
                    { icon: FaWifi, text: 'Ücretsiz WiFi', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: FaParking, text: 'Otopark', color: 'text-purple-500', bg: 'bg-purple-50' },
                    { icon: FaSwimmingPool, text: 'Havuz', color: 'text-cyan-500', bg: 'bg-cyan-50' }
                  ].map((feature, index) => (
                      <div
                        key={index}
                      className={`flex items-center gap-3 ${feature.bg} p-3 rounded-xl`}
                      >
                      <feature.icon className={feature.color} />
                      <span className="text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Sadakat Kartı */}
              {loyaltyInfo && (
                <motion.div 
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Sadakat Seviyeniz
                        </h3>
                       
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Üyelik Seviyesi:</span>
                          <span className="font-semibold text-gray-800">{loyaltyInfo.levelName}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-600">İndirim Oranı:</span>
                            <div className="flex items-center gap-2">
                              <Lottie 
                                animationData={discountAnimation}
                                style={{ width: 30, height: 30 }}
                              />
                              <span className="font-bold text-2xl text-blue-600">%{loyaltyInfo.discountPercentage}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Özel Avantajlar:</span>
                          <p className="mt-1 text-gray-800">{loyaltyInfo.specialPerks}</p>
                        </div>
                      </div>
                </div>
              </div>
          </motion.div>
        )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetail 