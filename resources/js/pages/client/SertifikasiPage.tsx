import React from 'react';
import SertifikasiPopuler from '@/components/client/SertifikasiPopuler';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';

export default function SertifikasiPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="px-10 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-purple-900">Sertifikasi Terpopuler</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl">Kumpulan sertifikasi kredibel untuk karier yang lebih pasti dalam satu platform. Temukan skema sertifikasi yang sesuai dengan bidang dan minatmu, serta dapatkan akses ke mentor profesional dan komunitas pembelajar.</p>
        </section>
        <SertifikasiPopuler />
      </div>
      <Footer />
    </div>
  );
}
