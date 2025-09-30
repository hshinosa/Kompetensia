import React from 'react';

interface Props {
  formData: any;
  onFormDataChange: (field: string, value: any) => void;
  errors?: { [key: string]: string };
  onNext: () => void;
  onBack: () => void;
}

export default function BackgroundPendidikanForm({ formData, onFormDataChange, errors = {}, onNext, onBack }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institusi Asal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institusi Asal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.institusiAsal}
            onChange={(e) => onFormDataChange('institusiAsal', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.institusi_asal ? 'border-red-500' : 'border-gray-200'}`}
            required
          >
            <option value="">Pilih Institusi</option>
            <option value="Sekolah">Sekolah</option>
            <option value="Universitas">Universitas</option>
          </select>
          {errors.institusi_asal && <p className="text-red-500 text-sm mt-1">{errors.institusi_asal}</p>}
        </div>

        {/* Asal Sekolah/Universitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asal Sekolah/Universitas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.asalSekolah}
            onChange={(e) => onFormDataChange('asalSekolah', e.target.value)}
            placeholder="SMK Universitas Merdeka"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.asal_sekolah ? 'border-red-500' : 'border-gray-200'}`}
            required
          />
          {errors.asal_sekolah && <p className="text-red-500 text-sm mt-1">{errors.asal_sekolah}</p>}
        </div>

        {/* Conditional Fields based on Institution Type */}
        {formData.institusiAsal === 'Sekolah' ? (
          <>
            {/* For Sekolah: Show Jurusan and Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jurusan}
                  onChange={(e) => onFormDataChange('jurusan', e.target.value)}
                  placeholder="Teknik Informatika"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.jurusan ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
                {errors.jurusan && <p className="text-red-500 text-sm mt-1">{errors.jurusan}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.kelas || ''}
                  onChange={(e) => onFormDataChange('kelas', e.target.value)}
                  placeholder="XII"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.kelas ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
                {errors.kelas && <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>}
              </div>
            </div>
          </>
        ) : formData.institusiAsal === 'Universitas' ? (
          <>
            {/* For Universitas: Show Program Studi and Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Studi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.programStudi || ''}
                  onChange={(e) => onFormDataChange('programStudi', e.target.value)}
                  placeholder="Teknik Informatika"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.program_studi ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
                {errors.program_studi && <p className="text-red-500 text-sm mt-1">{errors.program_studi}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester || ''}
                  onChange={(e) => onFormDataChange('semester', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.semester ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
                {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
              </div>
            </div>
          </>
        ) : (
          /* Default: Show all fields for other institution types */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Studi (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.program_studi || ''}
                  onChange={(e) => onFormDataChange('program_studi', e.target.value)}
                  placeholder="Teknik Informatika"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jurusan}
                  onChange={(e) => onFormDataChange('jurusan', e.target.value)}
                  placeholder="Teknik Developer"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.jurusan ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
                {errors.jurusan && <p className="text-red-500 text-sm mt-1">{errors.jurusan}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelas (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.kelas || ''}
                  onChange={(e) => onFormDataChange('kelas', e.target.value)}
                  placeholder="XII RPL A"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester (Opsional)
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester || ''}
                  onChange={(e) => onFormDataChange('semester', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </>
        )}

        {/* Periode PKL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Awal PKL <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.awalPKL}
              onChange={(e) => onFormDataChange('awalPKL', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.awal_pkl ? 'border-red-500' : 'border-gray-200'}`}
              required
            />
            {errors.awal_pkl && <p className="text-red-500 text-sm mt-1">{errors.awal_pkl}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Akhir PKL <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.akhirPKL}
              onChange={(e) => onFormDataChange('akhirPKL', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.akhir_pkl ? 'border-red-500' : 'border-gray-200'}`}
              required
            />
            {errors.akhir_pkl && <p className="text-red-500 text-sm mt-1">{errors.akhir_pkl}</p>}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Sebelumnya
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      </form>
    </div>
  );
}
