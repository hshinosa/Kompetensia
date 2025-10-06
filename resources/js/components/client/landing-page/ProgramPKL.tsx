import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import PKLDetailModal from './PKLDetailModal';

interface PKLProgram {
  readonly id: number;
  readonly title: string;
  readonly nama_posisi: string;
  readonly desc: string;
  readonly tags: string[];
  readonly kategori: string;
  readonly tipe: string;
  readonly durasi_bulan: number;
  readonly persyaratan: string[];
  readonly benefits: string[];
  readonly jumlah_pendaftar: number;
  readonly status: string;
}

interface ProgramPKLProps {
  readonly pklPrograms?: PKLProgram[];
}

// Default sample data as fallback
const defaultPklList: PKLProgram[] = [
  {
    id: 1,
    title: 'UI/UX',
    nama_posisi: 'UI/UX',
    desc: 'UI/UX Design adalah proses perancangan tampilan (UI) dan pengalaman pengguna (UX) pada sebuah produk digital.',
    tags: ['Remote', 'Design'],
    kategori: 'Design',
    tipe: 'Remote',
    durasi_bulan: 3,
    persyaratan: ['Siswa SMK/Mahasiswa aktif', 'Jurusan Design/DKV', 'Memiliki portfolio design'],
    benefits: ['Mendapatkan pengalaman kerja nyata', 'Bimbingan dari mentor berpengalaman', 'Sertifikat completion'],
    jumlah_pendaftar: 0,
    status: 'Aktif',
  },
  {
    id: 2,
    title: 'Fullstack Development',
    nama_posisi: 'Fullstack Development',
    desc: 'Fullstack Development adalah keahlian dalam mengembangkan aplikasi secara menyeluruh, mencakup sisi frontend dan backend.',
    tags: ['Hybrid', 'Tech'],
    kategori: 'Development',
    tipe: 'Hybrid',
    durasi_bulan: 4,
    persyaratan: ['Siswa SMK/Mahasiswa aktif', 'Jurusan Informatika/RPL', 'Memahami programming dasar'],
    benefits: ['Pengalaman fullstack development', 'Portfolio project real', 'Mentoring intensif'],
    jumlah_pendaftar: 0,
    status: 'Aktif',
  },
  {
    id: 3,
    title: 'Graphic Design',
    nama_posisi: 'Graphic Design',
    desc: 'Desain Grafis adalah bidang yang berfokus pada komunikasi visual melalui elemen-elemen seperti tipografi, warna, ilustrasi, dan tata letak.',
    tags: ['Remote', 'Design'],
    kategori: 'Design',
    tipe: 'Remote',
    durasi_bulan: 3,
    persyaratan: ['Siswa SMK/Mahasiswa aktif', 'Jurusan Design/DKV', 'Menguasai software design'],
    benefits: ['Portfolio design yang kuat', 'Networking dengan klien', 'Skill komunikasi visual'],
    jumlah_pendaftar: 0,
    status: 'Aktif',
  },
];

export default function ProgramPKL({ pklPrograms = [] }: ProgramPKLProps) {
  // Use database data if available, otherwise use default data
  const displayPrograms = pklPrograms.length > 0 ? pklPrograms : defaultPklList;
  
  // Modal state
  const [selectedProgram, setSelectedProgram] = useState<PKLProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAmbilProgram = (program: PKLProgram) => {
    // Navigate directly to PKL registration with program ID
    router.visit('/pendaftaran-pkl', {
      method: 'get',
      data: { programId: program.id }
    });
  };

  const handlePelajariProgram = (program: PKLProgram) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };
  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">Temukan Program PKL</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8">Jelajahi beragam pilihan praktik kerja dan magang yang relevan dengan bidangmu</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {displayPrograms.slice(0, 6).map((item, idx) => (
            <div key={item.id || idx} className="border-2 border-purple-400 rounded-2xl bg-white shadow flex flex-col p-5 sm:p-6 lg:p-8">
              <div className="flex flex-wrap gap-2 mb-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-semibold">{tag}</span>
                ))}
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 line-clamp-3">{item.desc}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <button 
                  onClick={() => handleAmbilProgram(item)}
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
                >
                  Ambil Program
                </button>
                <button 
                  onClick={() => handlePelajariProgram(item)}
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base border border-orange-400 text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
                >
                  Pelajari Program
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PKL Detail Modal */}
      <PKLDetailModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}