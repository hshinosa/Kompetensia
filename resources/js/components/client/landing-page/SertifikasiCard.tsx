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
    <article className="border-2 border-purple-300 rounded-xl overflow-hidden bg-white flex flex-col hover:shadow-lg transition-shadow duration-300 h-[420px]">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={sertifikasi.title} 
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage('default');
          }}
        />
        <span className="absolute left-3 top-3 text-xs px-2 py-1 rounded bg-orange-50 text-orange-700 font-semibold">
          {sertifikasi.kategori}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{sertifikasi.title}</h3>
        <div className="text-sm text-gray-600 mb-3">{sertifikasi.batch} • {sertifikasi.date}</div>

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{sertifikasi.rating}</span>
          </div>
          <div className="text-xs text-gray-500">(496)</div>
          <div className="ml-auto text-sm text-gray-600">👥 {sertifikasi.peserta} Peserta</div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(sertifikasi.mentor)}&background=8B5CF6&color=fff`} 
            alt="mentor" 
            className="w-8 h-8 rounded-full border-2 border-white" 
          />
          <div className="text-sm font-medium line-clamp-1">{sertifikasi.mentor}</div>
        </div>

        <div className="flex gap-3 mt-auto">
          <button 
            onClick={handleAmbilKelas}
            className="flex-1 px-3 py-2 rounded-md bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
          >
            Ambil Kelas
          </button>
          <button 
            onClick={handlePelajariKelas}
            className="px-3 py-2 rounded-md border border-orange-400 text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
          >
            Pelajari Kelas
          </button>
        </div>
      </div>
    </article>
  );
}
