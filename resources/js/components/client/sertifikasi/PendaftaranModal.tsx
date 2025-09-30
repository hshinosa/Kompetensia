import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { pendaftaranApi, PendaftaranSertifikasiData } from '@/lib/pendaftaran-api';

interface User {
  id: number;
  nama: string;
  nama_lengkap?: string;
  email: string;
  no_telp?: string;
  role: string;
}

interface Batch {
  id: number;
  nama_batch: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  kapasitas_peserta?: number;
  peserta_terdaftar?: number;
}

interface Sertifikasi {
  id: number;
  nama_sertifikasi: string;
  jenis_sertifikasi: string;
  deskripsi?: string;
  status: string;
  batch?: Batch[];
}

interface PageProps extends Record<string, any> {
  auth?: {
    user?: User;
    client?: User;
  };
}

interface Props {
  onClose: () => void;
  sertifikasi: Sertifikasi;
  selectedBatch?: Batch | null;
  onSuccess?: () => void;
}

export default function PendaftaranModal({ onClose, sertifikasi, selectedBatch, onSuccess }: Props) {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.client; // Menggunakan client auth
  
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [nama, setNama] = useState(user?.nama_lengkap || user?.nama || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.no_telp || '');
  
  // Set default batch - always start with "Pilih Batch" unless a specific batch is passed
  const [selectedBatchId, setSelectedBatchId] = useState<number>(
    selectedBatch?.id || 0
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsClosing(false);

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Update selectedBatchId when selectedBatch changes
  useEffect(() => {
    if (selectedBatch) {
      setSelectedBatchId(selectedBatch.id);
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Clear previous errors
    setErrors({});
    setSuccessMessage('');
    
    // Basic validation
    if (!nama.trim()) {
      setErrors(prev => ({ ...prev, nama: 'Nama lengkap wajib diisi' }));
      return;
    }
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email wajib diisi' }));
      return;
    }
    if (!phone.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Nomor telepon wajib diisi' }));
      return;
    }
    if (!selectedBatchId) {
      setErrors(prev => ({ ...prev, batch: 'Batch wajib dipilih' }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData: PendaftaranSertifikasiData = {
        sertifikasi_id: sertifikasi.id,
        batch_id: selectedBatchId,
        nama_lengkap: nama.trim(),
        email: email.trim(),
        no_telp: phone.trim(),
      };
      
      const response = await pendaftaranApi.createPendaftaranSertifikasi(formData);
      
      if (response.success) {
        setSuccessMessage('Pendaftaran sertifikasi berhasil dikirim!');
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Terjadi kesalahan saat mengirim pendaftaran' });
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Error message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          <div className="space-y-6 mb-6">
            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">Nama Lengkap *</div>
              <input 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-900 ${
                  errors.nama ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap"
                disabled={isSubmitting}
                required
              />
              {errors.nama && <p className="text-red-600 text-sm mt-1">{errors.nama}</p>}
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">Alamat Email *</div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-900 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="email@domain.com"
                disabled={isSubmitting}
                required
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
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
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-900 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="08xxxxxxxxxx"
                disabled={isSubmitting}
                required
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-2 text-gray-700">Batch Sertifikasi *</div>
              <select 
                value={selectedBatchId} 
                onChange={(e) => setSelectedBatchId(Number(e.target.value))} 
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-700 ${
                  errors.batch ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                required
              >
                <option value="">Pilih Batch</option>
                {sertifikasi.batch?.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.nama_batch} | {new Date(batch.tanggal_mulai).toLocaleDateString('id-ID')} - {new Date(batch.tanggal_selesai).toLocaleDateString('id-ID')}
                  </option>
                ))}
              </select>
              {errors.batch && <p className="text-red-600 text-sm mt-1">{errors.batch}</p>}
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
                disabled={isSubmitting}
              >
                Ubah Profile
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
