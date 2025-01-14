import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import apiService, { UserRole } from '../../services/apiService'
import { toast } from 'react-toastify'

const API_BASE_URL = 'https://localhost:7174/api'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Login attempt with:', { 
        email: email, 
        passwordLength: password.length 
      });

      // Perform login request
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, { 
        email: email, 
        password 
      }, {
        // Add this to help diagnose any CORS or network issues
        withCredentials: false
      });
      
      console.log('Login response:', response.data);

      // Prepare auth response
      const authResponse = {
        token: response.data.token,
        role: response.data.role
      };

      // Store token in localStorage
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('role', authResponse.role);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('loginStatusChanged'));

      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${authResponse.token}`;

      // Set authentication in service
      apiService.setAuth(authResponse);
      
      // Successfully logged in
      toast.success('Giriş başarılı!')

      // Navigate based on user role
      switch (authResponse.role) {
        case UserRole.SuperAdmin:
          navigate('/admin/dashboard')
          break
        case UserRole.HotelAdmin:
          navigate('/hotel/dashboard')
          break
        case UserRole.User:
          navigate('/user/dashboard')
          break
        default:
          navigate('/')
      }
    } catch (error) {
      // Handle login error
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Full error object:', error);
          console.error('Error response data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          
          // More detailed error toast
          const errorMessage = error.response.data?.message || 
                               error.response.data?.title || 
                               'Hatalı giriş, lütfen tekrar deneyin.';
          toast.error(errorMessage);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          toast.error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.')
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
          toast.error('Giriş sırasında bir hata oluştu.')
        }
      } else {
        // Non-Axios error
        console.error('Unexpected error:', error);
        toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
      }
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = () => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Yeni hesap oluşturun
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="email"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="E-posta adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Şifremi unuttum
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Veya şununla devam et</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                Facebook
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
