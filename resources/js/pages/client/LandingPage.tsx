import React, { useState } from 'react';
import LoginModal from '../../components/client/LoginModal';
import Navbar from '@/components/client/Navbar';
import HeroSection from '@/components/client/HeroSection';
import SertifikasiPopuler from '@/components/client/SertifikasiPopuler';
import ProgramPKL from '@/components/client/ProgramPKL';
import MengapaSertifikasiPKL from '@/components/client/MengapaSertifikasiPKL';  
import ArtikelPilihan from '@/components/client/ArtikelPilihan';
import ApaKataAlumni from '@/components/client/ApaKataAlumni';
import CTASection from '@/components/client/CTASection';
import Footer from '@/components/client/Footer';

interface Artikel {
  id: number;
  type?: 'blog' | 'video';
  title: string;
  author: string;
  date: string;
  img: string;
  desc: string;
  slug: string;
  durasi?: string;
}

interface SertifikasiItem {
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

interface LandingPageProps {
  readonly featuredBlogs?: Artikel[];
  readonly popularSertifikasi?: SertifikasiItem[];
}

export default function LandingPage({ featuredBlogs = [], popularSertifikasi = [] }: LandingPageProps) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="px-10">
        <HeroSection />
        <div id="sertifikasi">
          <SertifikasiPopuler sertifikasiList={popularSertifikasi} />
        </div>
        <ProgramPKL />
        <MengapaSertifikasiPKL />
        <ArtikelPilihan articles={featuredBlogs} />
        <ApaKataAlumni />
        <CTASection />
      </div>
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}