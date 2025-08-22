import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white mt-0 pt-12 pb-6 px-20">
      <div className="flex flex-col md:flex-row md:justify-between gap-10">
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-2">Kompetensia</h2>
          <h3 className="text-lg mb-4">Belajar, Tumbuh, dan Berkembang</h3>
          <p className="text-sm text-purple-100 mb-8 max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="flex flex-1 gap-16 justify-end">
          <div>
            <h4 className="font-semibold mb-3">Profile</h4>
            <ul className="space-y-2 text-purple-100">
              <li><a href="#tentang" className="hover:underline">Tentang Kami</a></li>
              <li><a href="#kontak" className="hover:underline">Kontak Kami</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Sertifikasi</h4>
            <ul className="space-y-2 text-purple-100">
              <li><a href="#sertifikasi-bnsp" className="hover:underline">Sertifikasi BNSP</a></li>
              <li><a href="#sertifikasi-industri" className="hover:underline">Sertifikasi Industri</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">PKL</h4>
            <ul className="space-y-2 text-purple-100">
              <li><a href="#pkl" className="hover:underline">PKL</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-8 border-purple-300" />
      <div className="text-center text-xs text-purple-100">
        @ Kompetensia by PT Chlorine Digital Media 2025 - Hak Cipta Dilindungi
      </div>
    </footer>
  );
}
