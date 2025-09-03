import React from 'react';
import DaftarSertifikasi from '@/components/client/DaftarSertifikasi';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';

export default function SertifikasiPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero section with thin black overlay and background image hero-sertif.png */}
      <header
        className="relative w-full h-[420px] lg:h-[480px] bg-cover bg-center"
        style={{ backgroundImage: `url('/images/hero-sertif.png')` }}
      >
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="relative z-10 container mx-auto px-8 lg:px-12 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">Tingkatkan Skill Dengan Sertifikasi Terpercaya</h1>
            <p className="text-lg lg:text-xl text-white/90 mb-6">Kumpulan sertifikasi kredibel untuk karier yang lebih pasti dalam satu platform</p>
            <a href="#list" className="inline-block px-5 py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-semibold">Temukan Skillmu</a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 lg:px-12 py-14">
          <DaftarSertifikasi />
      </main>

      <Footer />
    </div>
  );
}