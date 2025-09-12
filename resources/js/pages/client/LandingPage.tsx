import React, { useState } from 'react';
import LoginModal from '../../components/client/LoginModal';
import Navbar from '@/components/client/Navbar';
import HeroSection from '@/components/client/landing-page/HeroSection';
import SertifikasiPopuler from '@/components/client/landing-page/SertifikasiPopuler';
import ProgramPKL from '@/components/client/landing-page/ProgramPKL';
import MengapaSertifikasiPKL from '@/components/client/landing-page/MengapaSertifikasiPKL';  
import ArtikelPilihan from '@/components/client/landing-page/ArtikelPilihan';
import ApaKataAlumni from '@/components/client/landing-page/ApaKataAlumni';
import CTASection from '@/components/client/landing-page/CTASection';
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
      <div className="">
        <HeroSection />
        <main className="container mx-auto py-10">
          <div id="sertifikasi">
            <SertifikasiPopuler sertifikasiList={popularSertifikasi} />
          </div>
          <ProgramPKL />
          <MengapaSertifikasiPKL />
          <ArtikelPilihan articles={featuredBlogs} />
          <ApaKataAlumni />
          <CTASection />
        </main>
      </div>
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}