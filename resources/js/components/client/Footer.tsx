import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white mt-0 pt-8 sm:pt-10 lg:pt-12 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="flex flex-col md:flex-row md:justify-between gap-6 sm:gap-8 lg:gap-10">
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ujikom</h2>
          <h3 className="text-base sm:text-lg mb-4">Belajar, Tumbuh, dan Berkembang</h3>
        </div>
        <div className="flex flex-col sm:flex-row flex-1 gap-8 sm:gap-10 lg:gap-16 md:justify-end">
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Profile</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-purple-100">
              <li><a href="#tentang" className="hover:underline hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#kontak" className="hover:underline hover:text-white transition-colors">Kontak Kami</a></li>
              <li><a href="#testimoni" className="hover:underline hover:text-white transition-colors">Testimoni</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Sertifikasi</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-purple-100">
              <li><a href="#sertifikasi-bnsp" className="hover:underline hover:text-white transition-colors">Sertifikasi BNSP</a></li>
              <li><a href="#sertifikasi-industri" className="hover:underline hover:text-white transition-colors">Sertifikasi Industri</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">PKL</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-purple-100">
              <li><a href="#pkl" className="hover:underline hover:text-white transition-colors">PKL</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 sm:my-8 border-purple-300" />
      <div className="text-center text-xs sm:text-sm text-purple-100">
        @ Ujikom by PT Chlorine Digital Media 2025 - Hak Cipta Dilindungi
      </div>
    </footer>
  );
}