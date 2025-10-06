import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/layouts/ClientLayout';
import HeroVideo from '@/components/client/video/HeroVideo';
import VideoDetailModal from '@/components/client/landing-page/VideoDetailModal';

interface Video {
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
  featured: boolean;
}

interface VideoIndexProps {
  videos: {
    data: Video[];
    links: any;
    meta: any;
  };
  featured: Video[];
}

export default function Index({ videos, featured }: VideoIndexProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug pagination data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const getVideoThumbnail = (videoUrl: string) => {
    // Extract YouTube video ID and create thumbnail URL
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return null;
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <ClientLayout>
      <Head title="Video - Ujikom" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroVideo />

        {/* Featured Videos */}
        {featured && featured.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Video Unggulan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featured.map((video) => (
                <div key={video.id} className="bg-white rounded-2xl sm:rounded-3xl border-2 border-purple-400 overflow-hidden hover:shadow-md hover:border-purple-600 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-red-500 to-purple-500 relative group cursor-pointer" onClick={() => handleVideoClick(video)}>
                    {video.thumbnail || getVideoThumbnail(video.video_url) ? (
                      <img 
                        src={video.thumbnail || getVideoThumbnail(video.video_url) || ''} 
                        alt={video.nama_video}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586l3 3H18l3-3V8.5A2.5 2.5 0 0018.5 6H5.5A2.5 2.5 0 003 8.5V17.5A2.5 2.5 0 005.5 20h8M9 10V8.5A2.5 2.5 0 0111.5 6H15" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.durasi)}
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <span className="hidden sm:inline">{formatDate(video.created_at)}</span>
                      <span>{formatViews(video.views)} views</span>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                      {video.nama_video}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {video.deskripsi}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        oleh {video.uploader}
                      </span>
                      <button onClick={() => handleVideoClick(video)} className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium">
                        Tonton
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Videos */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Semua Video</h2>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
            {videos.data && videos.data.length > 0 ? (
              videos.data.map((video) => (
                <div key={video.id} className="bg-white rounded-2xl sm:rounded-3xl border-2 border-purple-400 overflow-hidden hover:shadow-md hover:border-purple-600 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative group cursor-pointer" onClick={() => handleVideoClick(video)}>
                    {video.thumbnail || getVideoThumbnail(video.video_url) ? (
                      <img 
                        src={video.thumbnail || getVideoThumbnail(video.video_url) || ''} 
                        alt={video.nama_video}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586l3 3H18l3-3V8.5A2.5 2.5 0 0018.5 6H5.5A2.5 2.5 0 003 8.5V17.5A2.5 2.5 0 005.5 20h8M9 10V8.5A2.5 2.5 0 0111.5 6H15" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.durasi)}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      <span className="hidden sm:inline">{formatDate(video.created_at)}</span>
                      <span>{formatViews(video.views)} views</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                      {video.nama_video}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {video.deskripsi}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        oleh {video.uploader}
                      </span>
                      <button onClick={() => handleVideoClick(video)} className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium">
                        Tonton
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586l3 3H18l3-3V8.5A2.5 2.5 0 0018.5 6H5.5A2.5 2.5 0 003 8.5V17.5A2.5 2.5 0 005.5 20h8M9 10V8.5A2.5 2.5 0 0111.5 6H15" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada video</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Video akan segera tersedia. Silakan cek kembali nanti.
                </p>
              </div>
            )}
          </div>

          {/* Pagination - Same style as DaftarSertifikasi */}
          {videos.links && videos.meta && videos.meta.last_page > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              {/* Previous Button */}
              {(() => {
                const prevLink = videos.links.find((link: any) => link.label.includes('Previous') || link.label.includes('&laquo;'));
                return prevLink && (
                  <Link
                    href={prevLink.url || '#'}
                    preserveScroll
                    className={`p-2 rounded-lg border border-gray-300 transition-colors ${
                      !prevLink.url 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                );
              })()}
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {videos.links
                  .filter((link: any) => !link.label.includes('Previous') && !link.label.includes('Next') && !link.label.includes('&laquo;') && !link.label.includes('&raquo;'))
                  .map((link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      preserveScroll
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        link.active
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                      } flex items-center justify-center`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                  ))}
              </div>
              
              {/* Next Button */}
              {(() => {
                const nextLink = videos.links.find((link: any) => link.label.includes('Next') || link.label.includes('&raquo;'));
                return nextLink && (
                  <Link
                    href={nextLink.url || '#'}
                    preserveScroll
                    className={`p-2 rounded-lg border border-gray-300 transition-colors ${
                      !nextLink.url 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })()}
            </div>
          )}

          {/* Fallback Pagination - jika data belum dari database dengan pagination */}
          {(!videos.links || !videos.meta) && videos.data && videos.data.length > 0 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              {/* Previous Button */}
              <button className="p-2 rounded-lg border border-gray-300 opacity-50 cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                <button className="w-8 h-8 rounded-full text-sm font-medium bg-purple-600 text-white flex items-center justify-center">
                  1
                </button>
              </div>
              
              {/* Next Button */}
              <button className="p-2 rounded-lg border border-gray-300 opacity-50 cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Detail Modal */}
      <VideoDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
      />
    </ClientLayout>
  );
}