import React from 'react';

interface Props {
  readonly selectedCategory: string;
  readonly categories: string[];
  readonly onCategoryChange: (category: string) => void;
  readonly onOpen?: () => void;
}

export default function LeftNavPKL({ selectedCategory, categories, onCategoryChange, onOpen }: Props) {
  return (
    <nav className="sticky top-28 self-start w-65 max-w-[250px]">
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Program Praktik Kerja</h3>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => onCategoryChange('')}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedCategory === '' ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100'
              }`}
            >
              Semua Program
            </button>
          </li>
          {categories.slice(1).map((category) => (
            <li key={category}>
              <button 
                onClick={() => onCategoryChange(category)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedCategory === category ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Jelajahi</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="#why-pkl"
                className="block text-gray-600 hover:text-purple-600 transition-colors"
              >
                Kenapa PKL di Kami
              </a>
            </li>
            <li>
              <a 
                href="#manfaat"
                className="block text-gray-600 hover:text-purple-600 transition-colors"
              >
                Manfaat Nyata
              </a>
            </li>
            <li>
              <a 
                href="#bukti"
                className="block text-gray-600 hover:text-purple-600 transition-colors"
              >
                Bukti Nyata
              </a>
            </li>
            <li>
              <a 
                href="#testimonial"
                className="block text-gray-600 hover:text-purple-600 transition-colors"
              >
                Testimonial
              </a>
            </li>
            <li>
              <a 
                href="#faq"
                className="block text-gray-600 hover:text-purple-600 transition-colors"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={() => onOpen?.()}
            className="w-full px-4 py-2 rounded-md bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </nav>
  );
}
