import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface User {
  id: number;
  nama: string;
  nama_lengkap?: string;
  email: string;
  no_telp?: string;
  role: string;
}

interface PageProps extends Record<string, any> {
  auth?: {
    user?: User;
    client?: User;
  };
}

interface Props {
  onClose: () => void;
  selectedBatch?: {id: number; nama_batch: string; tanggal_mulai: string; tanggal_selesai: string} | null;
}

export default function PendaftaranModal({ onClose, selectedBatch }: Props) {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.client; // Menggunakan client auth
  
  const [isClosing, setIsClosing] = useState(false);
  const [nama, setNama] = useState(user?.nama_lengkap || user?.nama || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.no_telp || '');
  
  // Set default batch based on selectedBatch or fallback to first option
  const defaultBatchOption = selectedBatch 
    ? `${selectedBatch.nama_batch} | ${new Date(selectedBatch.tanggal_mulai).toLocaleDateString('id-ID')} - ${new Date(selectedBatch.tanggal_selesai).toLocaleDateString('id-ID')}`
    : 'Batch 1 | 10 Mei 2025 - 10 Juni 2025';
  
  const [batch, setBatch] = useState(defaultBatchOption);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsClosing(false);

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Update batch when selectedBatch changes
  useEffect(() => {
    if (selectedBatch) {
      const batchText = `${selectedBatch.nama_batch} | ${new Date(selectedBatch.tanggal_mulai).toLocaleDateString('id-ID')} - ${new Date(selectedBatch.tanggal_selesai).toLocaleDateString('id-ID')}`;
      setBatch(batchText);
    }
  }, [selectedBatch]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Handle animated close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Include selected batch ID in the submission
    const formData = {
      nama,
      email,
      phone,
      batch,
      batch_id: selectedBatch?.id || null
    };
    console.log('Form submission data:', formData);
    handleClose();
  }

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
        <div className="bg-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-2">Pendaftaran Sertifikasi</h2>
          <p className="text-purple-100">Lengkapi data di bawah untuk mendaftar sertifikasi</p>
        </div>

        {/* Form Content */}
        <form onSubmit={submit} className="p-6">
          <div className="space-y-6 mb-6">
            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">Nama Lengkap *</div>
              <input 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-900" 
                placeholder="Masukkan nama lengkap"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">Alamat Email *</div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-900" 
                placeholder="email@domain.com"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">No Telepon *</div>
              <input 
                type="tel"
                value={phone} 
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPhone(value);
                }} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-900" 
                placeholder="08xxxxxxxxxx"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">Batch Sertifikasi *</div>
              <select 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-700"
                required
              >
                {selectedBatch ? (
                  <option value={defaultBatchOption}>{defaultBatchOption}</option>
                ) : (
                  <>
                    <option value="Batch 1 | 10 Mei 2025 - 10 Juni 2025">Batch 1 | 10 Mei 2025 - 10 Juni 2025</option>
                    <option value="Batch 2 | 25 Agustus 2025">Batch 2 | 25 Agustus 2025</option>
                    <option value="Batch 3 | 25 Desember 2025">Batch 3 | 25 Desember 2025</option>
                  </>
                )}
              </select>
            </label>
          </div>

        <div className="flex items-start gap-3 mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Sebelum mendaftar sertifikasi, tolong cek kembali data profil yang akan dipakai di sertifikasimu nanti.</span>
        </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => alert('Ubah profile')} 
                className="px-6 py-3 rounded-lg border border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
              >
                Ubah Profile
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
