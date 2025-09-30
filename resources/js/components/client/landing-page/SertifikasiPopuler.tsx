import React, { useState } from 'react';
import SertifikasiCard from '../sertifikasi/SertifikasiCard';
import PendaftaranModal from '../sertifikasi/PendaftaranModal';

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
  readonly type?: string;
  readonly sertifikasi_data?: {
    readonly id: number;
    readonly nama_sertifikasi: string;
    readonly jenis_sertifikasi: string;
    readonly deskripsi?: string;
    readonly status: string;
    readonly batch?: Array<{
      readonly id: number;
      readonly nama_batch: string;
      readonly tanggal_mulai: string;
      readonly tanggal_selesai: string;
      readonly status: string;
      readonly kapasitas_peserta?: number;
      readonly peserta_terdaftar?: number;
    }>;
  };
}

interface SertifikasiPopulerProps {
  readonly sertifikasiList?: SertifikasiItem[];
}

const defaultSertifikasi: SertifikasiItem[] = [
  {
    id: 1,
    title: 'Web Development',
    batch: 'Batch 1 - Web Development',
    date: '29 September 2025',
    rating: '4.8',
    peserta: 14,
    kategori: 'BNSP',
    mentor: 'Pak Budi Raharjo',
    slug: 'web-development',
    type: 'BNSP',
  },
  {
    id: 2,
    title: 'Digital Marketing',
    batch: 'Batch 1 - Digital Marketing',
    date: '22 September 2025',
    rating: '4.8',
    peserta: 12,
    kategori: 'Industri',
    mentor: 'Pak Ahmad Santoso',
    slug: 'digital-marketing',
    type: 'Industri',
  },
  {
    id: 3,
    title: 'Network Engineering',
    batch: 'Batch akan segera dibuka',
    date: 'TBA',
    rating: '4.8',
    peserta: 7,
    kategori: 'BNSP',
    mentor: 'Instruktur Profesional',
    slug: 'network-engineering',
    type: 'BNSP',
  },
];

export default function SertifikasiPopuler({ sertifikasiList = [] }: SertifikasiPopulerProps) {
  const [activeFilter, setActiveFilter] = useState<string>('BNSP');
  const [isPendaftaranModalOpen, setIsPendaftaranModalOpen] = useState(false);
  const [selectedSertifikasiForModal, setSelectedSertifikasiForModal] = useState<any>(null);
  
  // Prioritas: gunakan data dari backend, fallback ke data default hanya jika benar-benar kosong
  const displaySertifikasi = sertifikasiList.length > 0 ? sertifikasiList : [];
  
  // Filter data berdasarkan tipe yang dipilih
  const filteredSertifikasi = displaySertifikasi.filter(item => {
    const itemType = item.type || item.kategori; // Use type or kategori
    return itemType?.toLowerCase() === activeFilter.toLowerCase() || 
           (!itemType && activeFilter === 'BNSP'); // default ke BNSP jika tidak ada type
  });
  
  const handleRegisterClick = (sertifikasiCard: SertifikasiItem) => {
    // Use complete sertifikasi data from backend if available
    if (sertifikasiCard.sertifikasi_data) {
      setSelectedSertifikasiForModal(sertifikasiCard.sertifikasi_data);
    } else {
      // Fallback to converted format for backwards compatibility
      const sertifikasiForModal = {
        id: sertifikasiCard.id,
        nama_sertifikasi: sertifikasiCard.title,
        jenis_sertifikasi: sertifikasiCard.kategori,
        deskripsi: `Program sertifikasi ${sertifikasiCard.title}`,
        status: 'Aktif',
        batch: []
      };
      setSelectedSertifikasiForModal(sertifikasiForModal);
    }
    setIsPendaftaranModalOpen(true);
  };
  
  const handleClosePendaftaran = () => {
    setIsPendaftaranModalOpen(false);
    setSelectedSertifikasiForModal(null);
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Skema Sertifikasi Populer</h2>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {filteredSertifikasi.map((item, idx) => (
          <div key={item.id || idx} className="w-full">
            <SertifikasiCard 
              sertifikasi={item} 
              onRegisterClick={handleRegisterClick}
            />
          </div>
        ))}
      </div>
      
      {/* No Results Message */}
      {filteredSertifikasi.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada sertifikasi {activeFilter}</h3>
          <p className="text-gray-600 text-sm">Sertifikasi {activeFilter} akan segera tersedia</p>
        </div>
      )}
      </div>
      
      {/* Registration Modal */}
      {isPendaftaranModalOpen && selectedSertifikasiForModal && (
        <PendaftaranModal
          onClose={handleClosePendaftaran}
          sertifikasi={selectedSertifikasiForModal}
        />
      )}
    </section>
  );
}