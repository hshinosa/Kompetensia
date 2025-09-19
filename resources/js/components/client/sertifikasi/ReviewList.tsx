import React from 'react';

const reviews = [
  { 
    id: 1, 
    name: 'Jane Doe', 
    role: 'Digital Marketing Specialist',
    company: 'Creative Agency',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Sertifikasi ini benar-benar mengubah karir saya. Materi yang diberikan sangat praktis dan langsung bisa diaplikasikan di dunia kerja. Mentornya juga sangat berpengalaman.',
    rating: 5
  },
  { 
    id: 2, 
    name: 'Arlene McCoy', 
    role: 'Web Developer',
    company: 'Tech Solutions',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: 'Program sertifikasi yang sangat komprehensif. Dari teori hingga praktik, semuanya tersusun dengan baik. Saya sangat merekomendasikan untuk yang ingin meningkatkan skill.',
    rating: 5
  },
  { 
    id: 3, 
    name: 'Ronald Richards', 
    role: 'Network Engineer',
    company: 'IT Services',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Kualitas pembelajaran yang luar biasa. Sertifikat yang diperoleh juga sangat membantu dalam meningkatkan kredibilitas profesional di industri.',
    rating: 4
  },
];

export default function ReviewList() {
  return (
    <div id="review">
      <h4 className="text-lg font-semibold mb-4 text-gray-900">Review Sertifikasi</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div 
            key={r.id} 
            className="bg-white rounded-2xl p-6 border-2 border-purple-400 hover:shadow-xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Profile */}
            <div className="flex items-center mb-4">
              <img 
                src={r.avatar} 
                alt={r.name}
                className="w-12 h-12 rounded-full mr-4 ring-2 ring-purple-100 object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{r.name}</h4>
                <p className="text-xs text-purple-600 font-medium">{r.company}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(r.rating)].map((_, starIndex) => (
                <svg key={`star-${r.id}-${starIndex}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>

            {/* Review Text */}
            <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
              "{r.text}"
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
  );
}
