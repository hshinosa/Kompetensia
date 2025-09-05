import React from 'react';

interface Props {
  readonly selectedCategory: string;
  readonly categories: string[];
  readonly onCategoryChange: (category: string) => void;
  readonly onOpen?: () => void;
}

export default function LeftNavPKL({ selectedCategory, categories, onCategoryChange, onOpen }: Props) {
  return (
    <nav className="sticky top-28 self-start w-full max-w-[240px] h-fit">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <h3 className="font-medium text-base mb-6 text-gray-900">Program Praktik Kerja Lapangan</h3>
        
        <ul className="space-y-3 text-sm mb-6">
          <li>
            <a 
              href="#keunggulan"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-1"
            >
              Keunggulan & Manfaat
            </a>
          </li>
          <li>
            <a 
              href="#galeri"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-1"
            >
              Galeri
            </a>
          </li>
          <li>
            <a 
              href="#testimonial"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-1"
            >
              Review Alumni
            </a>
          </li>
          <li>
            <a 
              href="#faq"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-1"
            >
              FAQ
            </a>
          </li>
        </ul>
        
        <div>
          <button 
            onClick={() => onOpen?.()}
            className="w-full px-4 py-3 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Daftar
          </button>
        </div>
      </div>
    </nav>
  );
}
