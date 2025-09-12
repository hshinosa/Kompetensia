import React from 'react';

interface Artikel {
  id: number;
  type?: 'blog' | 'video';
  title: string;
  author: string;
  date: string;
  img: string;
  desc: string;
  slug: string;
  durasi?: string;
}

interface ArtikelPilihanProps {
  readonly articles: Artikel[];
}

const defaultArticle = {
  id: 0,
  type: 'blog' as const,
  title: 'Bagaimana cara belajar digital marketing',
  author: 'Willy Baro',
  date: '20 Juli 2025',
  img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  slug: '#',
};

export default function ArtikelPilihan({ articles = [] }: ArtikelPilihanProps) {
  // Jika tidak ada artikel dari database, gunakan artikel default
  const displayArticles = articles.length > 0 ? articles : Array(4).fill(defaultArticle);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Artikel Pilihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {displayArticles.slice(0, 4).map((artikel, idx) => (
            <div key={artikel.id || idx} className="border-2 border-purple-400 rounded-2xl bg-white shadow flex flex-col min-w-[270px] md:min-w-[320px] max-w-full overflow-hidden">
              <div className="relative">
                <img src={artikel.img} alt={artikel.title} className="w-full h-40 object-cover rounded-t-2xl" />
                {artikel.type === 'video' && artikel.durasi && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {artikel.durasi}
                  </div>
                )}
                {artikel.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold flex-1">{artikel.title}</h3>
                  {artikel.type === 'video' && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                      VIDEO
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{artikel.desc}</p>
                <div className="text-xs text-gray-500 mb-4">{artikel.author}, {artikel.date}</div>
                <div className="flex justify-between items-center mt-auto">
                  <a href={artikel.slug !== '#' ? `/blog/${artikel.slug}` : '#'} className="text-purple-700 text-sm font-semibold">
                    {artikel.type === 'video' ? 'Tonton Video' : 'Baca Selengkapnya'} &rarr;
                  </a>
                  <button className="text-gray-400 hover:text-gray-700"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M17 8v6a5 5 0 01-10 0V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}