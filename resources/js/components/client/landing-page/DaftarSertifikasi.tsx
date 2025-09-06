import React, { useMemo, useState, useEffect } from 'react';
import SertifikasiCard from './SertifikasiCard';

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
}

interface Props {
  readonly sertifikasiList?: SertifikasiItem[];
}

// Default data sebagai fallback
const defaultItems: SertifikasiItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Digital Marketing ${i + 1}`,
  batch: 'Batch 1',
  date: '25 April 2025',
  rating: '4.7',
  peserta: 46 + i,
  kategori: ['Marketing', 'Programming', 'Design', 'Data Science'][i % 4],
  mentor: 'Alyssa',
  slug: '#',
}));

export default function DaftarSertifikasi({ sertifikasiList = [] }: Props) {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Unggulan');
  
  const pageSize = 8;

  // Gunakan data dari props atau fallback ke default
  const items = sertifikasiList.length > 0 ? sertifikasiList : defaultItems;

  // Filter items berdasarkan search dan category
  const filteredItems = useMemo(() => {
    let filtered = items;
    
    // Filter berdasarkan search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mentor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter berdasarkan category (jika bukan "Unggulan")
    if (selectedCategory !== 'Unggulan') {
      // Implementasi filter berdasarkan kategori bisa disesuaikan
      // Untuk sekarang, "BNSP" dan "Industri" menampilkan semua
    }
    
    return filtered;
  }, [items, searchTerm, selectedCategory]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredItems.length / pageSize)), [filteredItems.length]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

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
    setPage(1); // Reset ke halaman pertama
  };

  return (
    <section>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-2xl font-semibold">Daftar Sertifikasi</h2>
          <p className="text-sm text-gray-600">Pilih skema sertifikasi yang sesuai dengan bidang dan kebutuhanmu.</p>
        </div>

        <div className="w-72">
          <label className="relative block">
            <input 
              placeholder="temukan sertifikasi" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-orange-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">🔍</span>
          </label>
        </div>
      </div>

      {/* Chips moved under title */}
      <div className="flex gap-3 mb-6">
        {['Unggulan', 'BNSP', 'Industri'].map((category) => (
          <button 
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pagedItems.map((item) => (
          <SertifikasiCard 
            key={item.id} 
            sertifikasi={item}
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
    </section>
  );
}
