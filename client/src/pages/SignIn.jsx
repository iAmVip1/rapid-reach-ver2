import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'))
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if(res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400 to-emerald-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Side - Hero Section */}
            <div className="lg:w-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
              </div>
              
              <div className="relative z-10 text-white">
                <div className="flex items-center justify-center lg:justify-start mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-4">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/250px-Flag_of_the_Red_Cross.svg.png" 
                      alt="Rapid Reach Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">Rapid Reach</h1>
                    <p className="text-emerald-100 text-sm">Emergency Response System</p>
                  </div>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-center lg:text-left">
                  Welcome Back!
                </h2>
                <p className="text-emerald-100 text-center lg:text-left mb-8 leading-relaxed">
                  Sign in to access your emergency response dashboard and continue providing vital services to your community.
                </p>
                
                {/* Feature Highlights */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full p-2 mr-3">
                      <FaShieldAlt className="w-4 h-4" />
                    </div>
                    <span className="text-emerald-100">Secure & Reliable Access</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full p-2 mr-3">
                      <FaShieldAlt className="w-4 h-4" />
                    </div>
                    <span className="text-emerald-100">Real-time Emergency Response</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full p-2 mr-3">
                      <FaShieldAlt className="w-4 h-4" />
                    </div>
                    <span className="text-emerald-100">Community Safety First</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                  <p className="text-gray-600">Access your emergency response dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="email" 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your email address"
                        id="email"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your password"
                        id="password"
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* OAuth Section */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <OAuth />

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <Link 
                        to='/sign-up' 
                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline-offset-2 hover:underline"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

