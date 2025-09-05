import React from 'react';

interface Props {
  readonly formData: any;
  readonly onFormDataChange: (field: string, value: any) => void;
  readonly onNext: () => void;
}

export default function DataDiriForm({ formData, onFormDataChange, onNext }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={formData.namaLengkap}
            onChange={(e) => onFormDataChange('namaLengkap', e.target.value)}
            placeholder="Abdullah Azhar"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Tempat & Tanggal Lahir */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempat Lahir
            </label>
            <input
              type="text"
              value={formData.tempatLahir}
              onChange={(e) => onFormDataChange('tempatLahir', e.target.value)}
              placeholder="Kota Bandung"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) => onFormDataChange('tanggalLahir', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Email & Nomor Handphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange('email', e.target.value)}
              placeholder="abudulah@gmail.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Handphone
            </label>
            <input
              type="tel"
              value={formData.nomorHandphone}
              onChange={(e) => onFormDataChange('nomorHandphone', e.target.value)}
              placeholder="+62 0812345"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat
          </label>
          <textarea
            value={formData.alamat}
            onChange={(e) => onFormDataChange('alamat', e.target.value)}
            placeholder="Jln. Jln minimal no 25"
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Instagram & TikTok */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => onFormDataChange('instagram', e.target.value)}
              placeholder="@tu_abdullah"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiktok
            </label>
            <input
              type="text"
              value={formData.tiktok}
              onChange={(e) => onFormDataChange('tiktok', e.target.value)}
              placeholder="@tu_abdullah"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Dropdown Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apakah anda memiliki laptop?
            </label>
            <select
              value={formData.memilikiLaptop}
              onChange={(e) => onFormDataChange('memilikiLaptop', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Pilih jawaban</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apakah anda memiliki kamera DSLR?
            </label>
            <select
              value={formData.memilikiKameraDSLR}
              onChange={(e) => onFormDataChange('memilikiKameraDSLR', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Pilih jawaban</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>
        </div>

        {/* Transportasi Operasional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transportasi Operasional
          </label>
          <select
            value={formData.transportasiOperasional}
            onChange={(e) => onFormDataChange('transportasiOperasional', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Pilih jawaban</option>
            <option value="motor">Motor</option>
            <option value="mobil">Mobil</option>
            <option value="transportasi_umum">Transportasi Umum</option>
            <option value="jalan_kaki">Jalan Kaki</option>
          </select>
        </div>

        {/* Upload CV & Portfolio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CV & Portfolio
          </label>
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center">
            <button
              type="button"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
            >
              Upload CV
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Lanjut
          </button>
        </div>
      </form>
    </div>
  );
}
