import React, { useState, useMemo } from 'react';
import ProgramDetailDialog from './ProgramDetailDialog';

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

interface Props {
  readonly posisiPKL: PosisiPKL[];
  readonly searchTerm: string;
  readonly onSearchChange: (term: string) => void;
}

export default function ProgramList({ posisiPKL, searchTerm, onSearchChange }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<PosisiPKL | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 6;

  // Calculate pagination
  const { paginatedData, totalPages } = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginated = posisiPKL.slice(startIdx, endIdx);
    const total = Math.ceil(posisiPKL.length / itemsPerPage);
    
    return {
      paginatedData: paginated,
      totalPages: total
    };
  }, [posisiPKL, currentPage]);

  // Reset to first page when search results change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [posisiPKL.length]);

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (program: PosisiPKL) => {
    setSelectedProgram(program);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProgram(null);
  };

  return (
    <article>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Program yang tersedia</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Temukan program kesukaanmu"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm placeholder-gray-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {paginatedData.map((position) => (
          <div key={position.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Card Content */}
            <div className="p-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 text-white relative overflow-hidden min-h-[280px] flex flex-col">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="25" fill="currentColor" />
                  </svg>
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-3">{position.nama_posisi}</h3>
                    <p className="text-purple-100 text-sm leading-relaxed line-clamp-3">
                      {position.deskripsi}
                    </p>
                  </div>

                  {/* Category and Type Chips */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 border border-orange-400 text-white text-xs rounded-full bg-white/10 backdrop-blur-sm">
                        {position.kategori}
                      </span>
                      <span className="px-3 py-1 border border-orange-400 text-white text-xs rounded-full bg-white/10 backdrop-blur-sm">
                        {position.tipe}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Button Section */}
            <div className="px-4 pb-4">
              <button 
                onClick={() => handleViewDetail(position)}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* No Results */}
      {posisiPKL.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada program ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      )}

      {/* Program Detail Dialog */}
      <ProgramDetailDialog
        program={selectedProgram}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </article>
  );
}
