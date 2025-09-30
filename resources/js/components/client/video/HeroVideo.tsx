import React from 'react';

export default function HeroVideo() {
  const title = 'Video Tutorial & Learning';
  const description = 'Pelajari skill baru melalui video pembelajaran berkualitas tinggi. Dari tutorial teknologi hingga soft skills, semua tersedia untuk mendukung pengembangan karir Anda.';
  const backgroundImage = "url('/images/hero-video.png')";

  const scrollToVideoList = () => {
    const element = document.getElementById('video-list');
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
              onClick={scrollToVideoList}
              className="px-6 py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors text-lg"
            >
              Tonton Video
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}