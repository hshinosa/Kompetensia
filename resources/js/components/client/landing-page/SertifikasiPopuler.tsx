import React, { useState } from 'react';
import SertifikasiCard from '../sertifikasi/SertifikasiCard';

interface SertifikasiItem {
  readonly id: number;
  readonly title: string;
  readonly batch: string;
  readonly date: string;
  readonly rating: string;
  readonly peserta: number;
  readonly kategori: string;
  readonly img?: string;
  readonly mentor: string;
  readonly slug?: string;
  readonly type?: 'BNSP' | 'Industri';
}

interface SertifikasiPopulerProps {
  readonly sertifikasiList?: SertifikasiItem[];
}

const defaultSertifikasi: SertifikasiItem[] = [
  {
    id: 0,
    title: 'Digital Marketing',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Marketing',
    mentor: 'Alyssa',
    slug: '#',
    type: 'BNSP',
  },
  {
    id: 1,
    title: 'Junior Programmer',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Programming',
    mentor: 'Alyssa',
    slug: '#',
    type: 'BNSP',
  },
  {
    id: 2,
    title: 'Content Creator',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Marketing',
    mentor: 'Alyssa',
    slug: '#',
    type: 'Industri',
  },
  {
    id: 3,
    title: 'Desain Grafis',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Design',
    mentor: 'Alyssa',
    slug: '#',
    type: 'Industri',
  },
];

export default function SertifikasiPopuler({ sertifikasiList = [] }: SertifikasiPopulerProps) {
  const [activeFilter, setActiveFilter] = useState<'BNSP' | 'Industri'>('BNSP');
  
  // Jika tidak ada data dari database, gunakan data default
  const displaySertifikasi = sertifikasiList.length > 0 ? sertifikasiList : defaultSertifikasi;
  
  // Filter data berdasarkan tipe yang dipilih
  const filteredSertifikasi = displaySertifikasi.filter(item => 
    item.type === activeFilter || (!item.type && activeFilter === 'BNSP') // default ke BNSP jika tidak ada type
  );
  
  return (
    <section className="px-20 py-12">
      <h2 className="text-2xl font-bold mb-6">Skema Sertifikasi Populer</h2>
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveFilter('BNSP')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFilter === 'BNSP' 
              ? 'bg-purple-700 text-white' 
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          BNSP
        </button>
        <button 
          onClick={() => setActiveFilter('Industri')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFilter === 'Industri' 
              ? 'bg-purple-700 text-white' 
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Industri
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-fr">
        {filteredSertifikasi.slice(0, 4).map((item, idx) => (
          <div key={item.id || idx} className="min-w-[270px] md:min-w-[320px] max-w-full">
            <SertifikasiCard sertifikasi={item} />
          </div>
        ))}
      </div>
    </section>
  );
}