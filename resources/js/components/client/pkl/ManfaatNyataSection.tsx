import React from 'react';

export default function ManfaatNyataSection() {
  return (
    <section className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left side - Title and Description */}
        <div>
          <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Tingkat Skill
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Manfaat Nyata yang Membuatmu
          </h2>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Lebih Siap dan Berharga di Skillmu
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Bukan sekedar belajar teori, tapi pengalaman, skill, dan bimbingan yang relevan 
            dengan kebutuhan industri. Semua dirancang agar perjalananmu lebih terarah, 
            praktis, dan siap mendukung langkah karier serta skill profesionalmu.
          </p>
        </div>

        {/* Right side - Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pengalaman Nyata */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Pengalaman Nyata</h4>
            <p className="text-sm text-gray-600">
              Belajar langsung dari dunia kerja profesional lewat proyek nyata.
            </p>
          </div>

          {/* Skill yang Bertumbuh */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Skill yang Bertumbuh</h4>
            <p className="text-sm text-gray-600">
              Mengasah kemampuan sesuai minat dan kebutuhan skillmu
            </p>
          </div>

          {/* Bimbingan Ahli */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Bimbingan Ahli</h4>
            <p className="text-sm text-gray-600">
              Dapat arahan dari mentor berpengalaman yang siap membantu berkembang.
            </p>
          </div>

          {/* Jaringan & Relasi */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Jaringan & Relasi</h4>
            <p className="text-sm text-gray-600">
              Membangun kemampuan sesuai minat dan kebutuhan skillmu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
