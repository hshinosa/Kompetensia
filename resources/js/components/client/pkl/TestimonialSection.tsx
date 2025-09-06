import React, { useState, useEffect } from 'react';

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: 'Jane Doe',
      role: 'UI/UX Designer',
      company: 'Tech Solutions',
      image: 'https://ui-avatars.com/api/?name=Jane+Doe&background=8B5CF6&color=fff',
      testimonial: 'Program PKL ini benar-benar mengubah perspektif saya tentang dunia kerja. Saya mendapatkan pengalaman yang tak ternilai dan skill yang sangat dibutuhkan industri. Mentornya juga sangat supportive dan memberikan feedback konstruktif.',
      rating: 5
    },
    {
      id: 2,
      name: 'A-rima',
      role: 'Frontend Developer',
      company: 'Digital Agency',
      image: 'https://ui-avatars.com/api/?name=A-rima&background=8B5CF6&color=fff',
      testimonial: 'Pengalaman yang luar biasa! Dari tidak tahu apa-apa tentang development sampai bisa membuat aplikasi web yang kompleks. Tim mentornya sangat berpengalaman dan sabar dalam membimbing. Highly recommended!',
      rating: 5
    },
    {
      id: 3,
      name: 'Ronald',
      role: 'Data Analyst',
      company: 'Analytics Corp',
      image: 'https://ui-avatars.com/api/?name=Ronald&background=8B5CF6&color=fff',
      testimonial: 'PKL di sini memberikan exposure ke real project yang benar-benar challenging. Saya belajar tidak hanya technical skills tapi juga soft skills seperti komunikasi dan problem solving. Worth every minute!',
      rating: 5
    },
    {
      id: 4,
      name: 'Sarah',
      role: 'Backend Developer',
      company: 'Startup Inc',
      image: 'https://ui-avatars.com/api/?name=Sarah&background=8B5CF6&color=fff',
      testimonial: 'Sistem mentoring yang terstruktur dan environment yang mendukung membuat saya berkembang pesat. Project yang dikerjakan juga real-world cases, jadi portfolio saya jadi kuat untuk apply kerja.',
      rating: 5
    },
    {
      id: 5,
      name: 'Michael',
      role: 'Mobile Developer',
      company: 'Mobile Labs',
      image: 'https://ui-avatars.com/api/?name=Michael&background=8B5CF6&color=fff',
      testimonial: 'Best decision ever! Program PKL-nya comprehensive banget, dari technical sampai soft skills. Sekarang saya udah confident untuk masuk ke industri tech. Terima kasih mentornya yang sabar!',
      rating: 5
    }
  ];

  // Auto-rotate testimonials every 4 seconds dengan smooth sliding animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonial" className="py-16">
      <div className="text-left mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Kisah Mereka yang Sudah Bergabung
        </h2>
        <p className="text-gray-600 max-w-3xl">
          Dengar langsung dari alumni PKL kami tentang pengalaman dan transformasi yang mereka alami
        </p>
      </div>

      <div className="overflow-hidden">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-transform duration-500 ease-in-out ${
          isTransitioning ? 'transform translate-x-8' : 'transform translate-x-0'
        }`}>
          {getVisibleTestimonials().map((testimonial, index) => (
            <div 
              key={`${testimonial.id}-${currentIndex}-${index}`} 
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Profile */}
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 ring-2 ring-purple-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-purple-600 font-medium">{testimonial.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <svg key={`star-${testimonial.id}-${starIndex}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
                "{testimonial.testimonial}"
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

      {/* Simple Indicator Dots - hanya sebagai visual indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <div 
            key={`dot-${index}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-purple-600 scale-125' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
