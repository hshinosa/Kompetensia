import React from 'react';

interface Props {
  readonly formData: any;
  readonly onFormDataChange: (field: string, value: any) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export default function BackgroundPendidikanForm({ formData, onFormDataChange, onNext, onBack }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asal Sekolah/Universitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asal Sekolah/Universitas
          </label>
          <input
            type="text"
            value={formData.asalSekolah}
            onChange={(e) => onFormDataChange('asalSekolah', e.target.value)}
            placeholder="SMK Universitas Merdeka"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Jurusan/Konsentrasi & Kelas/Semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jurusan/Konsentrasi
            </label>
            <input
              type="text"
              value={formData.jurusan}
              onChange={(e) => onFormDataChange('jurusan', e.target.value)}
              placeholder="Teknik Developer"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kelas/Semester
            </label>
            <input
              type="text"
              value={formData.kelas}
              onChange={(e) => onFormDataChange('kelas', e.target.value)}
              placeholder="Kelas XII"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Awal PKL & Akhir PKL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Awal PKL
            </label>
            <input
              type="date"
              value={formData.awalPKL}
              onChange={(e) => onFormDataChange('awalPKL', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Akhir PKL
            </label>
            <input
              type="date"
              value={formData.akhirPKL}
              onChange={(e) => onFormDataChange('akhirPKL', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Kembali
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
