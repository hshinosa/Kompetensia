import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function PendaftaranModal({ onClose }: Props) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('Batch 1 | 10 Mei 2025 - 10 Juni 2025');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // For now just close modal; integrate with backend later
    console.log({ nama, email, phone, batch });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black opacity-40" />

      <form onSubmit={submit} className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl z-10">
        <button type="button" onClick={onClose} className="absolute right-6 top-6 w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white hover:bg-orange-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Pendaftaran Sertifikasi</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className="block">
            <div className="text-sm font-medium mb-2 text-gray-700">Nama Lengkap *</div>
            <input 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
              placeholder="email@domain.com"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className="block">
            <div className="text-sm font-medium mb-2 text-gray-700">No Telepon *</div>
            <input 
              type="tel"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
              placeholder="08xxxxxxxxxx"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-2 text-gray-700">Batch Sertifikasi *</div>
            <select 
              value={batch} 
              onChange={(e) => setBatch(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              required
            >
              <option>Batch 1 | 10 Mei 2025 - 10 Juni 2025</option>
              <option>Batch 2 | 25 Agustus 2025</option>
              <option>Batch 3 | 25 Desember 2025</option>
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

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-200">
          <button 
            type="submit" 
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors"
          >
            Daftar Sekarang
          </button>
          <button 
            type="button" 
            onClick={() => alert('Ubah profile')} 
            className="w-full sm:w-auto px-8 py-3 rounded-lg border border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
          >
            Ubah Profile
          </button>
        </div>
      </form>
    </div>
  );
}
