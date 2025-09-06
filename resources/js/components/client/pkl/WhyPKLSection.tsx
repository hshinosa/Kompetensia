import React from 'react';

export default function WhyPKLSection() {
  return (
    <section id="why-pkl" className="py-16">
      {/* Title and Description */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Kenapa Program PKL di Kami?
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Di sini, kamu belajar sambil praktik, dibimbing mentor berpengalaman, dan tumbuh bersama dengan ekosistem yang mendukung
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left side - Image */}
        <div>
          <img 
            src="/images/why-pkl.png" 
            alt="Tim PKL bekerja sama" 
            className="w-full h-auto object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right side - Features */}
        <div className="space-y-6">
          {/* Lingkungan Kerja Profesional */}
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-gray-900 px-3 py-1 rounded-full inline-block">
                Lingkungan Kerja Profesional
              </h3>
              <p className="text-gray-600">
                Rasakan situasi kerja yang mendukung, rapi, dan terstruktur, sehingga kamu bisa belajar sekaligus terbiasa dengan standar industri.
              </p>
            </div>
          </div>

          {/* Berkolaborasi Tim */}
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-gray-900 px-3 py-1 rounded-full inline-block">
                Berkolaborasi Tim
              </h3>
              <p className="text-gray-600">
                Belajar bersama rekan dan profesional dari berbagai bidang untuk melatih kemampuan komunikasi, teamwork, dan problem solving secara langsung.
              </p>
            </div>
          </div>

          {/* Real-Case Project */}
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-gray-900 px-3 py-1 rounded-full inline-block">
                Real-Case Project
              </h3>
              <p className="text-gray-600">
                Kamu akan terlibat dalam proyek nyata sehingga pengalamanmu relevan dan bisa langsung masuk ke portofolio profesional.
              </p>
            </div>
          </div>

          {/* Dibimbing oleh Mentor Terbaik */}
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-gray-900 px-3 py-1 rounded-full inline-block">
                Dibimbing oleh Mentor Terbaik
              </h3>
              <p className="text-gray-600">
                Setiap langkahmu akan diarahkan oleh mentor berpengalaman yang siap berbagi ilmu.
              </p>
            </div>
          </div>

          {/* Berkembang Sesuai Skillmu */}
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 bg-purple-100 text-gray-900 px-3 py-1 rounded-full inline-block">
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
