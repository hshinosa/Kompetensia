import React, { useEffect, useState } from 'react';

export default function HeroSection() {
  const [showElips, setShowElips] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Hide elips when hero section starts to go out of view (more strict)
        setShowElips(rect.bottom > 100); // Hide when hero bottom is 100px from top
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Elips Background - Fixed position dengan conditional visibility */}
      {showElips && (
        <div className="fixed top-0 right-0 w-[1200px] h-[1000px] pointer-events-none" style={{ zIndex: 0 }}>
          <img 
            src="/images/elips-herobg.svg" 
            alt="" 
            className="w-full h-full object-contain opacity-60"
            style={{ transform: 'translate(0%, -10%)' }}
            onLoad={() => console.log('Elips SVG loaded successfully')}
            onError={(e) => {
              console.log('SVG failed to load, showing fallback');
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          {/* Fallback - inline SVG */}
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1200 1000" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse 
              cx="600" 
              cy="500" 
              rx="500" 
              ry="350" 
              fill="url(#elipsGradient)" 
            />
            <defs>
              <linearGradient id="elipsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E879F9" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#C084FC" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      <section className="relative" data-hero-section>
        <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-row justify-between items-center py-12 relative">
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-900">
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
          <div className="grid grid-cols-2 grid-rows-2 gap-6 relative w-[600px] h-[520px]">
            <div className="row-span-2 col-span-1 rounded-3xl overflow-hidden shadow-2xl relative">
              <img src="/images/hero1.png" alt="Main" className="object-cover w-full h-full" />
              <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-base text-gray-600 font-semibold shadow">30+ Sertifikasi Keahlian</div>
            </div>
            <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl relative">
              <img src="/images/hero2.png" alt="Peserta Didik" className="object-cover w-full h-full" />
              <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-base text-gray-600 font-semibold shadow">100+ peserta didik</div>
            </div>
            <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl relative">
              <img src="/images/hero3.png" alt="Mentor" className="object-cover w-full h-full" />
              <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-base text-gray-600 font-semibold shadow">10+ Mentor</div>
            </div>
          </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}