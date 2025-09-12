import React from 'react';

const pklList = [
  {
    title: 'UI/UX',
    desc: 'UI/UX Design adalah proses perancangan tampilan (UI) dan pengalaman pengguna (UX) pada sebuah produk digital.',
    tags: ['Remote', 'Hybrid', 'Design'],
  },
  {
    title: 'Fullstack Development',
    desc: 'Fullstack Development adalah keahlian dalam mengembangkan aplikasi secara menyeluruh, mencakup sisi frontend dan backend.',
    tags: ['Remote', 'Hybrid', 'Tech'],
  },
  {
    title: 'Graphic Design',
    desc: 'Desain Grafis adalah bidang yang berfokus pada komunikasi visual melalui elemen-elemen seperti tipografi, warna, ilustrasi, dan tata letak.',
    tags: ['Remote', 'Hybrid', 'Design'],
  },
  {
    title: 'Video Editor',
    desc: 'Video Editor adalah profesional yang bertanggung jawab dalam menyusun, memotong, dan menggabungkan footage video untuk menghasilkan konten visual yang menarik dan informatif.',
    tags: ['Remote', 'Hybrid', 'Media'],
  },
  {
    title: 'Content Creator',
    desc: 'Content Creator adalah individu yang bertanggung jawab membuat konten menarik dan relevan untuk berbagai platform digital, seperti media sosial, blog, atau video.',
    tags: ['Remote', 'Hybrid', 'Media'],
  },
  {
    title: 'Animasi',
    desc: 'Animasi adalah teknik visual yang menghidupkan gambar statis menjadi gerakan dinamis untuk menyampaikan pesan, cerita, atau konsep secara menarik dan mudah dipahami.',
    tags: ['Remote', 'Hybrid', 'Design'],
  },
];

export default function ProgramPKL() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Temukan Program PKL</h2>
        <p className="text-gray-700 mb-8">Jelajahi beragam pilihan praktik kerja dan magang yang relevan dengan bidangmu</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pklList.map((item, idx) => (
            <div key={idx} className="border-2 border-purple-400 rounded-2xl bg-white shadow flex flex-col p-8 min-w-[270px] md:min-w-[320px] max-w-full">
              <div className="flex gap-2 mb-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-semibold">{tag}</span>
                ))}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700 mb-6">{item.desc}</p>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 px-4 py-2 rounded-lg bg-purple-700 text-white font-semibold">Ambil Program</button>
                <button className="flex-1 px-4 py-2 rounded-lg border border-orange-400 text-orange-700 font-semibold">Pelajari Program</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}