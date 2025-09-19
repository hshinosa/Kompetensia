import React, { useEffect, useState } from 'react';

interface Artikel {
  id: number;
  type?: 'blog' | 'video';
  title: string;
  author: string;
  date: string;
  img: string;
  desc: string;
  slug: string;
  durasi?: string;
}

interface Props {
  readonly article: Artikel | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function ArticleDetailModal({ article, isOpen, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle animated close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  if (!isOpen || !article) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleActionClick = () => {
    if (article.slug !== '#') {
      if (article.type === 'video') {
        // For videos, you might want to open in a new tab or show video player
        window.open(`/video/${article.slug}`, '_blank');
      } else {
        // For blogs, navigate to the blog page
        window.open(`/blog/${article.slug}`, '_blank');
      }
    }
    handleClose();
  };

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
        isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-200 ${
        isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
      }`}>
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
          <p className="text-purple-100 mb-4">{article.desc}</p>
          
          {/* Article Info */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-sm">{article.type === 'video' ? 'Video' : 'Artikel'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-sm">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-sm">{article.date}</span>
            </div>
            {article.type === 'video' && article.durasi && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-sm">{article.durasi}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Article Image */}
          <div className="mb-6">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
              <img 
                src={article.img} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {article.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
              )}
              {article.type === 'video' && article.durasi && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded-full">
                  {article.durasi}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Content Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tentang {article.type === 'video' ? 'Video' : 'Artikel'} Ini</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">Ditulis oleh {article.author}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">Dipublikasikan pada {article.date}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">
                    {article.type === 'video' 
                      ? 'Konten video pembelajaran' 
                      : 'Artikel edukatif dan informatif'
                    }
                  </span>
                </div>
                {article.type === 'video' && article.durasi && (
                  <div className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Durasi: {article.durasi}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Content */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preview Konten</h3>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {article.desc}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    💡 <strong>Yang akan Anda dapatkan:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pengetahuan mendalam tentang topik</li>
                    <li>• {article.type === 'video' ? 'Tutorial visual yang mudah diikuti' : 'Panduan praktis dan tips berguna'}</li>
                    <li>• Wawasan dari {article.author}</li>
                    <li>• {article.type === 'video' ? 'Materi video berkualitas tinggi' : 'Pembahasan komprehensif'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleActionClick}
            className="block w-full py-3 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors text-center"
          >
            {article.type === 'video' ? 'Tonton Video Lengkap' : 'Baca Artikel Lengkap'}
          </button>
        </div>
      </div>
    </div>
  );
}