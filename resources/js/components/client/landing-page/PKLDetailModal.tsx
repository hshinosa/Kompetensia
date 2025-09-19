import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface PKLProgram {
  readonly id: number;
  readonly title: string;
  readonly nama_posisi: string;
  readonly desc: string;
  readonly tags: string[];
  readonly kategori: string;
  readonly tipe: string;
  readonly durasi_bulan: number;
  readonly persyaratan: string[];
  readonly benefits: string[];
  readonly jumlah_pendaftar: number;
  readonly status: string;
}

interface Props {
  readonly program: PKLProgram | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function PKLDetailModal({ program, isOpen, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle animated close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  if (!isOpen || !program) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleDaftarProgram = () => {
    // Navigate to PKL registration with program ID
    router.visit('/pendaftaran-pkl', {
      method: 'get',
      data: { programId: program.id }
    });
  };

  // Default values for modal content
  const defaultBenefits = [
    'Mendapatkan pengalaman kerja nyata',
    'Bimbingan dari mentor berpengalaman',
    'Sertifikat completion',
    'Networking dengan profesional',
    'Portfolio project untuk karir'
  ];

  const defaultPersyaratan = [
    'Siswa SMK/Mahasiswa aktif',
    'Berstatus aktif di dunia pendidikan',
    `Jurusan ${program.kategori || 'terkait bidang'}`,
    'Memiliki motivasi tinggi untuk belajar'
  ];

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
        isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-200 ${
        isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
      }`}>
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-2">{program.title}</h2>
          <p className="text-purple-100 mb-4">{program.desc}</p>
          
          {/* Program Info */}
          <div className="flex flex-wrap gap-3">
            {program.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-sm">{tag}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-sm">{program.durasi_bulan || 3} Bulan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-sm">Unpaid</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kualifikasi */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kualifikasi</h3>
              <div className="space-y-2">
                {(program.persyaratan && program.persyaratan.length > 0 ? program.persyaratan : defaultPersyaratan).map((req, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
              <div className="space-y-2">
                {(program.benefits && program.benefits.length > 0 ? program.benefits : defaultBenefits).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              💡 <strong>Yang akan Anda dapatkan:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pengalaman kerja nyata di bidang {program.title}</li>
              <li>• Mentoring dari praktisi berpengalaman</li>
              <li>• Portfolio project untuk mendukung karir Anda</li>
              <li>• Sertifikat completion yang diakui industri</li>
              <li>• Networking dengan profesional di bidang ini</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleDaftarProgram}
            className="block w-full py-3 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors text-center"
          >
            Daftar Program Ini
          </button>
        </div>
      </div>
    </div>
  );
}