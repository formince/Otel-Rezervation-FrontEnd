import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUser, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

interface LayoutProps {
  children: React.ReactNode
}

const UserMenu = ({ isHomePage, isScrolled, handleLogout }: any) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
          isHomePage && !isScrolled
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <FaUser className="mr-2" />
        Hesabım
      </button>
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
          <Link
            to="/profil"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Profilim
          </Link>
          <Link
            to="/reservations"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Rezervasyonlarım
          </Link>
          <button
            onClick={() => {
              handleLogout()
              setIsUserMenuOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  )
}

const MobileMenu = ({ isLoggedIn, handleLogout }: any) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-gray-600 hover:text-blue-600"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMobileMenuOpen && (
        <nav className="md:hidden py-4 bg-white border-t">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/iletisim"
              className="text-gray-600 hover:text-blue-600 px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              İletişim
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/profil"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profilim
                </Link>
                <Link
                  to="/reservations"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rezervasyonlarım
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-left text-red-600 hover:text-red-700 px-4 py-2"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUser className="inline-block mr-2" />
                Giriş Yap
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}

const Header = ({ isHomePage, isScrolled, isLoggedIn, handleLogout }: any) => {
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-4xl font-bold relative group">
            <span className="rainbow-text">Viatoria</span>
          </Link>

          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');

              .rainbow-text {
                background: linear-gradient(
                  to right,
                  #0ea5e9,
                  #2563eb,
                  #1d4ed8,
                  #3b82f6,
                  #0ea5e9
                );
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: rainbow 8s linear infinite;
                position: relative;
                display: inline-block;
                text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
                font-family: 'Poppins', sans-serif;
                letter-spacing: 0.1em;
              }

              @keyframes rainbow {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }

              @media (hover: hover) {
                .rainbow-text:hover {
                  filter: brightness(1.2);
                  text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
                  letter-spacing: 0.15em;
                }
              }

              .letter-spacing-2 {
                letter-spacing: 0.1em;
              }
            `}
          </style>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-300 hover:text-blue-600 ${
                isHomePage && !isScrolled ? 'text-white' : 'text-gray-600'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/iletisim" 
              className={`transition-colors duration-300 hover:text-blue-600 ${
                isHomePage && !isScrolled ? 'text-white' : 'text-gray-600'
              }`}
            >
              İletişim
            </Link>
            
            {isLoggedIn ? (
              <UserMenu isHomePage={isHomePage} isScrolled={isScrolled} handleLogout={handleLogout} />
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                  isHomePage && !isScrolled
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <FaUser className="mr-2" />
                Giriş Yap
              </Link>
            )}
          </nav>

          <MobileMenu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  )
}

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Hakkımızda</h3>
            <p className="text-gray-400">
              Sizlere en iyi otel rezervasyon deneyimini sunmak için buradayız. Konfor ve lüksü uygun fiyatlarla buluşturuyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/viatoria" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="https://twitter.com/viatoria" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://twitter.com/viatoria" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#https://twitter.com/viatoria" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedinIn className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/oteller" className="text-gray-400 hover:text-white transition-colors">
                  Oteller
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-gray-400 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">İletişim Bilgileri</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400">
                <FaMapMarkerAlt className="text-xl" />
                <span>İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="text-xl" />
                <span>+90 555 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FaEnvelope className="text-xl" />
                <span>info@otelrezervasyon.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bülten</h3>
            <p className="text-gray-400 mb-4">
              En güncel fırsatlardan haberdar olmak için bültenimize abone olun.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Abone Ol
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Otel Rezervasyon. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    const handleLoginChange = () => setIsLoggedIn(!!localStorage.getItem('token'))
    window.addEventListener('loginStatusChanged', handleLoginChange)
    return () => window.removeEventListener('loginStatusChanged', handleLoginChange)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      localStorage.clear()
      sessionStorage.clear()
      setIsLoggedIn(false)
      window.dispatchEvent(new Event('loginStatusChanged'))
      delete axios.defaults.headers.common['Authorization']
      
      if (token) {
        try {
          await axios.post('https://localhost:7174/api/Auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
          })
        } catch (error) {
          console.log('Logout API hatası (önemli değil):', error)
        }
      }
      
      toast.success('Başarıyla çıkış yapıldı')
      navigate('/')
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error)
      localStorage.clear()
      sessionStorage.clear()
      setIsLoggedIn(false)
      window.dispatchEvent(new Event('loginStatusChanged'))
      delete axios.defaults.headers.common['Authorization']
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isHomePage={isHomePage} 
        isScrolled={isScrolled} 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout}
      />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-20'}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout 