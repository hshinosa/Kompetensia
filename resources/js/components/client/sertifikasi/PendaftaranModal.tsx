import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function PendaftaranModal({ onClose }: Props) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('Batch 1 | 10 Mei 2025 - 10 Juni 2025');
  const [agree, setAgree] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // For now just close modal; integrate with backend later
    console.log({ nama, email, phone, batch, agree });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
  <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black opacity-40" />

      <form onSubmit={submit} className="relative bg-white rounded-2xl w-[520px] max-w-full p-6 shadow-lg z-10">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">✕</button>
        <h3 className="text-2xl font-semibold mb-4">Pendaftaran Sertifikasi</h3>

        <label className="block mb-3">
          <div className="text-sm font-medium mb-1">Nama Lengkap</div>
          <input value={nama} onChange={(e) => setNama(e.target.value)} className="w-full border border-purple-300 rounded px-3 py-2" />
        </label>

        <label className="block mb-3">
          <div className="text-sm font-medium mb-1">Alamat email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-purple-300 rounded px-3 py-2" />
        </label>

        <label className="block mb-3">
          <div className="text-sm font-medium mb-1">No Telepon</div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-purple-300 rounded px-3 py-2" />
        </label>

        <label className="block mb-3">
          <div className="text-sm font-medium mb-1">Batch Sertifikasi</div>
          <select value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full border border-purple-300 rounded px-3 py-2">
            <option>Batch 1 | 10 Mei 2025 - 10 Juni 2025</option>
            <option>Batch 2 | 25 Agustus 2025</option>
            <option>Batch 3 | 25 Desember 2025</option>
          </select>
        </label>

        <label className="flex items-start gap-3 mb-4 text-sm">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="w-4 h-4 border-purple-300" />
          <span> sebelum mendaftar sertifikasi, tolong cek kembali data profile yang akan dipakai di sertifikasimu nanti.</span>
        </label>

        <div className="flex items-center gap-4 mt-4">
          <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white font-semibold">Daftar</button>
          <button type="button" onClick={() => alert('Ubah profile')} className="px-6 py-2 rounded border border-orange-400 text-orange-700">Ubah Profile</button>
        </div>
      </form>
    </div>
  );
}
