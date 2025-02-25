import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { FaStar, FaHeart, FaSwimmingPool, FaWifi, FaParking, FaCocktail, FaSearch, FaMapMarkerAlt, FaRegCalendarAlt, FaUser, FaPercent, FaPlus, FaMinus } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

const popularDestinations = [
  {
    id: 1,
    name: 'İstanbul',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Tarihi yarımadaa ve Boğaz manzarası',
    properties: 254
  },
  {
    id: 2,
    name: 'Antalya',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Muhteşem plajlar ve antik kentler',
    properties: 186
  },
  {
    id: 3,
    name: 'Kapadokya',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Peri bacaları ve balon turları',
    properties: 95
  },
  {
    id: 4,
    name: 'Bodrum',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Lüks marinalar ve eğlence',
    properties: 143
  },
]

const deals = [
  {
    id: 1,
    title: 'Son Dakika Fırsatı',
    description: 'Bu hafta sonu için %25 indirim',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    discount: 25
  },
  {
    id: 2,
    title: 'Erken Rezervasyon',
    description: 'Yaz tatili için %30 indirim',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    discount: 30
  }
]

interface SearchPlace {
  address: string;
  lat: number;
  lng: number;
}

const libraries: ("places")[] = ["places"];

const Home = () => {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState<Date | null>(() => {
    const today = new Date();
    return today;
  })
  const [checkOut, setCheckOut] = useState<Date | null>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today;
  })
  const [guests, setGuests] = useState(2)
  const [showGuestInput, setShowGuestInput] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [searchPlace, setSearchPlace] = useState<SearchPlace | null>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const { scrollY } = useScroll()

  useEffect(() => {
    // Google Maps API'sini yükle
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      const input = document.getElementById('location-input') as HTMLInputElement;
      if (input && window.google && window.google.maps) {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: 'tr' },
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
          types: ['geocode', 'establishment']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry?.location) {
            console.error('Seçilen yerin koordinatları bulunamadı');
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          // Adresi sadeleştir
          let formattedAddress = '';
          if (place.address_components) {
            const district = place.address_components.find(comp => 
              comp.types.includes('sublocality_level_1') || 
              comp.types.includes('sublocality') ||
              comp.types.includes('neighborhood')
            )?.long_name;

            const city = place.address_components.find(comp => 
              comp.types.includes('administrative_area_level_1')
            )?.long_name;

            if (district && city) {
              formattedAddress = district !== city ? `${city} ${district}` : city;
            } else {
              formattedAddress = place.formatted_address?.split(',')[0] || '';
            }
          }

          setSearchPlace({
            address: formattedAddress,
            lat,
            lng
          });
          setDestination(formattedAddress);

          console.log('Seçilen konum:', { formattedAddress, lat, lng });
        });

        setAutocomplete(autocomplete);
      }
    };

    // Google Maps API'si yüklü değilse yükle
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeAutocomplete();
    }

    // Cleanup
    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleGuestChange = (value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      setGuests(Math.max(1, Math.min(10, numValue)))
    }
  }

  const incrementGuests = () => {
    setGuests(prev => Math.min(10, prev + 1))
  }

  const decrementGuests = () => {
    setGuests(prev => Math.max(1, prev - 1))
  }

  // Parallax ve animasyon değerleri
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroY = useTransform(scrollY, [0, 300], [0, 100])

  const handleSearch = async () => {
    if (searchPlace && checkIn && checkOut) {
      try {
        const response = await axios.get(`https://localhost:7174/api/HotelSearch`, {
          params: {
            Latitude: searchPlace.lat,
            Longitude: searchPlace.lng,
            CheckInDate: checkIn.toISOString().split('T')[0],
            CheckOutDate: checkOut.toISOString().split('T')[0],
            NumberOfGuests: guests
          }
        });

        // URL parametrelerini oluştur
        const searchParams = new URLSearchParams({
          destination: destination,
          checkIn: checkIn.toISOString().split('T')[0],
          checkOut: checkOut.toISOString().split('T')[0],
          adults: guests.toString(),
          lat: searchPlace.lat.toString(),
          lng: searchPlace.lng.toString()
        });

        // Search sayfasına yönlendir ve URL'e parametreleri ekle
        navigate(`/search?${searchParams.toString()}`, {
          state: {
            searchResults: response.data
          },
        });
      } catch (error) {
        console.error('Otel arama hatası:', error);
        toast.error('Otel araması sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } else {
      toast.warning('Lütfen konum, giriş ve çıkış tarihlerini seçin.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        className="relative h-[100vh] flex items-center justify-center w-full overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        >
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Hotel"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        <div className="relative w-full max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hayalinizdeki Tatili Keşfedin
          </motion.h1>
          <motion.p 
            className="text-xl text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            En iyi otellerde unutulmaz bir konaklama deneyimi yaşayın
          </motion.p>

          {/* Search Box */}
          <motion.div 
            className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-6 mx-4 border border-white/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Nereye?
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <input
                    id="location-input"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Şehir veya bölge adı"
                    className="w-full pl-10 pr-4 py-3 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-300 h-[45px]"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Giriş Tarihi
                </label>
                <div className="relative">
                  <FaRegCalendarAlt className="absolute left-3 top-3" />
                  <input
                    type="date"
                    value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
                    onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Çıkış Tarihi
                </label>
                <div className="relative">
                  <FaRegCalendarAlt className="absolute left-3 top-3" />
                  <input
                    type="date"
                    value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
                    onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Misafir
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3" />
                  <div 
                    className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer"
                    onClick={() => setShowGuestInput(!showGuestInput)}
                  >
                    <span className="text-white">{guests} Kişi</span>
                  </div>
                  {showGuestInput && (
                    <div className="absolute mt-2 w-full bg-white/30 backdrop-blur-md border border-white/30 rounded-lg p-4 shadow-lg z-10">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={decrementGuests}
                          className="w-8 h-8 flex items-center justify-center bg-white/30 text-white rounded-full hover:bg-white/50 transition-colors duration-300 disabled:opacity-50"
                          disabled={guests <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={guests}
                          onChange={(e) => handleGuestChange(e.target.value)}
                          className="w-16 text-center bg-transparent border border-white/30 rounded-lg text-white mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={incrementGuests}
                          className="w-8 h-8 flex items-center justify-center bg-white/30 text-white rounded-full hover:bg-white/50 transition-colors duration-300 disabled:opacity-50"
                          disabled={guests >= 10}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="h-10 w-10 bg-white/30 backdrop-blur-sm rounded-full hover:bg-white/50 transition-colors duration-300 flex items-center justify-center mt-2"
              >
                <FaSearch className="text-white text-lg" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Popular Destinations */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Popüler Destinasyonlar
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer text-white"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate('/search', { state: { destination: destination.name } })}
            >
              <div className="relative h-48">
                <motion.img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.description}</p>
                  <p className="text-sm mt-1 font-semibold">{destination.properties} tesis</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Gradient Section */}
      <motion.div 
        className="relative h-[400px] overflow-hidden bg-gradient-to-b from-gray-900/80 via-transparent to-gray-900/80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Experience"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-6"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Lüks Deneyimi Keşfedin
          </motion.h2>
          <motion.p
            className="text-xl text-center max-w-2xl"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            En seçkin otellerde unutulmaz bir konaklama deneyimi için sizleri bekliyoruz.
          </motion.p>
        </div>
      </motion.div>

      {/* About Us Section */}
     

      {/* Special Deals */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Özel Fırsatlar
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div 
                    className="flex items-center mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <FaPercent className="text-yellow-400 mr-2" />
                    <span className="text-white font-bold text-lg">{deal.discount}% İndirim</span>
                  </motion.div>
                  <motion.h3 
                    className="text-white text-xl font-bold mb-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {deal.title}
                  </motion.h3>
                  <motion.p 
                    className="text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {deal.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl font-bold text-center text-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            İş Ortaklarımız
          </motion.h2>
          <motion.div 
            className="flex items-center justify-between space-x-8 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex space-x-12 animate-scroll"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/395.png" alt="Agoda" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/3340.png" alt="Hotels.com" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/1620.png" alt="etstur" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/14.png" alt="Accor" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/522.png" alt="tatilsepeti.com" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/2608.png" alt="JollyTur" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/1860.png" alt="TatilBudur" className="grayscale hover:grayscale-0 transition-all" />
              <div className="flex items-center justify-center px-6 text-gray-500 font-medium">
                100'den fazla
              </div>
            </motion.div>
            <motion.div
              className="flex space-x-12 animate-scroll"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/395.png" alt="Agoda" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/3340.png" alt="Hotels.com" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/1620.png" alt="etstur" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/14.png" alt="Accor" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/522.png" alt="tatilsepeti.com" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/2608.png" alt="JollyTur" className="grayscale hover:grayscale-0 transition-all" />
              <img width="100" height="16" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/1860.png" alt="TatilBudur" className="grayscale hover:grayscale-0 transition-all" />
              <div className="flex items-center justify-center px-6 text-gray-500 font-medium">
                100'den fazla
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sık Sorulan Sorular */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Sık Sorulan Sorular
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Rezervasyon iptal politikanız nedir?",
                answer: "Rezervasyon iptalleri, seçilen otelin politikasına göre değişiklik gösterir. Genel olarak, check-in tarihinden 24-48 saat öncesine kadar yapılan iptallerde tam iade yapılmaktadır. Detaylı bilgi için rezervasyon onayınızda yer alan iptal koşullarını inceleyebilirsiniz."
              },
              {
                question: "Ödeme seçenekleriniz nelerdir?",
                answer: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Bazı otellerde 'Otelde Ödeme' seçeneği de sunulmaktadır. Tüm ödemeleriniz 256-bit SSL ile şifrelenerek güvenle gerçekleştirilmektedir."
              },
              {
                question: "Check-in ve check-out saatleri nelerdir?",
                answer: "Standart check-in saati 14:00, check-out saati ise 12:00'dir. Ancak bu saatler otelden otele değişiklik gösterebilir. Erken check-in veya geç check-out taleplerinizi otel ile direkt iletişime geçerek düzenleyebilirsiniz."
              },
              {
                question: "Çocuklar için yaş sınırı ve ücretlendirme nasıldır?",
                answer: "0-6 yaş arası çocuklar genellikle ücretsizdir. 7-12 yaş arası çocuklar için indirimli tarife uygulanmaktadır. Kesin bilgi için otel detaylarını incelemenizi veya müşteri hizmetlerimizle iletişime geçmenizi öneririz."
              },
              {
                question: "Rezervasyonumu nasıl değiştirebilirim?",
                answer: "Rezervasyon değişikliklerinizi hesabınızdan veya müşteri hizmetlerimizle iletişime geçerek yapabilirsiniz. Değişiklik koşulları, rezervasyonunuzun türüne ve otelin politikalarına göre farklılık gösterebilir."
              },
              {
                question: "Sadakat seviyesi sistemi nasıl çalışır?",
                answer: "Sadakat seviyesi sistemi, müşterilerimize özel ayrıcalıklar sunan 5 seviyeli bir programdır: Bronz (0-100 puan), Gümüş (100-300 puan), Altın (300-600 puan), Platin (600-1000 puan) ve Elmas (1000-2000 puan). Her rezervasyonunuzda puan kazanır ve bir üst seviyeye yükselirsiniz. Üst seviyelerde özel indirimler, erken check-in/geç check-out imkanı ve ücretsiz oda yükseltme gibi ayrıcalıklar sunulmaktadır."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="bg-white p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <motion.span
                      className="text-blue-600"
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.span>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-gray-50 overflow-hidden"
                  initial={false}
                  animate={{
                    height: activeIndex === index ? "auto" : 0,
                    opacity: activeIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="p-4 text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
   
    </div>
  )
}

export default Home; 