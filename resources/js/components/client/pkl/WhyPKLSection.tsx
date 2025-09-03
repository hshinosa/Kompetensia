import React from 'react';

export default function WhyPKLSection() {
  return (
    <section className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Kenapa Program PKL di Kami?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Di sini, kamu belajar sambil praktik, dibimbing mentor berpengalaman, dan tumbuh bersama dengan ekosistem yang mendukung
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Image */}
        <div className="order-2 lg:order-1">
          <img 
            src="/images/why-pkl.png" 
            alt="Tim PKL bekerja sama" 
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right side - Features */}
        <div className="order-1 lg:order-2 space-y-8">
          {/* Lingkungan Kerja Profesional */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                Lingkungan Kerja Profesional
              </h3>
              <p className="text-gray-600">
                Rasakan situasi kerja yang mendukung, rapi, dan terstruktur, sehingga kamu bisa belajar sekaligus terbiasa dengan standar industri.
              </p>
            </div>
          </div>

          {/* Berkolaborasi Tim */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                Berkolaborasi Tim
              </h3>
              <p className="text-gray-600">
                Belajar bersama rekan dan profesional dari berbagai bidang untuk melatih kemampuan komunikasi, teamwork, dan problem solving secara langsung.
              </p>
            </div>
          </div>

          {/* Real-Case Project */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                Real-Case Project
              </h3>
              <p className="text-gray-600">
                Kamu akan terlibat dalam proyek nyata sehingga pengalamanmu relevan dan bisa langsung masuk ke portofolio profesional.
              </p>
            </div>
          </div>

          {/* Dibimbing oleh Mentor Terbaik */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                Dibimbing oleh Mentor Terbaik
              </h3>
              <p className="text-gray-600">
                Setiap langkahmu akan diarahkan oleh mentor berpengalaman yang siap berbagi ilmu.
              </p>
            </div>
          </div>

          {/* Berkembang Sesuai Skillmu */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                Berkembang Sesuai Skillmu
              </h3>
              <p className="text-gray-600">
                Program dirancang menyesuaikan minat dan kemampuanmu, sehingga perkembangan terasa lebih personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
