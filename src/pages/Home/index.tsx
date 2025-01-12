import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { FaStar, FaHeart, FaSwimmingPool, FaWifi, FaParking, FaCocktail, FaSearch, FaMapMarkerAlt, FaRegCalendarAlt, FaUser, FaPercent, FaPlus, FaMinus } from 'react-icons/fa'

const popularDestinations = [
  {
    id: 1,
    name: 'İstanbul',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Tarihi yarımada ve Boğaz manzarası',
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

const Home = () => {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)
  const [showGuestInput, setShowGuestInput] = useState(false)
  const { scrollY } = useScroll()

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

  const handleSearch = () => {
    navigate('/search', {
      state: {
        destination,
        checkIn,
        checkOut,
        guests,
      },
    })
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
                  <FaMapMarkerAlt className="absolute left-3 top-3" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Şehir veya otel adı"
                    className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-300"
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
      <div className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Sizin İçin Buradayız
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-blue-400 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Vision Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl h-full transform transition-all duration-300 group-hover:translate-y-[-10px] group-hover:shadow-2xl">
                <motion.div
                  className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v2m6-2v2"></path>
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Vizyonumuz</h3>
                <p className="text-blue-100 text-center leading-relaxed">
                  Seyahat deneyimini yeniden tanımlayarak, misafirlerimize unutulmaz anılar yaşatmak için çalışıyoruz.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl h-full transform transition-all duration-300 group-hover:translate-y-[-10px] group-hover:shadow-2xl">
                <motion.div
                  className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Misyonumuz</h3>
                <p className="text-blue-100 text-center leading-relaxed">
                  Her bütçeye uygun, kaliteli ve güvenilir konaklama seçenekleri sunarak müşteri memnuniyetini en üst düzeyde tutmak.
                </p>
              </div>
            </motion.div>

            {/* Values Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl h-full transform transition-all duration-300 group-hover:translate-y-[-10px] group-hover:shadow-2xl">
                <motion.div
                  className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6 mx-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Değerlerimiz</h3>
                <p className="text-blue-100 text-center leading-relaxed">
                  Güvenilirlik, şeffaflık ve müşteri odaklı hizmet anlayışıyla sektörde fark yaratıyoruz.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about')}
            >
              Daha Fazla Bilgi
            </motion.button>
          </motion.div>
        </div>
      </div>

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

      {/* Footer */}
   
    </div>
  )
}

export default Home 