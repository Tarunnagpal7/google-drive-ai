import { googleLogout } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiFolder, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../store/authSlice';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);


  const handleLoginSuccess = async (credentialResponse) => {
    try {
      console.log('Credential Response:', credentialResponse);
      
      // Method 1: Decode JWT token to get user info (recommended)
      if (credentialResponse.credential) {
        // Decode the JWT token
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const userInfo = JSON.parse(jsonPayload);

        // Store token and user data
        localStorage.setItem('token', credentialResponse.credential);
        dispatch(setCredentials({
          user: {
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            sub: userInfo.sub
          },
          token: credentialResponse.credential
        }));
        
        setIsMenuOpen(false);
        navigate('/dashboard');
      }
      
      // Method 2: Alternative approach using Google API (if you have access_token)
      else if (credentialResponse.access_token) {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${credentialResponse.access_token}`,
          },
        }).then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        });

        localStorage.setItem('token', credentialResponse.access_token);
        dispatch(setCredentials({
          user: userInfo,
          token: credentialResponse.access_token
        }));
        
        setIsMenuOpen(false);
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      // Handle error appropriately
      alert('Login failed. Please try again.');
    }
  };

  const handleLoginError = (error) => {
    console.error('Google Login Error:', error);
    
    // Handle specific error types
    if (error?.error === 'popup_closed_by_user') {
      console.log('User closed the popup');
      return;
    }
    
    if (error?.error === 'access_denied') {
      console.log('User denied access');
      return;
    }
    
    // Only show alert for unexpected errors
    if (error?.error && !['popup_closed_by_user', 'access_denied'].includes(error.error)) {
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    try {
      googleLogout();
      dispatch(logout());
      localStorage.removeItem('token');
      setIsMenuOpen(false);
      navigate('/');
      window.location.href = `${process.env.VITE_BACKEND_URL}/logout`;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="glass p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            
            {/* Left Side - Logo/Brand and Navigation */}
            <div className="flex items-center space-x-6">
              {/* Logo/Brand Section */}
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FiHome size={18} className="text-white" />
                </div>
                <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DRIVE-AI
                </span>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                
                {isAuthenticated && (
                  <button 
                    onClick={() => handleNavigation('/dashboard')}
                    className="flex items-center space-x-2  hover:text-purple-300 transition"
                  >
                    <FiFolder size={20} />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Right Side - User Info and Auth */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {user && (
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full pl-2 pr-4 py-1 border border-white/10">
                      {user.picture ? (
                        <img 
                          src={user.picture} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full border-2 border-purple-400"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                          <FiUser className="text-white text-sm" />
                        </div>
                      )}
                      <span className="font-medium text-sm">
                        {user.name || user.email || 'User'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-white"
                  >
                    <FiLogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  useOneTap={false}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  auto_select={false}
                  cancel_on_tap_outside={true}
                />
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
                >
                  {isMenuOpen ? (
                    <FiX size={20} className="text-white" />
                  ) : (
                    <FiMenu size={20} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="glass mt-4 mx-4 rounded-lg">
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {isAuthenticated && (
                  <button 
                    onClick={() => handleNavigation('/dashboard')}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white group"
                  >
                    <FiFolder size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Dashboard</span>
                  </button>
                )}
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {user && (
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        {user.picture ? (
                          <img 
                            src={user.picture} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <FiUser className="text-white text-lg" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {user.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-3 rounded-xl transition-all duration-200 text-white font-medium shadow-lg"
                    >
                      <FiLogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                      useOneTap={false}
                      theme="filled_black"
                      shape="pill"
                      size="large"
                      auto_select={false}
                      cancel_on_tap_outside={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}