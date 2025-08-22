
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

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="px-10">
        <HeroSection />
        <div id="sertifikasi">
          <SertifikasiPopuler />
        </div>
        <ProgramPKL />
        <MengapaSertifikasiPKL />
        <ArtikelPilihan />
        <ApaKataAlumni />
        <CTASection />
      </div>
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
