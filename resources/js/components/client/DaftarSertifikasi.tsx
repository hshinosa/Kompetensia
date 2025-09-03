import React, { useMemo, useState, useEffect } from 'react';

type Item = {
  id?: number | string;
  title: string;
  batch: string;
  date: string;
  rating: string;
  peserta: number;
  kategori: string;
  img: string;
  mentor: string;
};

const items: Item[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: 'Digital Marketing',
  batch: 'Batch 1',
  date: '25 April 2025',
  rating: '4.7',
  peserta: 46,
  kategori: 'Marketing',
  img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
  mentor: 'Alyssa',
}));

export default function DaftarSertifikasi() {
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(items.length / pageSize)), [items.length]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  return (
    <section>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-2xl font-semibold">Daftar Sertifikasi</h2>
          <p className="text-sm text-gray-600">Pilih skema sertifikasi yang sesuai dengan bidang dan kebutuhanmu.</p>
        </div>

        <div className="w-72">
          <label className="relative block">
            <input placeholder="temukan sertifikasi" className="w-full border border-orange-300 rounded-md py-2 pl-3 pr-10 text-sm" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">🔍</span>
          </label>
        </div>
      </div>

      {/* Chips moved under title */}
      <div className="flex gap-3 mb-6">
        <button className="px-3 py-1 rounded-md bg-purple-700 text-white text-sm font-medium">Unggulan</button>
        <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">BNSP</button>
        <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Industri</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pagedItems.map((it) => (
          <article key={it.id} className="border-2 border-purple-300 rounded-xl overflow-hidden bg-white flex flex-col">
            <div className="relative">
              <img src={it.img} alt={it.title} className="w-full h-40 object-cover" />
              <span className="absolute left-3 top-3 text-xs px-2 py-1 rounded bg-orange-50 text-orange-700 font-semibold">{it.kategori}</span>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-1">{it.title}</h3>
              <div className="text-sm text-gray-600 mb-3">{it.batch} • {it.date}</div>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium">{it.rating}</span>
                </div>
                <div className="text-xs text-gray-500">(496)</div>
                <div className="ml-auto text-sm text-gray-600">👥 {it.peserta} Peserta</div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(it.mentor)}&background=8B5CF6&color=fff`} alt="mentor" className="w-8 h-8 rounded-full border-2 border-white" />
                <div className="text-sm font-medium">{it.mentor}</div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button className="flex-1 px-3 py-2 rounded-md bg-purple-700 text-white font-semibold">Ambil Kelas</button>
                <button className="px-3 py-2 rounded-md border border-orange-400 text-orange-700 font-semibold">Pelajari Kelas</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className={`px-3 py-1 rounded-md border ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ◀
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                aria-current={page === pageNum}
                className={`w-2 h-2 rounded-full ${page === pageNum ? 'bg-purple-700' : 'bg-gray-300'}`}
                aria-label={`Page ${pageNum}`}
              />
            );
          })}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className={`px-3 py-1 rounded-md border ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ▶
        </button>
      </div>
    </section>
  );
}
