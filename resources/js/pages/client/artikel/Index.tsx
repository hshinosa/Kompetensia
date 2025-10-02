import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ClientLayout from '@/layouts/ClientLayout';
import HeroArtikel from '@/components/client/artikel/HeroArtikel';

interface Article {
  id: number;
  nama_artikel: string;
  slug: string;
  deskripsi: string;
  thumbnail?: string;
  penulis: string;
  jenis_konten: string;
  views: number;
  created_at: string;
  featured: boolean;
}

interface ArticleIndexProps {
  articles: {
    data: Article[];
    links: any;
    meta: any;
  };
  featured: Article[];
  filters?: {
    jenis_konten?: string;
  };
}

export default function Index({ articles, featured, filters }: ArticleIndexProps) {
  const [activeFilter, setActiveFilter] = useState(filters?.jenis_konten || 'Semua');

  // Debug pagination data
  console.log('Articles pagination data:', {
    total: articles?.meta?.total,
    per_page: articles?.meta?.per_page,
    current_page: articles?.meta?.current_page,
    last_page: articles?.meta?.last_page,
    links_count: articles?.links?.length
  });

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    router.get('/artikel', 
      filter === 'Semua' ? {} : { jenis_konten: filter },
      { 
        preserveState: true,
        preserveScroll: true 
      }
    );
  };

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

  return (
    <ClientLayout>
      <Head title="Artikel - Ujikom" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroArtikel />

        {/* Featured Articles */}
        {featured && featured.length > 0 && (
          <div className="container mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Artikel Unggulan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((article) => (
                <div key={article.id} className="bg-white rounded-3xl border-2 border-purple-400 overflow-hidden hover:shadow-md hover:border-purple-600 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 relative">
                    {article.thumbnail ? (
                      <img 
                        src={article.thumbnail} 
                        alt={article.nama_artikel}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium">
                        {article.jenis_konten}
                      </span>
                      <span>{formatDate(article.created_at)}</span>
                      <span>{formatViews(article.views)} views</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.nama_artikel}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        oleh {article.penulis}
                      </span>
                      <Link href={`/artikel/${article.slug}`} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Baca Selengkapnya
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div className="container mx-auto px-4 py-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Semua Artikel</h2>
            
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => handleFilterChange('Semua')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === 'Semua'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
              <button 
                onClick={() => handleFilterChange('Tutorial')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === 'Tutorial'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tutorial
              </button>
              <button 
                onClick={() => handleFilterChange('News')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === 'News'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                News
              </button>
              <button 
                onClick={() => handleFilterChange('Tips')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === 'Tips'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tips
              </button>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {articles.data && articles.data.length > 0 ? (
              articles.data.map((article) => (
                <div key={article.id} className="bg-white rounded-3xl border-2 border-purple-400 overflow-hidden hover:shadow-md hover:border-purple-600 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                    {article.thumbnail ? (
                      <img 
                        src={article.thumbnail} 
                        alt={article.nama_artikel}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium">
                        {article.jenis_konten}
                      </span>
                      <span>{formatDate(article.created_at)}</span>
                      <span>{formatViews(article.views)} views</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.nama_artikel}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        oleh {article.penulis}
                      </span>
                      <Link href={`/artikel/${article.slug}`} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Baca
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada artikel</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Artikel akan segera tersedia. Silakan cek kembali nanti.
                </p>
              </div>
            )}
          </div>

          {/* Pagination - Same style as DaftarSertifikasi */}
          {articles.links && articles.meta && articles.meta.last_page > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              {/* Previous Button */}
              {(() => {
                const prevLink = articles.links.find((link: any) => link.label.includes('Previous') || link.label.includes('&laquo;'));
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
                {articles.links
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
                const nextLink = articles.links.find((link: any) => link.label.includes('Next') || link.label.includes('&raquo;'));
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
          {(!articles.links || !articles.meta) && articles.data && articles.data.length > 0 && (
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
    </ClientLayout>
  );
}