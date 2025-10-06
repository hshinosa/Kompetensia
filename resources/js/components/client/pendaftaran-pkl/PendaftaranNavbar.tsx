import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import SettingsModal from '../SettingsModal';

interface User {
  id: number;
  nama: string;
  nama_lengkap?: string;
  email: string;
  role: string;
}

interface PageProps extends Record<string, any> {
  auth?: {
    user?: User;
    client?: User;
  };
}

export default function PendaftaranNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { auth } = usePage<PageProps>().props;
  const user = auth?.client; // Menggunakan client auth
  const isAuthenticated = !!user;
  
  // Get user-specific localStorage key
  const getPhotoStorageKey = () => user ? `user_profile_photo_${user.id}` : 'user_profile_photo';
  
  const [fotoProfil, setFotoProfil] = useState<string | null>(() => {
    return user ? localStorage.getItem(getPhotoStorageKey()) || null : null;
  });

  // Fetch profile photo from server when user logs in
  React.useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!user) return;
      
      const key = getPhotoStorageKey();
      const cachedPhoto = localStorage.getItem(key);
      
      // If no cached photo, fetch from server
      if (!cachedPhoto) {
        try {
          const response = await fetch('/api/settings/profile');
          const data = await response.json();
          
          if (data.success && data.data.foto_profil) {
            const photoUrl = data.data.foto_profil;
            setFotoProfil(photoUrl);
            localStorage.setItem(key, photoUrl);
          }
        } catch (error) {
          // Error handled silently
        }
      } else {
        // Use cached photo
        setFotoProfil(cachedPhoto);
      }
    };

    fetchProfilePhoto();
  }, [user?.id]); // Only re-run when user ID changes (login/switch user)

  // Listen to localStorage changes from SettingsModal
  React.useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        const savedPhoto = localStorage.getItem(getPhotoStorageKey());
        setFotoProfil(savedPhoto);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-photo-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-photo-updated', handleStorageChange);
    };
  }, [user]);

  // Load photo when modal closes
  React.useEffect(() => {
    if (!isSettingsModalOpen && user) {
      const savedPhoto = localStorage.getItem(getPhotoStorageKey());
      setFotoProfil(savedPhoto);
    }
  }, [isSettingsModalOpen, user]);

  const handleLogout = () => {
    router.post('/client/logout', {}, {
      preserveScroll: true,
      preserveState: false,
      onBefore: () => {
        // Close dropdown immediately
        setIsDropdownOpen(false);
        // Clear user-specific photo from localStorage
        if (user) {
          localStorage.removeItem(getPhotoStorageKey());
        }
      },
      onError: (errors) => {
        // Error handled silently
      }
    });
  };

  return (
    <>
      <nav className="flex items-center px-4 sm:px-6 lg:px-20 py-4 lg:py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="text-xl sm:text-2xl font-semibold mr-4 sm:mr-8 text-gray-900">
          <Link href="/">Ujikom</Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-6 xl:gap-8 text-base xl:text-lg text-gray-900">
          <Link 
            href="/client/pkl" 
            className="hover:underline hover:text-purple-700 transition-colors"
          >
            Kembali ke PKL
          </Link>
          
          {/* Authentication Section - Desktop */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-purple-600">
                  {fotoProfil ? (
                    <img 
                      src={fotoProfil} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{user.nama_lengkap?.charAt(0) || user.nama?.charAt(0) || 'U'}</span>
                  )}
                </div>
                
                {/* User Name */}
                <span className="hidden xl:block font-semibold text-gray-900 text-sm lg:text-base">
                  {user.nama_lengkap || user.nama}
                </span>
                
                {/* Dropdown Icon */}
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.nama_lengkap || user.nama}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 5l4-4 4 4" />
                    </svg>
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Pengaturan
                  </button>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
              
              {/* Overlay to close dropdown when clicking outside */}
              {isDropdownOpen && (
                <button 
                  className="fixed inset-0 z-40 bg-transparent border-none cursor-default"
                  onClick={() => setIsDropdownOpen(false)}
                  aria-label="Close dropdown"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm">?</span>
              </div>
              <span className="text-gray-700 font-medium">Guest</span>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-white z-40 overflow-y-auto">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Link */}
            <Link 
              href="/client/pkl" 
              className="block py-3 px-4 text-gray-900 hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kembali ke PKL
            </Link>
            
            <hr className="my-4 border-gray-200" />
            
            {/* Authentication Section - Mobile */}
            {isAuthenticated ? (
              <div className="space-y-2">
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-purple-600">
                    {fotoProfil ? (
                      <img 
                        src={fotoProfil} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.nama_lengkap?.charAt(0) || user.nama?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.nama_lengkap || user.nama}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                {/* Menu Items */}
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 5l4-4 4 4" />
                  </svg>
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    setIsSettingsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pengaturan
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4">
                <div className="flex items-center space-x-3 py-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium">?</span>
                  </div>
                  <span className="text-gray-700 font-medium">Guest</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal 
          isOpen={isSettingsModalOpen} 
          onClose={() => setIsSettingsModalOpen(false)} 
        />
      )}
    </>
  );
}
