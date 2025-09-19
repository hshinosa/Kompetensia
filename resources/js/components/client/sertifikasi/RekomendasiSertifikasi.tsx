import React from 'react';

interface RekomendasiItem {
  readonly id: number;
  readonly title: string;
  readonly batch: string;
  readonly date: string;
  readonly rating: string;
  readonly peserta: number;
  readonly kategori: string;
  readonly img: string;
  readonly mentor: string;
  readonly slug: string;
}

interface Props {
  readonly rekomendasiSertifikasi?: RekomendasiItem[];
}

const sampleList = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  title: 'Digital Marketing',
  kategori: 'Marketing',
  batch: 'Batch 1',
  date: '25 April 2025',
  rating: '4.7',
  peserta: 46,
  mentor: 'Alyssa',
  img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
  slug: 'digital-marketing'
}));

export default function RekomendasiSertifikasi({ rekomendasiSertifikasi }: Props) {
  const displayList = rekomendasiSertifikasi || sampleList;
  
  return (
    <section id="recommend">
      <h3 className="text-xxl font-semibold mb-6 text-gray-900">Rekomendasi Sertifikasi Lainnya</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.map((item) => (
          <div key={item.id} className="border-2 border-purple-400 rounded-2xl overflow-hidden bg-white flex flex-col shadow-sm hover:border-purple-600 hover:shadow-md transition-all duration-200">
            <img src={item.img} alt={item.title} className="w-full h-36 object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-xs px-2 py-1 rounded bg-orange-50 text-orange-700 font-semibold w-fit mb-2">{item.kategori}</span>
              <h4 className="font-semibold text-lg mb-1 text-gray-900">{item.title}</h4>
              <div className="text-sm text-gray-600 mb-1">{item.batch}</div>
              <div className="text-sm text-gray-600 mb-2">{item.date}</div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="text-yellow-400">★</span>
                <span className="font-medium">{item.rating}</span>
                <span className="ml-4">👥 {item.peserta} Peserta</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.mentor)}&background=8B5CF6&color=fff`} alt="mentor" className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="text-sm font-semibold text-gray-900">{item.mentor}</span>
              </div>

              <div className="flex gap-2 mt-auto">
                <button className="flex-1 px-3 py-2 rounded-md bg-purple-700 text-white font-semibold">Ambil Kelas</button>
                <a href={`/detailsertifikasi/${item.slug}`} className="px-3 py-2 rounded-md border border-orange-400 text-orange-700 font-semibold text-center">
                  Pelajari Kelas
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
