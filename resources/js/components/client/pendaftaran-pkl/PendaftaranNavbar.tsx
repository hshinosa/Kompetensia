import React from 'react';
import { Link } from '@inertiajs/react';

export default function PendaftaranNavbar() {
  return (
    <nav className="bg-white mt-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">Kompetensia</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/pkl" 
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Kembali ke PKL
            </Link>
            
            {/* User Info - if authenticated */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm">A</span>
              </div>
              <span className="text-gray-700 font-medium">Abdullah</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
