import React, { useState, useEffect } from 'react';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';
import HeroPKL from '@/components/client/pkl/HeroPKL';
import LeftNavPKL from '@/components/client/pkl/LeftNavPKL';
import ProgramList from '@/components/client/pkl/ProgramList';
import WhyPKLSection from '@/components/client/pkl/WhyPKLSection';
import ManfaatNyataSection from '@/components/client/pkl/ManfaatNyataSection';
import BuktiNyataSection from '@/components/client/pkl/BuktiNyataSection';
import TestimonialSection from '@/components/client/pkl/TestimonialSection';
import FAQSection from '@/components/client/pkl/FAQSection';
import PendaftaranPKLModal from '@/components/client/pkl/PendaftaranPKLModal';

interface PosisiPKL {
  readonly id: number;
  readonly nama_posisi: string;
  readonly kategori: string;
  readonly deskripsi: string;
  readonly persyaratan: string[];
  readonly benefits: string[];
  readonly tipe: string;
  readonly durasi_bulan: number;
  readonly jumlah_pendaftar: number;
  readonly status: string;
}

interface PKLPageProps {
  readonly posisiPKL: PosisiPKL[];
  readonly openModal?: 'detail' | 'register' | null;
  readonly programId?: number | string | null;
  readonly programData?: string | null;
  readonly scrollTo?: string | null;
}

export default function PKLPage({ posisiPKL, openModal, programId, programData, scrollTo }: PKLPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // Helper function to transform database program to frontend format
  const transformDatabaseProgram = (dbProgram: PosisiPKL) => ({
    id: dbProgram.id,
    title: dbProgram.nama_posisi,
    nama_posisi: dbProgram.nama_posisi, // Keep both for compatibility
    desc: dbProgram.deskripsi,
    tags: [dbProgram.tipe, dbProgram.kategori],
    kategori: dbProgram.kategori,
    tipe: dbProgram.tipe,
    durasi_bulan: dbProgram.durasi_bulan,
    jumlah_pendaftar: dbProgram.jumlah_pendaftar,
    slug: dbProgram.nama_posisi.toLowerCase().replace(/\s+/g, '-'),
    persyaratan: dbProgram.persyaratan,
    benefits: dbProgram.benefits,
  });

  // Helper function to ensure consistent data format for modals
  const normalizeProgram = (program: any) => ({
    id: program.id,
    title: program.title || program.nama_posisi,
    nama_posisi: program.nama_posisi || program.title, // Ensure both exist
    desc: program.desc || program.deskripsi,
    tags: program.tags || [program.tipe, program.kategori],
    kategori: program.kategori,
    tipe: program.tipe,
    durasi_bulan: program.durasi_bulan,
    jumlah_pendaftar: program.jumlah_pendaftar,
    slug: program.slug || (program.title || program.nama_posisi).toLowerCase().replace(/\s+/g, '-'),
    persyaratan: program.persyaratan,
    benefits: program.benefits,
  });

  // Helper function to open appropriate modal
  const openAppropriateModal = (modalType: string) => {
    if (modalType === 'register') {
      setShowRegisterModal(true);
    }
    // 'detail' modal type is no longer used - both actions now open register modal
  };

  // Handle modal state from landing page navigation
  useEffect(() => {
    console.log('PKL Page loaded with params:', { openModal, programId, programData });
    
    if (!openModal) return;

    // Try to parse program data from JSON
    if (programData) {
      try {
        const program = JSON.parse(programData);
        console.log('Parsed program data:', program);
        // Normalize the program data for consistent format
        const normalizedProgram = normalizeProgram(program);
        setSelectedProgram(normalizedProgram);
        openAppropriateModal(openModal);
        
        // Handle scroll to specific section if specified
        if (scrollTo) {
          setTimeout(() => {
            const element = document.getElementById(scrollTo);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100); // Small delay to ensure page is loaded
        }
        return;
      } catch (error) {
        console.error('Error parsing program data:', error);
      }
    }

    // Fallback: find program by ID in existing posisiPKL data
    if (programId && posisiPKL.length > 0) {
      const foundProgram = posisiPKL.find(p => p.id.toString() === programId.toString());
      if (foundProgram) {
        const transformedProgram = transformDatabaseProgram(foundProgram);
        setSelectedProgram(transformedProgram);
        openAppropriateModal(openModal);
      }
    }
  }, [openModal, programData, programId, posisiPKL]);

  // Get unique categories from database data
  const categories = ['', ...Array.from(new Set(posisiPKL.map(p => p.kategori)))];

  // Filter positions based on search and category
  const filteredPositions = posisiPKL.filter(position => {
    const matchesSearch = position.nama_posisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || position.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="">
        <HeroPKL />

        <main className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <aside className="lg:col-span-1">
              <LeftNavPKL 
                selectedCategory={selectedCategory}
                categories={categories}
                onCategoryChange={setSelectedCategory}
              />
            </aside>

            <section className="lg:col-span-5">
              <div id="program-list">
                <ProgramList 
                  posisiPKL={filteredPositions}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
              
              {/* Why PKL Section */}
              <div id="why-pkl" className="mt-16">
                <WhyPKLSection />
              </div>
              
              {/* Manfaat Nyata Section */}
              <div id="manfaat" className="mt-16">
                <ManfaatNyataSection />
              </div>
              
              {/* Bukti Nyata Section */}
              <div id="bukti" className="mt-16">
                <BuktiNyataSection />
              </div>
              
              {/* Testimonial Section */}
              <div id="testimonial" className="mt-16">
                <TestimonialSection />
              </div>
              
              {/* FAQ Section */}
              <div id="faq" className="mt-16">
                <FAQSection />
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />

      {/* Modal */}
      <PendaftaranPKLModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        selectedProgram={selectedProgram}
      />

      {/* Modal */}
      <PendaftaranPKLModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        selectedProgram={selectedProgram}
      />

      {/* Modal */}
      <PendaftaranPKLModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        selectedProgram={selectedProgram}
      />
    </div>
  );
}
