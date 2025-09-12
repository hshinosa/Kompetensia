import React, { useState, useEffect } from 'react';

interface Props {
  readonly onOpen?: () => void;
}

export default function LeftNavSertifikasi({ onOpen }: Props) {
  const [activeSection, setActiveSection] = useState<string>('');

  const sections = [
    { id: 'detail', label: 'Detail Sertifikasi' },
    { id: 'materi', label: 'Materi Sertifikasi' },
    { id: 'batch', label: 'Pilihan Batch' },
    { id: 'assessor', label: 'Detail Assessor' },
    { id: 'review', label: 'Review Sertifikasi' },
    { id: 'recommend', label: 'Rekomendasi Sertifikasi' }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Trigger when section is 20% visible from top/bottom
      threshold: 0.3
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSmoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Add offset to account for sticky navbar
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-28 self-start w-full max-w-[240px] h-fit">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <h3 className="font-medium text-base mb-6 text-gray-900">Program Sertifikasi</h3>
        
        <ul className="space-y-3 text-sm mb-6">
          {sections.map((section) => (
            <li key={section.id}>
              <button 
                onClick={() => handleSmoothScroll(section.id)}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? 'text-purple-700 font-semibold'
                    : 'text-gray-600 hover:text-purple-600 hover:font-medium'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
        
        <div>
          <button 
            onClick={() => onOpen?.()}
            className="w-full px-4 py-3 rounded-2xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </nav>
  );
}
