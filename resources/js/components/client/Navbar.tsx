import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
  return (
    <nav className="flex items-center px-20 py-6">
      <div className="text-2xl font-semibold mr-8">Kompetensia</div>
      <div className="flex flex-1 justify-end items-center gap-8 text-lg mr-6">
        <Link href="/sertifikasi" className="hover:underline">Sertifikasi</Link>
        <Link href="#pkl" className="hover:underline">PKL</Link>
        <Link href="#tentang" className="hover:underline">Tentang</Link>
        <Link href="#testimoni" className="hover:underline">Testimoni</Link>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800">Masuk</button>
        <button
          className="px-6 py-2 rounded-lg border bg-white text-black font-semibold hover:bg-orange-50"
          style={{ borderColor: '#DD661D' }}
        >Daftar</button>
      </div>
    </nav>
  );
}