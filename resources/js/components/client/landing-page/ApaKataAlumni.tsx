import React from 'react';

const alumniList = [
  {
    name: 'Jane Doe', 
    role: 'Digital Marketing Specialist',
    company: 'Creative Agency',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    text: 'Sertifikasi dan PKL di sini benar-benar mengubah karir saya. Materi yang diberikan sangat praktis dan langsung bisa diaplikasikan di dunia kerja. Mentornya juga sangat berpengalaman dan supportive.',
    rating: 5
  },
  {
    name: 'Arlene McCoy', 
    role: 'Frontend Developer',
    company: 'Tech Solutions',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg', 
    text: 'Program yang sangat komprehensif! Dari sertifikasi hingga PKL, semuanya tersusun dengan baik. Saya sangat merekomendasikan untuk yang ingin meningkatkan skill dan pengalaman kerja.',
    rating: 5
  },
  {
    name: 'Ronald Richards', 
    role: 'UI/UX Designer',
    company: 'Design Studio',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    text: 'Best decision ever! Program PKL dan sertifikasinya comprehensive banget. Sekarang saya udah confident untuk masuk ke industri tech. Terima kasih mentornya yang sabar!',
    rating: 5
  },
  {
    name: 'Philip Jones', 
    role: 'Data Analyst',
    company: 'Analytics Corp',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg', 
    text: 'Kualitas pembelajaran yang luar biasa. Sertifikat dan pengalaman PKL yang diperoleh sangat membantu dalam meningkatkan kredibilitas profesional di industri.',
    rating: 4
  },
  {
    name: 'Victoria Smith', 
    role: 'Content Creator',
    company: 'Media Company',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', 
    text: 'Program yang sangat membantu dalam mengembangkan skill dan memberikan pengalaman praktis yang valuable. Mentor dan fasilitasnya juga sangat mendukung proses pembelajaran.',
    rating: 5
  },
  {
    name: 'Shawn Williams', 
    role: 'Web Developer',
    company: 'IT Solutions',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg', 
    text: 'Dari segi materi, praktek, dan networking, semuanya luar biasa. Program ini benar-benar mempersiapkan kita untuk siap terjun ke dunia kerja dengan skill yang dibutuhkan industri.',
    rating: 5
  },
];

export default function ApaKataAlumni() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Apa Kata Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-12">
          {alumniList.map((item) => (
            <div 
              key={item.name} 
              className="bg-white rounded-2xl p-6 border-2 border-purple-400 hover:shadow-xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Profile */}
              <div className="flex items-center mb-4">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-full mr-4 ring-2 ring-purple-100 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-purple-600 font-medium">{item.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(item.rating)].map((_, starIndex) => (
                  <svg key={`star-${item.name}-${starIndex}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
                "{item.text}"
              </blockquote>

              {/* Quote Icon */}
              <div className="flex justify-end">
                <svg className="w-8 h-8 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}