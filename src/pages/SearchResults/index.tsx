import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa'

const mockHotels = [
  {
    id: 1,
    name: 'Grand Luxury Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    price: 1200,
    location: 'İstanbul, Türkiye',
    amenities: ['wifi', 'parking', 'pool', 'restaurant'],
    description: 'Boğaz manzaralı lüks odalar ve dünya standartlarında hizmet.',
  },
  {
    id: 2,
    name: 'Seaside Resort & Spa',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 800,
    location: 'Antalya, Türkiye',
    amenities: ['wifi', 'pool', 'restaurant'],
    description: 'Denize sıfır konumu ve spa olanaklarıyla mükemmel bir tatil deneyimi.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
  {
    id: 3,
    name: 'City Center Hotel',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    price: 600,
    location: 'İzmir, Türkiye',
    amenities: ['wifi', 'parking', 'restaurant'],
    description: 'Şehir merkezinde konforlu konaklama ve modern olanaklar.',
  },
]

const amenityIcons = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  restaurant: FaUtensils,
}

const SearchResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  const filteredHotels = mockHotels.filter((hotel) => {
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    const matchesRating = selectedRating ? hotel.rating >= selectedRating : true
    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
    return matchesPrice && matchesRating && matchesAmenities
  })

  const handleReservation = (hotelId: number) => {
    navigate(`/hotel/${hotelId}`)
  }

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
                    defaultValue="Antalya"
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
                    defaultValue="2"
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
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
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
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {hotel.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{hotel.location}</p>
                        </div>
                        <div className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                          <span className="text-blue-600 font-semibold mr-1">
                            {hotel.rating}
                          </span>
                          <FaStar className="text-blue-600" />
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{hotel.description}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        {hotel.amenities.map((amenity) => {
                          const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                          return (
                            <Icon
                              key={amenity}
                              className="text-gray-600 h-5 w-5"
                              title={amenity}
                            />
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            ₺{hotel.price}
                          </span>
                          <span className="text-gray-600">/gece</span>
                        </div>
                        <button 
                          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                          onClick={() => handleReservation(hotel.id)}
                        >
                          Rezervasyon Yap
                        </button>
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