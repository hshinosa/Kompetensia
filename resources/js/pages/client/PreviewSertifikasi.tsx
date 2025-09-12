import React, { useState } from 'react';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';
import HeroSertifikasi from '@/components/client/sertifikasi/HeroSertifikasi';
import LeftNavSertifikasi from '@/components/client/sertifikasi/LeftNavSertifikasi';
import DetailSertifikasi from '@/components/client/sertifikasi/DetailSertifikasi';
import RekomendasiSertifikasi from '@/components/client/sertifikasi/RekomendasiSertifikasi';
import PendaftaranModal from '@/components/client/sertifikasi/PendaftaranModal';

interface SertifikasiData {
  id: number;
  nama_sertifikasi: string;
  jenis_sertifikasi: string;
  deskripsi: string;
  thumbnail?: string;
  tipe_sertifikat?: string[];
  status: string;
  batch?: {
    id: number;
    nama_batch: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jumlah_pendaftar: number;
    status: string;
    instruktur: string;
    catatan?: string;
  };
  moduls: Array<{
    id: number;
    judul: string;
    deskripsi: string;
    poin_pembelajaran: string[];
    urutan: number;
  }>;
  asesor?: {
    nama: string;
    keahlian: string;
    pengalaman: string;
    kontak: string;
    foto?: string;
  };
}

interface RekomendasiItem {
  id: number;
  title: string;
  batch: string;
  date: string;
  rating: string;
  peserta: number;
  kategori: string;
  img: string;
  mentor: string;
  slug: string;
}

interface PreviewSertifikasiProps {
  readonly sertifikasi?: SertifikasiData;
  readonly rekomendasiSertifikasi?: RekomendasiItem[];
}

export default function PreviewSertifikasi({ sertifikasi, rekomendasiSertifikasi }: PreviewSertifikasiProps) {
  const [open, setOpen] = useState(false);

  // Log data untuk debugging
  console.log('Sertifikasi data:', sertifikasi);
  console.log('Rekomendasi data:', rekomendasiSertifikasi);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="">
        <HeroSertifikasi sertifikasi={sertifikasi} onOpen={() => setOpen(true)} />

        <main className="container mx-auto py-10">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <aside className="lg:col-span-1">
              <LeftNavSertifikasi onOpen={() => setOpen(true)} />
            </aside>

            <section className="lg:col-span-5">
              <DetailSertifikasi sertifikasi={sertifikasi} />
            </section>
          </div>
        </main>
      </div>

      {/* Recommendations are full-width edge-to-edge */}
      <div id="recommend" className="w-full bg-white">
        <div className="container mx-auto px-10 py-10">
          <RekomendasiSertifikasi rekomendasiSertifikasi={rekomendasiSertifikasi} />
        </div>
      </div>

      <Footer />

      {open && <PendaftaranModal onClose={() => setOpen(false)} />}
    </div>
  );
}
