import React, { useState } from 'react';

type MateriItem = {
  readonly id: number;
  readonly judul: string;
  readonly deskripsi: string;
  readonly poin_pembelajaran: string[];
  readonly urutan: number;
};

interface Props {
  readonly moduls?: MateriItem[];
}

const sampleModuls: MateriItem[] = [
  { 
    id: 1, 
    judul: 'Dasar-dasar Digital Marketing', 
    deskripsi: 'Modul pengenalan digital marketing',
    poin_pembelajaran: ['Pengenalan digital marketing', 'Strategi social media', 'Analitik dasar'],
    urutan: 1
  },
  { 
    id: 2, 
    judul: 'Content Marketing', 
    deskripsi: 'Modul content marketing',
    poin_pembelajaran: ['Membuat konten', 'Distribusi', 'Copywriting'],
    urutan: 2
  },
  { 
    id: 3, 
    judul: 'Search Engine Optimization (SEO)', 
    deskripsi: 'Modul SEO',
    poin_pembelajaran: ['On-page SEO', 'Off-page SEO', 'Technical SEO'],
    urutan: 3
  },
];

export default function MateriCollapsible({ moduls }: Props) {
  const [open, setOpen] = useState<number | null>(1);
  
  // Gunakan data dari props atau fallback ke sample data
  const displayModuls = moduls && moduls.length > 0 ? moduls : sampleModuls;

  return (
    <div id="materi">
      <h3 className="text-lg font-semibold mb-4">Materi sertifikasi yang kamu pelajari</h3>
      <div className="space-y-3">
        {displayModuls.map((modul) => (
          <div key={modul.id} className="border border-purple-200 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors duration-200"
              onClick={() => setOpen((cur) => (cur === modul.id ? null : modul.id))}
            >
              <span className="font-medium">{modul.judul}</span>
              <span className={`text-purple-700 transition-transform duration-200 ${open === modul.id ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              open === modul.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-4 pb-4 pt-2 bg-gray-50">
                {modul.deskripsi && (
                  <p className="text-sm text-gray-600 mb-2">{modul.deskripsi}</p>
                )}
                <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  {modul.poin_pembelajaran.map((point, i) => (
                    <li key={`${modul.id}-point-${i}`}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
