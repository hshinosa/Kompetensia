import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LoginModal from '../auth/LoginModal';

interface SertifikasiItem {
  readonly id: number;
  readonly title: string;
  readonly batch: string;
  readonly date: string;
  readonly rating: string;
  readonly peserta: number;
  readonly kategori: string;
  readonly img?: string;
  readonly mentor: string;
  readonly slug?: string;
  readonly type?: string;
}

interface Props {
  readonly sertifikasi: SertifikasiItem;
  readonly onDetailClick?: (sertifikasi: SertifikasiItem) => void;
  readonly onRegisterClick?: (sertifikasi: SertifikasiItem) => void;
}

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

export default function SertifikasiCard({ sertifikasi, onDetailClick, onRegisterClick }: Props) {
  const { auth } = usePage<PageProps>().props;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const user = auth?.client;
  const isAuthenticated = !!user;

  const handleAmbilKelas = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // Jika ada callback untuk register, gunakan itu untuk membuka modal pendaftaran
    if (onRegisterClick) {
      onRegisterClick(sertifikasi);
    } else if (sertifikasi.slug && sertifikasi.slug !== '#') {
      // Fallback ke halaman detail jika tidak ada callback register
      window.location.href = `/detailsertifikasi/${sertifikasi.slug}`;
    }
  };

  const handlePelajariKelas = () => {
    if (sertifikasi.slug && sertifikasi.slug !== '#') {
      window.location.href = `/detailsertifikasi/${sertifikasi.slug}`;
    } else if (onDetailClick) {
      onDetailClick(sertifikasi);
    }
  };

  return (
    <>
      <article className="bg-white border-2 border-purple-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-purple-600 transition-all duration-300 min-h-[450px] flex flex-col">
        <div className="relative">
          {sertifikasi.img ? (
            <img 
              src={sertifikasi.img} 
              alt={sertifikasi.title} 
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <span className="absolute left-3 top-3 text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
            {sertifikasi.kategori}
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900">{sertifikasi.title}</h3>
          <div className="text-sm text-gray-600 mb-3 min-h-[2.5rem] flex items-start">{sertifikasi.batch} • {sertifikasi.date}</div>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{sertifikasi.rating}</span>
            </div>
            <div className="text-xs text-gray-500">(496)</div>
          </div>

          <div className="text-sm text-gray-600 mb-4">👥 {sertifikasi.peserta} Peserta</div>

          <div className="flex items-center gap-3 mb-4 mt-auto">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(sertifikasi.mentor)}&background=8B5CF6&color=fff`} 
              alt="mentor" 
              className="w-8 h-8 rounded-full border-2 border-white" 
            />
            <div className="text-sm font-medium line-clamp-1 text-gray-900">{sertifikasi.mentor}</div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleAmbilKelas}
              className="flex-1 px-3 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
            >
              Ambil Kelas
            </button>
            <button 
              onClick={handlePelajariKelas}
              className="px-3 py-2 rounded-lg border border-orange-400 text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
            >
              Pelajari Kelas
            </button>
          </div>
        </div>
      </article>
      
      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </>
  );
}
