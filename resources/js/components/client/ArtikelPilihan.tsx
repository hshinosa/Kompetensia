import React from 'react';

const artikelList = [
  {
    title: 'Bagaimana cara belajar digital marketing',
    author: 'Willy Baro',
    date: '20 Juli 2025',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  // Tambah artikel lain jika perlu
];

export default function ArtikelPilihan() {
  return (
    <section className="px-20 py-12">
      <h2 className="text-2xl font-bold mb-4">Artikel Pilihan</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array(4).fill(0).map((_, idx) => (
          <div key={idx} className="border-2 border-purple-400 rounded-2xl bg-white shadow flex flex-col min-w-[270px] md:min-w-[320px] max-w-full overflow-hidden">
            <img src={artikelList[0].img} alt={artikelList[0].title} className="w-full h-40 object-cover rounded-t-2xl" />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-2">{artikelList[0].title}</h3>
              <p className="text-sm text-gray-700 mb-2">{artikelList[0].desc}</p>
              <div className="text-xs text-gray-500 mb-4">{artikelList[0].author}, {artikelList[0].date}</div>
              <div className="flex justify-between items-center mt-auto">
                <a href="#" className="text-purple-700 text-sm font-semibold">Baca Selengkapnya &rarr;</a>
                <button className="text-gray-400 hover:text-gray-700"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M17 8v6a5 5 0 01-10 0V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
