import React from 'react';

const sertifikasiList = [
  {
    title: 'Digital Marketing',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Marketing',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    mentor: 'Alyssa',
  },
  {
    title: 'Junior Programmer',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Programming',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    mentor: 'Alyssa',
  },
  {
    title: 'Content Creator',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Marketing',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    mentor: 'Alyssa',
  },
  {
    title: 'Desain Grafis',
    batch: 'Batch 1',
    date: '25 April 2025',
    rating: '4.7',
    peserta: 46,
    kategori: 'Design',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    mentor: 'Alyssa',
  },
];

export default function SertifikasiPopuler() {
  return (
    <section className="px-20 py-12">
      <h2 className="text-2xl font-bold mb-6">Skema Sertifikasi Populer</h2>
      <div className="flex gap-4 mb-8">
        <button className="px-4 py-2 rounded-lg bg-purple-700 text-white font-semibold">BNSP</button>
        <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold">Industri</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {sertifikasiList.map((item, idx) => (
          <div key={idx} className="border-2 border-purple-400 rounded-2xl overflow-hidden shadow bg-white flex flex-col min-w-[270px] md:min-w-[320px] max-w-full">
            <img src={item.img} alt={item.title} className="w-full h-52 object-cover" />
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-semibold w-fit mb-2">{item.kategori}</span>
              <h3 className="text-lg font-bold mb-1">{item.title}</h3>
              <div className="text-sm text-gray-600 mb-1">{item.batch}</div>
              <div className="text-sm text-gray-600 mb-2">{item.date}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="text-yellow-400">★</span> {item.rating} <span className="ml-1">(496)</span>
                <span className="ml-4">👥 {item.peserta} Peserta</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://ui-avatars.com/api/?name=Alyssa&background=8B5CF6&color=fff" alt="mentor" className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="text-sm font-semibold">{item.mentor}</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 px-4 py-2 rounded-lg bg-purple-700 text-white font-semibold">Ambil Kelas</button>
                <button className="flex-1 px-4 py-2 rounded-lg border border-orange-400 text-orange-700 font-semibold">Pelajari Kelas</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
