import React from 'react';

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
  return (
    <article>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Program yang tersedia</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="temukan program kesukaanmu"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full max-w-md px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {posisiPKL.map((position) => (
          <div key={position.id} className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="currentColor" />
              </svg>
            </div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{position.nama_posisi}</h3>
                <p className="text-purple-100 text-sm leading-relaxed mb-4 min-h-[60px]">
                  {position.deskripsi}
                </p>
              </div>

              {/* Skills/Requirements Tags */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {position.persyaratan?.slice(0, 4).map((req) => (
                    <span 
                      key={`${position.id}-${req}`} 
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs rounded-full border border-white/30"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>
              
              {/* Footer with Button */}
              <div className="pt-4">
                <button className="w-full py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 transition-colors">
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Pagination dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
        
        <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* No Results */}
      {posisiPKL.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada program ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      )}
    </article>
  );
}
