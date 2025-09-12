import React from 'react';

export default function HeroPKL() {
  const title = 'Program Praktik Kerja Lapangan';
  const description = 'Magang yang Bikin Kamu Lebih Siap Hadapi Dunia Kerja. Mulai dari praktik langsung, pembelajaran skill baru, hingga membangun portofolio. Semua bisa kamu dapatkan dengan lingkungan profesional.';
  const backgroundImage = "url('/images/hero-pkl.png')";

  const scrollToProgramList = () => {
    const element = document.getElementById('program-list');
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="relative w-full h-[380px] lg:h-[420px] bg-cover bg-center rounded-b-md" style={{ backgroundImage }}>
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative z-10 container mx-auto px-4 lg:px-0 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">{title}</h1>
          <p className="text-sm lg:text-base text-white/90">{description}</p>
          <div className="mt-6">
            <button 
              onClick={scrollToProgramList}
              className="px-6 py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors text-lg"
            >
              Temukan Program
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
