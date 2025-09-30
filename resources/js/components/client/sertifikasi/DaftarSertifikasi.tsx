import React, { useMemo, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import SertifikasiCard from './SertifikasiCard';
import PendaftaranModal from './PendaftaranModal';

interface SertifikasiItem {
  readonly id: number;
  readonly nama_sertifikasi: string;
  readonly jenis_sertifikasi: 'BNSP' | 'Industri';
  readonly deskripsi?: string;
  readonly thumbnail?: string;
  readonly thumbnail_url?: string;
  readonly status: 'Aktif' | 'Tidak Aktif';
  readonly slug: string;
  readonly asesor?: {
    readonly nama_asesor: string;
    readonly foto_asesor?: string;
  };
  readonly batch?: Array<{
    readonly id: number;
    readonly nama_batch: string;
    readonly tanggal_mulai: string;
    readonly tanggal_selesai: string;
    readonly status: string;
    readonly kapasitas_peserta?: number;
    readonly peserta_terdaftar?: number;
  }>;
}

interface Props {
  readonly sertifikasiList: SertifikasiItem[];
  readonly searchParams?: {
    readonly search?: string;
    readonly jenis?: string;
    readonly page?: number;
  };
}

export default function DaftarSertifikasi({ sertifikasiList = [], searchParams = {} }: Props) {
  const [page, setPage] = useState<number>(searchParams.page || 1);
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.jenis || 'Unggulan');
  const [isPendaftaranModalOpen, setIsPendaftaranModalOpen] = useState(false);
  const [selectedSertifikasiForModal, setSelectedSertifikasiForModal] = useState<SertifikasiItem | null>(null);
  
  const pageSize = 8;

  // Transform database data to match card component interface
  const transformedItems = useMemo(() => {
    return sertifikasiList.map(item => ({
      id: item.id,
      title: item.nama_sertifikasi,
      batch: item.batch?.[0]?.nama_batch || 'Batch 1',
      date: item.batch?.[0]?.tanggal_mulai ? 
        new Date(item.batch[0].tanggal_mulai).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'Segera dibuka',
      rating: '4.7', // Default rating, could be calculated from reviews
      peserta: item.batch?.reduce((total, batch) => total + (batch.peserta_terdaftar || 0), 0) || 0,
      kategori: item.jenis_sertifikasi,
      img: item.thumbnail_url,
      mentor: item.asesor?.nama_asesor || 'Instruktur Profesional',
      slug: item.slug,
      type: item.jenis_sertifikasi,
    }));
  }, [sertifikasiList]);

  // Filter items berdasarkan search dan category
  const filteredItems = useMemo(() => {
    let filtered = transformedItems;
    
    // Filter berdasarkan search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mentor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter berdasarkan category
    if (selectedCategory !== 'Unggulan') {
      filtered = filtered.filter(item => item.type === selectedCategory);
    }
    
    return filtered;
  }, [transformedItems, searchTerm, selectedCategory]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredItems.length / pageSize)), [filteredItems.length]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

  // Update URL when search/filter changes
  const updateFilters = (newSearchTerm?: string, newCategory?: string) => {
    const params = new URLSearchParams();
    
    if (newSearchTerm || searchTerm) {
      params.set('search', newSearchTerm ?? searchTerm);
    }
    if (newCategory !== 'Unggulan') {
      params.set('jenis', newCategory || selectedCategory);
    }
    if (page > 1) {
      params.set('page', page.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/sertifikasi?${queryString}` : '/sertifikasi';
    
    router.visit(url, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    updateFilters(searchTerm, category);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    // Debounce search updates
    const timeoutId = setTimeout(() => {
      updateFilters(term, selectedCategory);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  const handleRegisterClick = (sertifikasiCard: any) => {
    // Find the original sertifikasi data based on the card id
    const originalSertifikasi = sertifikasiList.find(item => item.id === sertifikasiCard.id);
    if (originalSertifikasi) {
      setSelectedSertifikasiForModal(originalSertifikasi);
      setIsPendaftaranModalOpen(true);
    }
  };
  
  const handleClosePendaftaran = () => {
    setIsPendaftaranModalOpen(false);
    setSelectedSertifikasiForModal(null);
  };

  return (
    <article>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">Daftar Sertifikasi</h2>
        <p className="text-gray-600 mb-6">Pilih skema sertifikasi yang sesuai dengan bidang dan kebutuhanmu.</p>
        
        {/* Search Bar */}
        <div className="relative mb-6 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Temukan sertifikasi kesukaanmu"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm placeholder-gray-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 mb-6">
          {['Unggulan', 'BNSP', 'Industri'].map((category) => (
            <button 
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {pagedItems.map((item) => (
          <SertifikasiCard 
            key={item.id} 
            sertifikasi={item}
            onRegisterClick={handleRegisterClick}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada sertifikasi ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau kategori</p>
        </div>
      )}

      {/* Loading state */}
      {!sertifikasiList.length && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Memuat data sertifikasi...</h3>
          <p className="text-gray-600">Mohon tunggu sebentar</p>
        </div>
      )}

      {/* Pagination - Same style as ProgramList */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button 
            onClick={handlePrevPage}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  page === pageNumber
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Registration Modal */}
      {isPendaftaranModalOpen && selectedSertifikasiForModal && (
        <PendaftaranModal
          onClose={handleClosePendaftaran}
          sertifikasi={selectedSertifikasiForModal}
        />
      )}
    </article>
  );
}
