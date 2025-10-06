import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import VideoDetailModal from './VideoDetailModal';

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
  video_data?: {
    id: number;
    nama_video: string;
    slug: string;
    deskripsi: string;
    video_url: string;
    thumbnail?: string;
    uploader: string;
    durasi: number;
    views: number;
    created_at: string;
  };
}

interface ArtikelDanVideoPilihanProps {
  readonly articles: Artikel[];
  readonly videos: Artikel[];
}

const defaultArticle = {
  id: 0,
  type: 'blog' as const,
  title: 'Bagaimana cara belajar digital marketing',
  author: 'Willy Baro',
  date: '20 Juli 2025',
  img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  slug: '#',
};

const defaultVideo = {
  id: 0,
  type: 'video' as const,
  title: 'Tutorial Digital Marketing untuk Pemula',
  author: 'Video Creator',
  date: '25 Juli 2025',
  img: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80',
  desc: 'Belajar digital marketing dari dasar hingga mahir',
  slug: '#',
  durasi: '15:30',
};

export default function ArtikelDanVideoPilihan({ articles = [], videos = [] }: ArtikelDanVideoPilihanProps) {
  // Modal state untuk video
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Jika tidak ada artikel dari database, gunakan artikel default
  const displayArticles = articles.length > 0 ? articles : Array(4).fill(defaultArticle);
  const displayVideos = videos.length > 0 ? videos : Array(4).fill(defaultVideo);

  const handleArticleClick = (artikel: Artikel) => {
    // Redirect to article show page
    router.get(`/artikel/${artikel.slug}`);
  };

  const handleVideoClick = (video: Artikel) => {
    if (video.video_data) {
      // Use video_data from server for modal
      setSelectedVideo(video.video_data);
      setIsVideoModalOpen(true);
    } else {
      // Fallback for videos without video_data
      alert('Video data not available');
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };
  
  return (
    <>
      {/* Section Artikel Pilihan */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Artikel Pilihan</h2>
            <a href="/artikel" className="text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm">
              Lihat Semua Artikel →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayArticles.slice(0, 4).map((artikel, idx) => (
              <div 
                key={artikel.id || idx} 
                className="bg-white rounded-2xl sm:rounded-3xl border-2 border-purple-400 overflow-hidden hover:shadow-md hover:border-purple-600 transition-all duration-300 cursor-pointer"
                onClick={() => handleArticleClick(artikel)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 relative">
                    {artikel.img ? (
                      <img 
                        src={artikel.img} 
                        alt={artikel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 sm:w-16 h-12 sm:h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className="bg-purple-600 text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                      ARTIKEL
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">{artikel.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-2">{artikel.desc}</p>
                  <div className="text-xs text-gray-500 mb-3 sm:mb-4">{artikel.author}, {artikel.date}</div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-purple-700 text-xs sm:text-sm font-semibold">
                      Baca Selengkapnya →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Video Pilihan */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Video Pilihan</h2>
            <a href="/video" className="text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm">
              Lihat Semua Video →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayVideos.slice(0, 4).map((video, idx) => (
              <div 
                key={video.id || idx} 
                className="border-2 border-purple-400 rounded-2xl sm:rounded-3xl bg-white flex flex-col overflow-hidden hover:shadow-md hover:border-purple-600 transition-all duration-300 cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative">
                  <img src={video.img} alt={video.title} className="w-full h-32 sm:h-40 object-cover rounded-t-xl sm:rounded-t-2xl" />
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className="bg-red-600 text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                      VIDEO
                    </span>
                  </div>
                  {video.durasi && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      {video.durasi}
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2 sm:p-3 hover:bg-opacity-70 transition-all">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-2">{video.desc}</p>
                  <div className="text-xs text-gray-500 mb-3 sm:mb-4">{video.author}, {video.date}</div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-purple-700 text-xs sm:text-sm font-semibold">
                      Tonton Video →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Detail Modal */}
      <VideoDetailModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />
    </>
  );
}