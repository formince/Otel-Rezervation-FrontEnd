import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaHeart, FaMapMarkerAlt, FaBed, FaShower, FaTv, FaCoffee, FaWind, FaInfoCircle, FaPhone, FaEnvelope } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const amenityIcons = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  restaurant: FaUtensils,
}

const HotelDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<null | {
    id: number;
    name: string;
    price: number;
    size: string;
    capacity: string;
    image: string;
    amenities: Array<{
      icon: typeof FaBed;
      name: string;
    }>;
    description: string;
  }>(null)
  const [activeTab, setActiveTab] = useState('genel')

  // Mock data - gerçek uygulamada API'den gelecek
  const hotelData = {
    id: 1,
    name: 'Grand Luxury Hotel',
    description: 'Boğaz manzaralı lüks odalar ve dünya standartlarında hizmet. Modern tasarım ve konforlu bir konaklama deneyimi sunan otelimiz, şehrin kalbinde yer almaktadır. Restoranımızda yerel ve uluslararası lezzetleri tadabilir, spa merkezimizde rahatlayabilirsiniz.',
    price: 1200,
    location: 'İstanbul, Türkiye',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviews: 128,
    amenities: ['wifi', 'parking', 'pool', 'restaurant'],
    rooms: [
      {
        id: 1,
        name: 'Deluxe Deniz Manzaralı Oda',
        price: 1500,
        size: '45m²',
        capacity: '2 Yetişkin + 1 Çocuk',
        image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        amenities: [
          { icon: FaBed, name: 'King Size Yatak' },
          { icon: FaShower, name: 'Duş ve Küvet' },
          { icon: FaTv, name: 'Smart TV' },
          { icon: FaCoffee, name: 'Mini Bar' },
          { icon: FaWind, name: 'Klima' },
          { icon: FaWifi, name: 'Ücretsiz Wi-Fi' }
        ],
        description: 'Muhteşem deniz manzarasına sahip lüks odamız, konforlu bir konaklama deneyimi sunuyor. Modern dekorasyon ve üst düzey olanaklar ile donatılmış bu oda, unutulmaz bir konaklama vadediyor.'
      },
      {
        id: 2,
        name: 'Superior Şehir Manzaralı Oda',
        price: 1200,
        size: '40m²',
        capacity: '2 Yetişkin',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        amenities: [
          { icon: FaBed, name: 'Queen Size Yatak' },
          { icon: FaShower, name: 'Duş' },
          { icon: FaTv, name: 'Smart TV' },
          { icon: FaCoffee, name: 'Mini Bar' },
          { icon: FaWind, name: 'Klima' },
          { icon: FaWifi, name: 'Ücretsiz Wi-Fi' }
        ],
        description: 'Şehir manzaralı superior odamız, modern konfor ve şıklığı bir arada sunuyor. Ferah iç mekanı ve kaliteli mobilyaları ile rahat bir konaklama imkanı sağlıyor.'
      }
    ]
  }

  const handleRoomSelect = (roomId: number) => {
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 space-y-6">
        {/* Hotel Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotelData.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {hotelData.location}
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{hotelData.rating}</span>
                    <span className="ml-1 text-gray-500">({hotelData.reviews} değerlendirme)</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaHeart className="text-2xl text-gray-400 hover:text-red-500" />
              </motion.button>
            </div>
          </div>

          {/* Navigation Menu */}
         

          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={hotelData.images[selectedImage]}
                  alt={hotelData.name}
                  className="w-full h-[500px] object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5
                  }}
                />
              </AnimatePresence>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {hotelData.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 ${
                      selectedImage === index
                        ? 'ring-2 ring-blue-500'
                        : 'ring-1 ring-white/50'
                    }`}
                  >
                    <motion.img
                      src={image}
                      alt={`${hotelData.name} ${index + 1}`}
                      className="h-20 w-32 object-cover rounded-lg"
                      whileHover={{ filter: "brightness(1.2)" }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>



        <div className="border-t border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between space-x-8 overflow-x-auto py-4 scrollbar-hide">
                <a 
                  href="#genel-bakis"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group relative px-4 py-2"
                >
                  <FaInfoCircle className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  <span>Genel Bakış</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
                <a 
                  href="#musait-odalar" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group relative px-4 py-2"
                >
                  <FaBed className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  <span>Odalar</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
                <a 
                  href="#harita" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group relative px-4 py-2"
                >
                  <FaMapMarkerAlt className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  <span>Konum</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
                <a 
                  href="#otel-bilgileri" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group relative px-4 py-2"
                >
                  <FaPhone className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  <span>İletişim</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>




        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 id="otel-hakkinda" className="text-2xl font-bold mb-4">Otel Hakkında</h2>
              <p className="text-grasy-600 leading-relaxed">{hotelData.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-4">Otel Olanakları</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotelData.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                  return (
                    <div
                      key={amenity}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <Icon className="text-blue-500 mr-2" />
                      <span className="capitalize">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Available Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 id="musait-odalar" className="text-2xl font-bold mb-4">Müsait Odalar</h2>
              <div className="space-y-4">
                {hotelData.rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <span>{room.size}</span>
                        <span>•</span>
                        <span>{room.capacity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-blue-600 font-bold">
                          ₺{room.price}
                          <span className="text-gray-500 font-normal">/gece</span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            onClick={() => setSelectedRoom(room)}
                          >
                            Ayrıntılar
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => handleRoomSelect(room.id)}
                          >
                            Seç
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 id="harita" className="text-2xl font-bold mb-4">Konum</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2755685906655!2d28.97705931573861!3d41.00850842655484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bd6570f4e1%3A0xe43c6ce917b92b3a!2sGrand%20Hyatt%20Istanbul!5e0!3m2!1str!2str!4v1647887828556!5m2!1str!2str"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="mt-4 space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>{hotelData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  <span>+90 212 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" />
                  <span>info@grandluxuryhotel.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ₺{hotelData.price}
                  <span className="text-gray-500 text-base font-normal">/gece</span>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Giriş Tarihi
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Çıkış Tarihi
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Oda Seç
                  </motion.button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Öne Çıkan Özellikler</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Ücretsiz WiFi</li>
                    <li>• Spa ve Wellness Merkezi</li>
                    <li>• 24 Saat Resepsiyon</li>
                    <li>• Otopark</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Room Details Popup */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-50/80 backdrop-blur-sm rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <button
                  className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedRoom(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedRoom.name}</h3>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span>{selectedRoom.size}</span>
                      <span>•</span>
                      <span>{selectedRoom.capacity}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₺{selectedRoom.price}
                    <span className="text-base font-normal text-gray-500">/gece</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Oda Hakkında</h4>
                  <p className="text-gray-600">{selectedRoom.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Oda Özellikleri</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <amenity.icon className="text-blue-500" />
                        <span className="text-gray-700">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => handleRoomSelect(selectedRoom.id)}
                  >
                    Rezervasyon Yap
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HotelDetail 