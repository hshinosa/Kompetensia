import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: 'Apa persyaratan untuk mengikuti program PKL?',
      answer: 'Persyaratan umum meliputi: status mahasiswa aktif minimal semester 5, IPK minimal 3.0, mampu berkomitmen sesuai durasi program, dan memiliki motivasi tinggi untuk belajar. Persyaratan khusus akan berbeda tergantung posisi yang dipilih.'
    },
    {
      id: 2,
      question: 'Berapa lama durasi program PKL?',
      answer: 'Durasi program PKL bervariasi tergantung posisi dan kebutuhan: 3 bulan (program standar), 6 bulan (program extended), atau 12 bulan (program full development). Jadwal dapat disesuaikan dengan kalender akademik mahasiswa.'
    },
    {
      id: 3,
      question: 'Apakah ada kompensasi atau tunjangan selama PKL?',
      answer: 'Ya, kami memberikan kompensasi berupa uang transportasi, uang makan, dan certificate of completion. Untuk program tertentu juga ada kesempatan mendapat recommendation letter dan job offer.'
    },
    {
      id: 4,
      question: 'Bagaimana proses seleksi PKL?',
      answer: 'Proses seleksi meliputi: 1) Pendaftaran online melalui platform kami, 2) Screening dokumen dan CV, 3) Technical test sesuai posisi, 4) Interview dengan tim, 5) Pengumuman hasil maksimal 1 minggu setelah interview.'
    },
    {
      id: 5,
      question: 'Apakah bisa PKL secara remote/online?',
      answer: 'Ya, kami menyediakan opsi PKL remote untuk posisi-posisi tertentu seperti Development, Design, dan Content Creation. Namun tetap ada sesi offline untuk meeting dan presentasi project.'
    },
    {
      id: 6,
      question: 'Apa saja yang akan dipelajari selama PKL?',
      answer: 'Pembelajaran mencakup: technical skills sesuai bidang, project management, teamwork dan collaboration, presentation skills, industry best practices, dan real-world problem solving. Ada juga mentoring session rutin setiap minggu.'
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="faq" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang program PKL kami
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <div className={`flex-shrink-0 transition-transform duration-200 ${
                    openItem === item.id ? 'transform rotate-180' : ''
                  }`}>
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`transition-all duration-200 ease-in-out overflow-hidden ${
                openItem === item.id ? 'max-h-96 pb-5' : 'max-h-0'
              }`}>
                <div className="px-6">
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Masih ada pertanyaan lain? Jangan ragu untuk menghubungi kami!
        </p>
        <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-200">
          Hubungi Kami
        </button>
      </div>
    </section>
  );
}
