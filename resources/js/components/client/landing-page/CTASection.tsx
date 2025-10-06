import React from 'react';

export default function CTASection() {
  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background with glassmorphism effect */}
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#EEB18B] to-[#8E28E9] flex flex-col md:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20"></div>
            
            {/* Content with relative positioning to stay above glassmorphism layer */}
            <div className="flex-1 relative z-10 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">Melangkah & Wujudkan Karir Impianmu Bersama</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8">Tingkatkan keahlianmu dan jadilah spesialis dibidang karirmu</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-purple-700/90 backdrop-blur-sm text-white font-semibold text-sm sm:text-base lg:text-lg shadow-md hover:bg-purple-800/90 border border-white/20 transition-all duration-300">Temukan Bidangmu</button>
                <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-white/20 backdrop-blur-sm text-gray-900 font-semibold text-sm sm:text-base lg:text-lg border-2 border-orange-400 hover:bg-white/30 hover:border-orange-500 transition-all duration-300">Sertifikasi Keahlianmu</button>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end relative z-10 w-full md:w-auto">
              <img src="/images/hero2.png" alt="Karir" className="rounded-xl sm:rounded-2xl object-cover w-full max-w-[280px] h-[160px] sm:max-w-[320px] sm:h-[180px] md:max-w-[360px] md:h-[220px] shadow-lg border border-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}