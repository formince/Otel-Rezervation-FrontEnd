import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa'

interface Hotel {
  hotelId: number;
  hotelName: string;
  address: string;
  rating: number | null;
  cheapestRoomPrice: number;
  distance: number;
  hotelImageUrl: string;
}

const amenityIcons = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  restaurant: FaUtensils,
}

const SearchResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // URL'den parametreleri al
  const destination = searchParams.get('destination') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const adults = searchParams.get('adults') || '2'
  const lat = searchParams.get('lat') || ''
  const lng = searchParams.get('lng') || ''

  // API'den gelen otel sonuçlarını location state'inden al
  const searchResults = location.state?.searchResults || []

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  const filteredHotels = searchResults.filter((hotel: Hotel) => {
    // Fiyat filtresi sadece kullanıcı bir aralık belirlediğinde çalışsın
    const matchesPrice = 
      (!priceRange[0] || hotel.cheapestRoomPrice >= priceRange[0]) && 
      (!priceRange[1] || hotel.cheapestRoomPrice <= priceRange[1])
    
    const matchesRating = selectedRating ? (hotel.rating || 0) >= selectedRating : true
    return matchesPrice && matchesRating
  })

  const handleRoomSelect = (hotelId: number) => {
    // URL parametrelerini oluştur
    const params = new URLSearchParams({
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults
    });

    // Otel detay sayfasına yönlendir
    navigate(`/hotel/${hotelId}?${params.toString()}`);
  };

  // Gün sayısını hesaplayan fonksiyon
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar with Search and Filters */}
          <div className="lg:w-1/4 space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Otel Ara</h2>
              
              {/* Location */}
              <div className="mb-4">
                <div className="flex items-center border-2 rounded-xl p-3 hover:border-blue-500 transition-all duration-300">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                    <input
                      type="text"
                      placeholder="Nereye gidiyorsunuz?"
                      defaultValue={destination}
                      className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                  </div>
              </div>

              {/* Check-in */}
              <div className="mb-4">
                <div className="flex items-center border-2 rounded-xl p-3 hover:border-blue-500 transition-all duration-300">
                  <FaCalendarAlt className="text-blue-600 mr-2" />
                      <input
                        type="date"
                        className="w-full outline-none text-gray-700 bg-transparent"
                    placeholder="Giriş Tarihi"
                    defaultValue={checkIn}
                      />
                    </div>
              </div>

              {/* Check-out */}
              <div className="mb-4">
                <div className="flex items-center border-2 rounded-xl p-3 hover:border-blue-500 transition-all duration-300">
                  <FaCalendarAlt className="text-blue-600 mr-2" />
                      <input
                        type="date"
                        className="w-full outline-none text-gray-700 bg-transparent"
                    placeholder="Çıkış Tarihi"
                    defaultValue={checkOut}
                      />
                    </div>
                </div>

              {/* Guests */}
              <div className="mb-4">
                <div className="flex items-center border-2 rounded-xl p-3 hover:border-blue-500 transition-all duration-300">
                  <FaUser className="text-blue-600 mr-2" />
                    <input
                      type="number"
                      min="1"
                      defaultValue={adults}
                      className="w-full outline-none text-gray-700 bg-transparent"
                      placeholder="Misafir Sayısı"
                    />
                  </div>
              </div>

              {/* Search Button */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center font-semibold">
                  <FaSearch className="mr-2" />
                  <span>Ara</span>
              </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-6">Filtreler</h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Fiyat Aralığı</h3>
                <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={priceRange[0] || ''}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value) || null, priceRange[1]])
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Min"
                    />
                  <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1] || ''}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value) || null])
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Max"
                    />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Minimum Yıldız</h3>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`p-2 rounded-lg ${
                        selectedRating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating}
                      <FaStar className="inline ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <h3 className="text-lg font-medium mb-4">Özellikler</h3>
                <div className="space-y-3">
                  {Object.entries(amenityIcons).map(([key, Icon]) => (
                    <label
                      key={key}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(key)}
                        onChange={() => handleAmenityToggle(key)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <Icon className="text-gray-600" />
                      <span className="text-gray-700 capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hotel List */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 gap-6">
              {filteredHotels.map((hotel: Hotel) => (
                <div
                    key={hotel.hotelId}
                    onClick={() => handleRoomSelect(hotel.hotelId)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row h-[280px]">
                    <div className="md:w-2/5 relative">
                      <img
                        src={hotel.hotelImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                          alt={hotel.hotelName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Sonsuz döngüyü engellemek için
                          target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                        }}
                        />
                      </div>
                    <div className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {hotel.hotelName}
                              </h3>
                            <p className="text-gray-600 flex items-center mt-1">
                              <FaMapMarkerAlt className="mr-2" />
                                {hotel.address}
                              </p>
                            </div>
                            {hotel.rating && (
                            <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                                <span className="font-semibold mr-1">{hotel.rating}</span>
                                <FaStar />
                            </div>
                            )}
                          </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <FaWifi className="text-gray-500" />
                            <span className="text-sm text-gray-600">Her şey dahil</span>
                            </div>
                          <div className="flex items-center gap-2">
                            <FaSwimmingPool className="text-gray-500" />
                            <span className="text-sm text-gray-600">Havuz</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm">
                              Üye Fiyatı: %71 İndirim
                            </div>
                            </div>
                          </div>
                        </div>

                      <div className="flex justify-between items-start mt-6">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="text-2xl font-bold text-blue-600">
                                ₺{hotel.cheapestRoomPrice.toLocaleString('tr-TR')}
                              </p>
                            <span className="text-gray-500 text-base self-end mb-1">/gece</span>
                            </div>
                            {calculateNights() > 0 && (
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">{calculateNights()} gece için toplam:</p>
                              <p className="text-lg font-semibold text-blue-600">
                                  ₺{(hotel.cheapestRoomPrice * calculateNights()).toLocaleString('tr-TR')}
                                </p>
                              </div>
                            )}
                            <p className="text-xs text-gray-500">Vergiler ve ücretler dahildir</p>
                          </div>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRoomSelect(hotel.hotelId);
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
                          >
                            Rezervasyon Yap
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
          </div>
        </div>
    </div>
      </div>
    </div>
  )
}

export default SearchResults