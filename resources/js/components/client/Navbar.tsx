import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import LoginModal from './auth/LoginModal';

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

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { auth } = usePage<PageProps>().props;
  const user = auth?.client; // Menggunakan client auth
  const isAuthenticated = !!user;

  const handleLogout = () => {
    router.post('/client/logout');
  };

  return (
    <>
      <nav className="flex items-center px-20 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="text-2xl font-semibold mr-8">
          <Link href="/">Kompetensia</Link>
        </div>
        <div className="flex flex-1 justify-end items-center gap-8 text-lg mr-6">
          <Link href="/sertifikasi" className="hover:underline">Sertifikasi</Link>
          <Link href="/pkl" className="hover:underline">PKL</Link>
          <Link href="#tentang" className="hover:underline">Tentang</Link>
          <Link href="#testimoni" className="hover:underline">Testimoni</Link>
        </div>
        
        {/* Authentication Section */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* User Avatar */}
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.nama_lengkap?.charAt(0) || user.nama?.charAt(0) || 'U'}
              </div>
              
              {/* User Name */}
              <span className="font-semibold text-gray-900">
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
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
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
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsDropdownOpen(false);
                  }
                }}
                aria-label="Close dropdown"
              />
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
            >
              Masuk
            </button>
            <Link href="/client/register">
              <button
                className="px-6 py-2 rounded-lg border bg-white text-black font-semibold hover:bg-orange-50 transition-colors"
                style={{ borderColor: '#DD661D' }}
              >
                Daftar
              </button>
            </Link>
          </div>
        )}
      </nav>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}