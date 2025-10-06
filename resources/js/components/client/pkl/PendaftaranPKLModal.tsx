import React, { useEffect, useState } from 'react';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedProgram?: any;
}

export default function PendaftaranPKLModal({ isOpen, onClose, selectedProgram }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telefon: '',
    institusi: '',
    jurusan: '',
    semester: '',
    motivasi: '',
    program_id: selectedProgram?.id || ''
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

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

  // Update form data when selected program changes
  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => ({ ...prev, program_id: selectedProgram.id }));
    }
  }, [selectedProgram]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
  };  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
        isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-200 ${
        isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-2">Daftar Program PKL</h2>
          {selectedProgram && (
            <div className="bg-white/10 rounded-lg p-3 mt-4">
              <p className="text-purple-100 text-sm">Program yang dipilih:</p>
              <p className="font-semibold">{selectedProgram.nama_posisi}</p>
              <p className="text-purple-200 text-sm">{selectedProgram.kategori} • {selectedProgram.durasi_bulan} Bulan</p>
            </div>
          )}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                value={formData.nama}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="nama@email.com"
              />
            </div>

            {/* Nomor Telefon */}
            <div>
              <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telefon *
              </label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                required
                value={formData.telefon}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Institusi */}
            <div>
              <label htmlFor="institusi" className="block text-sm font-medium text-gray-700 mb-2">
                Institusi/Sekolah/Universitas *
              </label>
              <input
                type="text"
                id="institusi"
                name="institusi"
                required
                value={formData.institusi}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Nama institusi"
              />
            </div>

            {/* Jurusan */}
            <div>
              <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700 mb-2">
                Jurusan *
              </label>
              <input
                type="text"
                id="jurusan"
                name="jurusan"
                required
                value={formData.jurusan}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Jurusan/Program Studi"
              />
            </div>

            {/* Semester */}
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <select
                id="semester"
                name="semester"
                required
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">Pilih Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          </div>

          {/* Motivasi */}
          <div className="mt-6">
            <label htmlFor="motivasi" className="block text-sm font-medium text-gray-700 mb-2">
              Motivasi Mengikuti PKL *
            </label>
            <textarea
              id="motivasi"
              name="motivasi"
              required
              rows={4}
              value={formData.motivasi}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              placeholder="Ceritakan motivasi dan tujuan Anda mengikuti program PKL ini..."
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Daftar Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
