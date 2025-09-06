import React from 'react';
import DaftarSertifikasi from '@/components/client/sertifikasi/DaftarSertifikasi';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';

interface SertifikasiData {
  readonly id: number;
  readonly nama_sertifikasi: string;
  readonly jenis_sertifikasi: 'BNSP' | 'Industri';
  readonly deskripsi?: string;
  readonly thumbnail?: string;
  readonly thumbnail_url?: string;
  readonly status: 'Aktif' | 'Tidak Aktif';
  readonly slug: string;
  readonly asesor?: {
    readonly nama_asesor: string;
    readonly foto_asesor?: string;
  };
  readonly batch?: Array<{
    readonly id: number;
    readonly nama_batch: string;
    readonly tanggal_mulai: string;
    readonly tanggal_selesai: string;
    readonly status: string;
    readonly kapasitas_peserta?: number;
    readonly peserta_terdaftar?: number;
  }>;
}

interface Props {
  readonly sertifikasiList: SertifikasiData[];
  readonly searchParams?: {
    readonly search?: string;
    readonly jenis?: string;
    readonly page?: number;
  };
}

export default function SertifikasiPage({ sertifikasiList = [], searchParams = {} }: Props) {
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
          <DaftarSertifikasi 
            sertifikasiList={sertifikasiList}
            searchParams={searchParams}
          />
      </main>

      <Footer />
    </div>
  );
}