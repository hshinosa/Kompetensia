import React from 'react';

export default function ManfaatNyataSection() {
  return (
    <section id="manfaat" className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Manfaat Nyata yang Membuatmu
        </h2>
        <h3 className="text-3xl font-bold text-gray-900 mb-6">
          Lebih Siap dan Berharga di Skillmu
        </h3>
        <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Setiap program dirancang dengan kurikulum yang terfokus pada skill praktis yang sebenar-nya dibutuhkan industri. 
          Kamu akan menghadapi tantangan nyata dan mendapatkan kompetisi tingkat dunia skala internasional profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pengelolaan Aneka Jasa */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Pengelolaan Aneka Jasa</h4>
          <p className="text-sm text-gray-600 mb-4">
            Belajar mengelola berbagai jenis layanan profesional dengan standar internasional
          </p>
          <div className="text-xs text-gray-500">Pembelajaran bisnis aneka jasa</div>
        </div>

        {/* Skill yang Pas untuk Lulusan */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Skill yang Pas untuk Lulusan</h4>
          <p className="text-sm text-gray-600 mb-4">
            Dapatkan keahlian yang sesuai dengan kebutuhan pasar kerja saat ini
          </p>
          <div className="text-xs text-gray-500">Kesesuaian dengan industri</div>
        </div>

        {/* Sertifikat Ahli */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Sertifikat Ahli</h4>
          <p className="text-sm text-gray-600 mb-4">
            Dapatkan sertifikat resmi yang menunjukkan keahlianmu di bidang tertentu
          </p>
          <div className="text-xs text-gray-500">Sertifikasi internasional terakreditasi</div>
        </div>

        {/* Jamingan & Relasi */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Jamingan & Relasi</h4>
          <p className="text-sm text-gray-600 mb-4">
            Bangun jaringan profesional yang kuat dengan sesama praktisi dan industri
          </p>
          <div className="text-xs text-gray-500">Networking profesional</div>
        </div>
      </div>
    </section>
  );
}
