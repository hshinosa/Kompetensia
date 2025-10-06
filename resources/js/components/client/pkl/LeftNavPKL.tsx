import React, { useState, useEffect, useRef } from 'react';

interface Props {
  readonly selectedCategory: string;
  readonly categories: string[];
  readonly onCategoryChange: (category: string) => void;
}

export default function LeftNavPKL({ selectedCategory, categories, onCategoryChange }: Props) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  const sections = [
    { id: 'program-list', label: 'Program yang Tersedia' },
    { id: 'why-pkl', label: 'Kenapa PKL di Kami?' },
    { id: 'manfaat', label: 'Manfaat Nyata' },
    { id: 'bukti', label: 'Bukti Nyata & Portfolio' },
    { id: 'testimonial', label: 'Review Alumni' },
    { id: 'faq', label: 'FAQ' }
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

  // Detect scroll past hero section for mobile sticky nav
  useEffect(() => {
    const handleScroll = () => {
      // Hero section height: varies by page, using approximate value
      // Show navbar after scrolling past hero section (with small offset)
      const heroHeight = window.innerWidth >= 1024 ? 420 : 380;
      const offset = 50; // Small offset to trigger slightly before end of hero
      setIsScrolled(window.scrollY > heroHeight - offset);
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Re-check on resize
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Auto-scroll active button into view in horizontal navbar
  useEffect(() => {
    if (activeSection && activeButtonRef.current && isScrolled) {
      activeButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeSection, isScrolled]);

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
    <>
      {/* Mobile Sticky Horizontal Nav - Only visible in mobile when scrolled past hero */}
      <nav 
        className={`lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md transition-all duration-300 ${
          isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                ref={activeSection === section.id ? activeButtonRef : null}
                onClick={() => handleSmoothScroll(section.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar - Hidden on mobile */}
      <nav className="hidden lg:block sticky top-28 self-start w-full max-w-[240px] h-fit">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="font-medium text-base mb-6 text-gray-900">Program Praktik Kerja Lapangan</h3>
          
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
              onClick={() => handleSmoothScroll('program-list')}
              className="w-full px-4 py-3 rounded-2xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Daftar Program
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
