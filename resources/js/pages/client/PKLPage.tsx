import React, { useState } from 'react';
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
}

export default function PKLPage({ posisiPKL }: PKLPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

        <main className="container mx-auto py-10">
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
    </div>
  );
}
