import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE_URL = 'https://localhost:7174/api'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Lütfen tüm alanları doldurun.')
      setLoading(false)
      return
    }

    try {
      // Register request
      const registerResponse = await axios.post(`${API_BASE_URL}/Auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      })

      console.log('Register response:', registerResponse.data)

      // Otomatik login işlemi
      const loginResponse = await axios.post(`${API_BASE_URL}/Auth/login`, {
        email: formData.email,
        password: formData.password
      })

      console.log('Auto login response:', loginResponse.data)

      // Token ve rol bilgilerini kaydet
      localStorage.setItem('token', loginResponse.data.token)
      localStorage.setItem('role', loginResponse.data.role)

      // Axios default headers'a token'ı ekle
      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`

      // Login event'ini tetikle
      window.dispatchEvent(new Event('loginStatusChanged'))

      toast.success('Kayıt başarılı! Otomatik giriş yapıldı.')
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Full error object:', error)
          console.error('Error response data:', error.response.data)
          console.error('Error status:', error.response.status)
          
          const errorMessage = error.response.data?.message || 
                             error.response.data?.title || 
                             'Kayıt sırasında bir hata oluştu.'
          toast.error(errorMessage)
        } else if (error.request) {
          console.error('No response received:', error.request)
          toast.error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.')
        } else {
          console.error('Error setting up request:', error.message)
          toast.error('Kayıt sırasında bir hata oluştu.')
        }
      } else {
        console.error('Unexpected error:', error)
        toast.error('Kayıt başarısız. Lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Yeni Hesap Oluştur
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Giriş yapın
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {/* Full Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                name="fullName"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ad Soyad"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="email"
                name="email"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="E-posta adresi"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white 
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
