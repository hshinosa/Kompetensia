import React from 'react';

export default function HeroSection() {
  return (
    <section className="flex flex-row justify-between items-center px-20 py-12 relative">
      <div className="flex-1">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Satu Platform, Siap<br />Tingkatkan Kompetensimu
        </h1>
        <p className="text-xl mb-8 text-gray-700 max-w-xl">
          Mulai dari pendaftaran hingga sertifikat, kami bantu wujudkan proses yang lebih lancar, efisien, dan mudah
        </p>
        <button className="px-7 py-3 rounded-lg bg-purple-700 text-white font-semibold text-lg shadow-md hover:bg-purple-800 mb-10">
          Mulai Langkah Pertamamu
        </button>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-4">
            <img src="https://ui-avatars.com/api/?name=R+S&background=DD661D&color=fff" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://ui-avatars.com/api/?name=A+N&background=8B5CF6&color=fff" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://ui-avatars.com/api/?name=F+T&background=A78BFA&color=fff" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://ui-avatars.com/api/?name=E+L&background=C4B5FD&color=fff" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://ui-avatars.com/api/?name=I+M&background=F59E42&color=fff" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-2 text-lg font-semibold text-gray-800">4.7</span>
            </div>
            <div className="text-gray-600 text-sm">100+ Review Peserta</div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-end relative">
        <svg
          className="absolute right-0 top-0 h-[520px] w-[480px] -z-10"
          viewBox="0 0 480 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{filter: 'blur(2px)'}}
        >
          <path
            d="M480 0 Q400 260 0 520 Q480 520 480 0 Z"
            fill="url(#triangleGradient)"
          />
          <defs>
            <linearGradient id="triangleGradient" x1="0" y1="0" x2="480" y2="520" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C4B5FD" />
              <stop offset="0.5" stopColor="#A78BFA" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="grid grid-cols-2 grid-rows-2 gap-6 relative w-[600px] h-[520px]">
          <div className="row-span-2 col-span-1 rounded-3xl overflow-hidden shadow-2xl relative">
            <img src="/images/hero1.png" alt="Main" className="object-cover w-full h-full" />
            <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-base font-semibold shadow">30+ Sertifikasi Keahlian</div>
          </div>
          <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl relative">
            <img src="/images/hero2.png" alt="Peserta Didik" className="object-cover w-full h-full" />
            <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-base font-semibold shadow">100+ peserta didik</div>
          </div>
          <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl relative">
            <img src="/images/hero3.png" alt="Mentor" className="object-cover w-full h-full" />
            <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-base font-semibold shadow">10+ Mentor</div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-2/5 h-full bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 rounded-bl-[200px] -z-10"></div>
    </section>
  );
}
