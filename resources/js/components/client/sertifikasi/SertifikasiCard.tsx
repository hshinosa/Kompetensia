import React from 'react';

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

interface Props {
  readonly sertifikasi: SertifikasiItem;
  readonly onDetailClick?: (sertifikasi: SertifikasiItem) => void;
}

export default function SertifikasiCard({ sertifikasi, onDetailClick }: Props) {
  // Placeholder images berdasarkan kategori
  const getPlaceholderImage = (kategori: string) => {
    const placeholders = {
      'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      'Programming': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      'Design': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      'Business': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
      'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      'BNSP': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'Industri': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      'default': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80'
    };
    
    return placeholders[kategori as keyof typeof placeholders] || placeholders.default;
  };

  const imageUrl = sertifikasi.img || getPlaceholderImage(sertifikasi.kategori);

  const handleAmbilKelas = () => {
    if (sertifikasi.slug && sertifikasi.slug !== '#') {
      window.location.href = `/detailsertifikasi/${sertifikasi.slug}`;
    }
  };

  const handlePelajariKelas = () => {
    if (sertifikasi.slug && sertifikasi.slug !== '#') {
      window.location.href = `/detailsertifikasi/${sertifikasi.slug}`;
    } else if (onDetailClick) {
      onDetailClick(sertifikasi);
    }
  };

  return (
    <article className="bg-white border-2 border-purple-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-purple-600 transition-all duration-300 min-h-[450px] flex flex-col">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={sertifikasi.title} 
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage('default');
          }}
        />
        <span className="absolute left-3 top-3 text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
          {sertifikasi.kategori}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900">{sertifikasi.title}</h3>
        <div className="text-sm text-gray-600 mb-3 min-h-[2.5rem] flex items-start">{sertifikasi.batch} • {sertifikasi.date}</div>

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{sertifikasi.rating}</span>
          </div>
          <div className="text-xs text-gray-500">(496)</div>
        </div>

        <div className="text-sm text-gray-600 mb-4">👥 {sertifikasi.peserta} Peserta</div>

        <div className="flex items-center gap-3 mb-4 mt-auto">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(sertifikasi.mentor)}&background=8B5CF6&color=fff`} 
            alt="mentor" 
            className="w-8 h-8 rounded-full border-2 border-white" 
          />
          <div className="text-sm font-medium line-clamp-1 text-gray-900">{sertifikasi.mentor}</div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleAmbilKelas}
            className="flex-1 px-3 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
          >
            Ambil Kelas
          </button>
          <button 
            onClick={handlePelajariKelas}
            className="px-3 py-2 rounded-lg border border-orange-400 text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
          >
            Pelajari Kelas
          </button>
        </div>
      </div>
    </article>
  );
}
