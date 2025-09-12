import React from 'react';

interface Props {
  readonly formData: any;
  readonly onFormDataChange: (field: string, value: any) => void;
  readonly onBack: () => void;
  readonly programId?: number;
}

export default function KebijakanFinalisasiForm({ formData, onFormDataChange, onBack, programId }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle final submission with programId
    console.log('Form submitted:', { ...formData, programId });
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden field for program ID */}
        {programId && (
          <input
            type="hidden"
            name="program_id"
            value={programId}
          />
        )}
        
        {/* Sudah melihat profil PT Chlorine Digital Media */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Apakah Anda sudah melihat profil perusahaan PT Chlorine Digital Media pada website berikut?
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="sudahMelihatProfil"
                value="sudah"
                checked={formData.sudahMelihatProfil === 'sudah'}
                onChange={(e) => onFormDataChange('sudahMelihatProfil', e.target.value)}
                className="mr-3 text-purple-600"
                required
              />
              <span className="text-gray-700">Sudah</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sudahMelihatProfil"
                value="belum"
                checked={formData.sudahMelihatProfil === 'belum'}
                onChange={(e) => onFormDataChange('sudahMelihatProfil', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-gray-700">Belum</span>
            </label>
          </div>
        </div>

        {/* Tingkat Motivasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Skala Tingkat motivasi anda dalam mengikuti kegiatan PKL di PT Chlorine Digital Media
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">1</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => onFormDataChange('tingkatMotivasi', number)}
                  className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
                    formData.tingkatMotivasi === number
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-300 text-gray-600 hover:border-purple-400'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">10</span>
          </div>
        </div>

        {/* Nilai diri berdasarkan penilaian berikut */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Nilai diri Anda berdasarkan penilaian berikut ini
          </p>
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="radio"
                name="nilaiDiri"
                value="A"
                checked={formData.nilaiDiri === 'A'}
                onChange={(e) => onFormDataChange('nilaiDiri', e.target.value)}
                className="mr-3 mt-1 text-purple-600"
                required
              />
              <div>
                <span className="font-medium text-gray-700">Grade A:</span>
                <span className="text-gray-600 ml-1">Mampu membuat dan kreatif things. Mandiri serta bisa explore hal-hal baru</span>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                name="nilaiDiri"
                value="B"
                checked={formData.nilaiDiri === 'B'}
                onChange={(e) => onFormDataChange('nilaiDiri', e.target.value)}
                className="mr-3 mt-1 text-purple-600"
              />
              <div>
                <span className="font-medium text-gray-700">Grade B:</span>
                <span className="text-gray-600 ml-1">Rajin tetapi perlu diarahkan tugas apa pergerakan yang sesuai perusahaan karena untuk otaknya membuat sebuah konten masih kurang untuk konsep</span>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                name="nilaiDiri"
                value="C"
                checked={formData.nilaiDiri === 'C'}
                onChange={(e) => onFormDataChange('nilaiDiri', e.target.value)}
                className="mr-3 mt-1 text-purple-600"
              />
              <div>
                <span className="font-medium text-gray-700">Grade C:</span>
                <span className="text-gray-600 ml-1">Rajin lebih besar pergerakan bagus namun tidak menguasai perusahaan karena utamanya tidak memiliki kemampuan tinggi dibidang untuk saat ini</span>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                name="nilaiDiri"
                value="D"
                checked={formData.nilaiDiri === 'D'}
                onChange={(e) => onFormDataChange('nilaiDiri', e.target.value)}
                className="mr-3 mt-1 text-purple-600"
              />
              <div>
                <span className="font-medium text-gray-700">Grade D:</span>
                <span className="text-gray-600 ml-1">Susah untuk lemas dan kurang tinggi tidak membutuhkan di tingkat kurang tetapi senang melihat gaya layar</span>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                name="nilaiDiri"
                value="E"
                checked={formData.nilaiDiri === 'E'}
                onChange={(e) => onFormDataChange('nilaiDiri', e.target.value)}
                className="mr-3 mt-1 text-purple-600"
              />
              <div>
                <span className="font-medium text-gray-700">Grade E:</span>
                <span className="text-gray-600 ml-1">Memiliki motivasi tinggi akan dapat membangun di industri kreatif tetapi sebuah perusahaan harus menuntun saya</span>
              </div>
            </label>
          </div>
        </div>

        {/* Apakah Anda merokok */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Apakah Anda merokok?
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="apakahMerokok"
                value="ya"
                checked={formData.apakahMerokok === 'ya'}
                onChange={(e) => onFormDataChange('apakahMerokok', e.target.value)}
                className="mr-3 text-purple-600"
                required
              />
              <span className="text-gray-700">Ya</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="apakahMerokok"
                value="tidak"
                checked={formData.apakahMerokok === 'tidak'}
                onChange={(e) => onFormDataChange('apakahMerokok', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-gray-700">Tidak</span>
            </label>
          </div>
        </div>

        {/* Bersedia ditempatkan ke sekolah atau kampus */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Saya bersedia ditempatkan ke sekolah atau kampus jika melanggar aturan di perusahaan
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="bersediaDitempatkan"
                value="ya"
                checked={formData.bersediaDitempatkan === 'ya'}
                onChange={(e) => onFormDataChange('bersediaDitempatkan', e.target.value)}
                className="mr-3 text-purple-600"
                required
              />
              <span className="text-gray-700">Ya</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="bersediaDitempatkan"
                value="tidak"
                checked={formData.bersediaDitempatkan === 'tidak'}
                onChange={(e) => onFormDataChange('bersediaDitempatkan', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-gray-700">Tidak</span>
            </label>
          </div>
        </div>

        {/* Bersedia masuk 2 kali tanpa izin */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Saya bersedia ditempatkan ke sekolah atau kampus jika tidak masuk 2 kali tanpa izin
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="bersediaMasuk2Kali"
                value="ya"
                checked={formData.bersediaMasuk2Kali === 'ya'}
                onChange={(e) => onFormDataChange('bersediaMasuk2Kali', e.target.value)}
                className="mr-3 text-purple-600"
                required
              />
              <span className="text-gray-700">Ya</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="bersediaMasuk2Kali"
                value="tidak"
                checked={formData.bersediaMasuk2Kali === 'tidak'}
                onChange={(e) => onFormDataChange('bersediaMasuk2Kali', e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-gray-700">Tidak</span>
            </label>
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
            Daftar
          </button>
        </div>
      </form>
    </div>
  );
}
