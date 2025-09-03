import React from 'react';

export default function BuktiNyataSection() {
  const portfolioImages = [
    { id: 'portfolio-1', src: '/images/portfolio-1.jpg', title: 'E-Commerce Platform' },
    { id: 'portfolio-2', src: '/images/portfolio-2.jpg', title: 'Mobile Banking App' }, 
    { id: 'portfolio-3', src: '/images/portfolio-3.jpg', title: 'Dashboard Analytics' },
    { id: 'portfolio-4', src: '/images/portfolio-4.jpg', title: 'Learning Management System' },
    { id: 'portfolio-5', src: '/images/portfolio-5.jpg', title: 'Social Media Platform' },
    { id: 'portfolio-6', src: '/images/portfolio-6.jpg', title: 'IoT Monitoring System' }
  ];

  return (
    <section id="bukti" className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Bukti Nyata dan Pengalaman Mereka
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Lihat hasil karya dan pencapaian peserta PKL kami yang berhasil menciptakan project berkualitas tinggi
        </p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {portfolioImages.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl bg-gray-200 aspect-video hover:shadow-lg transition-all duration-300">
            <img 
              src={item.src} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white text-sm font-medium">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
