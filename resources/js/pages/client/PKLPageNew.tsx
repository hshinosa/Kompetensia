import React, { useState } from 'react';
import Navbar from '@/components/client/Navbar';
import Footer from '@/components/client/Footer';
import HeroPKL from '@/components/client/pkl/HeroPKL';
import LeftNavPKL from '@/components/client/pkl/LeftNavPKL';
import ProgramList from '@/components/client/pkl/ProgramList';
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
}

export default function PKLPage({ posisiPKL }: PKLPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [open, setOpen] = useState(false);

  // Get unique categories
  const categories = ['', ...Array.from(new Set(posisiPKL.map(p => p.kategori)))];

  // Filter positions based on search and category
  const filteredPositions = posisiPKL.filter(position => {
    const matchesSearch = position.nama_posisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || position.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="">
        <HeroPKL onOpen={() => setOpen(true)} />

        <main className="container mx-auto py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
              <LeftNavPKL 
                selectedCategory={selectedCategory}
                categories={categories}
                onCategoryChange={setSelectedCategory}
                onOpen={() => setOpen(true)}
              />
            </aside>

            <section className="lg:col-span-9">
              <ProgramList 
                posisiPKL={filteredPositions}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </section>
          </div>
        </main>
      </div>

      <Footer />

      {open && <PendaftaranPKLModal onClose={() => setOpen(false)} />}
    </div>
  );
}
