import React from 'react';

const reasons = [
  {
    icon: <span className="inline-block bg-orange-100 p-3 rounded-xl"><svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#DD661D" strokeWidth="2" strokeLinecap="round"/></svg></span>,
    title: 'Proses pendaftaran mudah dan cepat',
    desc: 'Cukup daftar, pilih skema, dan unggah dokumen semua bisa kamu lakukan dalam satu platform yang intuitif.'
  },
  {
    icon: <span className="inline-block bg-orange-100 p-3 rounded-xl"><svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#DD661D" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#DD661D" strokeWidth="2" strokeLinecap="round"/></svg></span>,
    title: 'Pantau Status Secara Real-Time',
    desc: 'Lihat perkembangan pendaftaran, ujikom, hingga sertifikat terbit, kapan pun dan dimana pun kamu mau.'
  },
  {
    icon: <span className="inline-block bg-orange-100 p-3 rounded-xl"><svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2l7 12H5l7-12z" fill="#DD661D"/><path d="M12 17v5" stroke="#DD661D" strokeWidth="2" strokeLinecap="round"/></svg></span>,
    title: 'Peluang & Jaringan Lebih Luas',
    desc: 'Dapatkan sertifikasi resmi yang diakui dan buka akses ke lebih banyak peluang kerja hingga pelatihan lanjutan.'
  }
];

export default function MengapaSertifikasiPKL() {
  return (
    <section className="px-20 py-12">
      <h2 className="text-2xl font-bold mb-2">Mengapa Harus Sertifikasi & PKL di Kami?</h2>
      <p className="text-gray-700 mb-8">Biar perjalanan sertifikasi dan kompetensimu lancar, jelas, dan tanpa ribet, kami siap jadi partner terbaik dalam setiap langkah karirmu!</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reasons.map((item, idx) => (
          <div key={item.title} className="border-2 border-purple-400 rounded-2xl bg-white shadow flex flex-col p-8">
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}