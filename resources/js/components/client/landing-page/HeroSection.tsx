import React, { useEffect, useState } from 'react';

export default function HeroSection() {
  const [elipsOpacity, setElipsOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const heroHeight = rect.height;
        const scrolled = -rect.top;
        
        // Calculate opacity based on scroll position
        // Start fading when scroll reaches 30% of hero height
        // Complete fade when scroll reaches 70% of hero height
        const fadeStart = heroHeight * 0.3;
        const fadeEnd = heroHeight * 0.7;
        
        if (scrolled < fadeStart) {
          setElipsOpacity(1);
        } else if (scrolled > fadeEnd) {
          setElipsOpacity(0);
        } else {
          // Linear fade between fadeStart and fadeEnd
          const fadeProgress = (scrolled - fadeStart) / (fadeEnd - fadeStart);
          setElipsOpacity(1 - fadeProgress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Elips Background - Fixed position with smooth fade on scroll */}
      <div 
        className="fixed top-0 right-0 pointer-events-none overflow-hidden hidden sm:block"
        style={{ 
          zIndex: 0,
          width: '100%',
          height: '100vh',
          opacity: elipsOpacity,
          transition: 'opacity 0.1s ease-out'
        }}
      >
        <div 
          className="absolute"
          style={{
            top: '-10%',
            right: '-15%',
            width: '1200px',
            height: '1000px',
            maxWidth: '70vw',
            maxHeight: '120vh'
          }}
        >
          <img 
            src="/images/elips-herobg.svg" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ opacity: 0.6 }}
          />
        </div>
      </div>

      <section className="relative" data-hero-section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center py-8 sm:py-12 lg:py-16 relative gap-8 lg:gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
            Satu Platform, Siap<br />Tingkatkan Kompetensimu
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-700 max-w-xl mx-auto lg:mx-0">
            Mulai dari pendaftaran hingga sertifikat, kami bantu wujudkan proses yang lebih lancar, efisien, dan mudah
          </p>
          <button className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg bg-purple-700 text-white font-semibold text-base sm:text-lg shadow-md hover:bg-purple-800 mb-6 sm:mb-10 w-full sm:w-auto">
            Mulai Langkah Pertamamu
          </button>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <div className="flex -space-x-3 sm:-space-x-4">
              <img src="https://ui-avatars.com/api/?name=R+S&background=DD661D&color=fff" alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
              <img src="https://ui-avatars.com/api/?name=A+N&background=8B5CF6&color=fff" alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
              <img src="https://ui-avatars.com/api/?name=F+T&background=A78BFA&color=fff" alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
              <img src="https://ui-avatars.com/api/?name=E+L&background=C4B5FD&color=fff" alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
              <img src="https://ui-avatars.com/api/?name=I+M&background=F59E42&color=fff" alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <span className="text-yellow-400 text-lg sm:text-xl">★</span>
                <span className="text-yellow-400 text-lg sm:text-xl">★</span>
                <span className="text-yellow-400 text-lg sm:text-xl">★</span>
                <span className="text-yellow-400 text-lg sm:text-xl">★</span>
                <span className="text-yellow-400 text-lg sm:text-xl">★</span>
                <span className="ml-2 text-base sm:text-lg font-semibold text-gray-800">4.7</span>
              </div>
              <div className="text-gray-600 text-xs sm:text-sm">100+ Review Peserta</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center lg:justify-end relative w-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 lg:gap-6 relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] h-[320px] sm:h-[420px] lg:h-[520px]">
            <div className="row-span-2 col-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl relative">
              <img src="/images/hero1.png" alt="Main" className="object-cover w-full h-full" />
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/90 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base text-gray-600 font-semibold shadow">30+ Sertifikasi Keahlian</div>
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl relative">
              <img src="/images/hero2.png" alt="Peserta Didik" className="object-cover w-full h-full" />
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base text-gray-600 font-semibold shadow">100+ peserta didik</div>
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl relative">
              <img src="/images/hero3.png" alt="Mentor" className="object-cover w-full h-full" />
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/90 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base text-gray-600 font-semibold shadow">10+ Mentor</div>
            </div>
          </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}