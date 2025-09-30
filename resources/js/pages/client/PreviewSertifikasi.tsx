import React, { useState } from 'react';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';
import HeroSertifikasi from '@/components/client/sertifikasi/HeroSertifikasi';
import LeftNavSertifikasi from '@/components/client/sertifikasi/LeftNavSertifikasi';
import DetailSertifikasi from '@/components/client/sertifikasi/DetailSertifikasi';
import RekomendasiSertifikasi from '@/components/client/sertifikasi/RekomendasiSertifikasi';
import PendaftaranModal from '@/components/client/sertifikasi/PendaftaranModal';
import LoginModal from '@/components/client/auth/LoginModal';
import { usePage } from '@inertiajs/react';

interface User {
  id: number;
  nama: string;
  nama_lengkap?: string;
  email: string;
  role: string;
}

interface PageProps extends Record<string, any> {
  auth?: {
    user?: User;
    client?: User;
  };
}

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
  const [selectedBatch, setSelectedBatch] = useState<{id: number; nama_batch: string; tanggal_mulai: string; tanggal_selesai: string; status: string} | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingBatch, setPendingBatch] = useState<{id: number; nama_batch: string; tanggal_mulai: string; tanggal_selesai: string} | null>(null);
  
  const { auth } = usePage<PageProps>().props;
  const isAuthenticated = auth?.client;

  // Function to scroll to batch section
  const scrollToBatchSection = () => {
    const batchElement = document.getElementById('batch');
    if (batchElement) {
      batchElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to handle batch selection and open modal
  const handleBatchSelect = (batch: {id: number; nama_batch: string; tanggal_mulai: string; tanggal_selesai: string}) => {
    if (!isAuthenticated) {
      // If not authenticated, store the batch and show login modal
      setPendingBatch(batch);
      setIsLoginModalOpen(true);
    } else {
      // If authenticated, proceed with registration modal
      setSelectedBatch({ ...batch, status: 'aktif' });
      setOpen(true);
    }
  };

  // Function to close modal and reset selected batch
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedBatch(null);
  };

  // Function to handle login success and close login modal
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    // After successful login (when modal closes due to success), proceed with the pending batch registration
    if (pendingBatch && auth?.client) {
      setSelectedBatch({ ...pendingBatch, status: 'aktif' });
      setOpen(true);
      setPendingBatch(null);
    } else {
      // If modal closed without successful login, just clear pending batch
      setPendingBatch(null);
    }
  };

  // Log data untuk debugging
  console.log('Sertifikasi data:', sertifikasi);
  console.log('Rekomendasi data:', rekomendasiSertifikasi);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="">
        <HeroSertifikasi sertifikasi={sertifikasi} onScrollToBatch={scrollToBatchSection} />

        <main className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <aside className="lg:col-span-1">
              <LeftNavSertifikasi onScrollToBatch={scrollToBatchSection} />
            </aside>

            <section className="lg:col-span-5">
              <DetailSertifikasi sertifikasi={sertifikasi} onBatchSelect={handleBatchSelect} />
            </section>
          </div>
        </main>
      </div>

      {/* Recommendations are full-width edge-to-edge */}
      <div id="recommend" className="w-full bg-white">
        <div className="container mx-auto px-4 py-10">
          <RekomendasiSertifikasi rekomendasiSertifikasi={rekomendasiSertifikasi} />
        </div>
      </div>

      <Footer />

      {open && sertifikasi && (
        <PendaftaranModal 
          onClose={handleCloseModal} 
          sertifikasi={{
            ...sertifikasi,
            batch: sertifikasi.batch ? [sertifikasi.batch] : []
          }} 
          selectedBatch={selectedBatch} 
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={handleLoginModalClose} 
        />
      )}
    </div>
  );
}
