import { useState, useEffect, ReactNode } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { FaUser, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isHomePage 
          ? isScrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-lg' 
            : 'bg-transparent'
          : 'bg-white shadow-md'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-sky-400 via-blue-500 to-violet-600 text-transparent bg-clip-text hover:from-sky-500 hover:via-blue-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105" style={{ fontFamily: 'system-ui' }}>
                  VI<span className="text-3xl tracking-normal">ATORA</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
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
                to="/hakkimizda" 
                className={`transition-colors duration-300 hover:text-blue-600 ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-gray-600'
                }`}
              >
                Hakkımızda
              </Link>
              <Link 
                to="/iletisim" 
                className={`transition-colors duration-300 hover:text-blue-600 ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-gray-600'
                }`}
              >
                İletişim
              </Link>
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
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className={`h-6 w-6 transition-colors duration-300 ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-gray-600'
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
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
                  to="/hakkimizda"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link
                  to="/iletisim"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  İletişim
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="inline-block mr-2" />
                  Giriş Yap
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content with Padding Top for Fixed Header */}
      <main className={`flex-grow ${isHomePage ? '' : 'pt-20'}`}>
        {children}
      </main>

      {/* Footer */}
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebookF className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
    </div>
  )
}

export default Layout 