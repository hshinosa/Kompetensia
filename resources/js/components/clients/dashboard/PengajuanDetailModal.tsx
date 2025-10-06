import React, { useState, useEffect } from 'react';

export interface PengajuanItem {
  id: number;
  tanggal: string;
  jenis_pengajuan: string;
  nama: string;
  status: string;
  deskripsi?: string;
  institusi?: string;
  periode?: string;
  catatan?: string;
}

export interface DetailedRegistrationData {
  id: number;
  jenis_pengajuan: string;
  status: string;
  tanggal_pendaftaran: string;
  tingkat_motivasi?: number;
  nilai_diri?: string;
  motivasi?: string;
  posisi_pkl?: {
    nama_posisi: string;
    kategori: string;
    tipe: string;
    durasi_bulan: number;
  };
  sertifikasi?: {
    nama_sertifikasi: string;
    jenis_sertifikasi: string;
    deskripsi: string;
  };
  batch?: {
    nama_batch: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    kapasitas_peserta: number;
  };
  data_diri: {
    nama_lengkap: string;
    email: string;
    email_pendaftar?: string;
    nomor_telepon: string;
    nomor_handphone?: string;
    no_telp?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    alamat_lengkap?: string;
    instagram?: string;
    tiktok?: string;
  };
  background_pendidikan?: {
    institusi_asal: string;
    asal_sekolah?: string;
    jenis_institusi?: string;
    jurusan?: string;
    kelas?: string;
    program_studi?: string;
    semester?: number;
    awal_pkl?: string;
    akhir_pkl?: string;
  };
  skill_minat?: {
    kemampuan_ditingkatkan: string;
    skill_kelebihan: string;
    pernah_membuat_video: string;
  };
  motivasi_pkl?: {
    motivasi: string;
    tingkat_motivasi: number;
    nilai_diri: string;
  };
  persyaratan_khusus?: {
    memiliki_laptop: string;
    memiliki_kamera_dslr: string;
    transportasi_operasional: string;
    apakah_merokok: string;
    bersedia_ditempatkan: string;
    bersedia_masuk_2_kali: string;
  };
  berkas?: {
    cv_file_name?: string;
    portfolio_file_name?: string;
    berkas_persyaratan?: any;
  };
  cv_file_name?: string;
  cv_file_path?: string;
  portfolio_file_name?: string;
  portfolio_file_path?: string;
  berkas_persyaratan?: any;
  catatan_admin?: string;
}

interface PengajuanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengajuanData: PengajuanItem | null;
  detailedData?: DetailedRegistrationData | null;
  isLoadingDetail?: boolean;
}

export default function PengajuanDetailModal({ isOpen, onClose, pengajuanData, detailedData, isLoadingDetail }: PengajuanDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen || !pengajuanData) return null;

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateSimple = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return {
          text: 'Disetujui',
          color: 'text-green-800',
          bgColor: 'bg-green-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ),
        };
      case 'Ditolak':
        return {
          text: 'Ditolak',
          color: 'text-red-800',
          bgColor: 'bg-red-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ),
        };
      default:
        return {
          text: 'Sedang Diverifikasi',
          color: 'text-yellow-800',
          bgColor: 'bg-yellow-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
        };
    }
  };

  const statusInfo = getStatusInfo(pengajuanData.status);

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-2 sm:p-4 transition-all duration-200 ${
        isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-xl sm:rounded-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-200 ${
        isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
      }`}>
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 pr-8">Detail Pengajuan</h2>
          <p className="text-sm sm:text-base text-purple-100">{pengajuanData.jenis_pengajuan}</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-600">Memuat detail pendaftaran...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Status Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center ${statusInfo.color} flex-shrink-0`}>
                    <div className="scale-90 sm:scale-100">{statusInfo.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">Status Pengajuan</p>
                    <p className={`text-xs sm:text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
                  </div>
                </div>
                <div className="sm:text-right pl-12 sm:pl-0">
                  <p className="text-xs sm:text-sm text-gray-500">Tanggal Pengajuan</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{detailedData?.tanggal_pendaftaran || pengajuanData.tanggal}</p>
                </div>
              </div>

              {detailedData ? (
                /* Detailed Data Display */
                <>
                  {/* Check if it's Sertifikasi Kompetensi - show simplified view */}
                  {detailedData.jenis_pengajuan.toLowerCase().includes('sertifikasi') ? (
                    <div className="space-y-6">
                      {/* Program Info */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-purple-200 shadow-sm">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Program</h3>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jenis Pengajuan</label>
                            <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{detailedData.jenis_pengajuan}</p>
                          </div>
                          {detailedData.sertifikasi && (
                            <>
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Sertifikasi</label>
                                <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{detailedData.sertifikasi.nama_sertifikasi}</p>
                              </div>
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jenis Sertifikasi</label>
                                <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{detailedData.sertifikasi.jenis_sertifikasi}</p>
                              </div>
                              {detailedData.sertifikasi.deskripsi && (
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                  <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{detailedData.sertifikasi.deskripsi}</p>
                                </div>
                              )}
                            </>
                          )}
                          {detailedData.batch && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
                              <h4 className="text-sm sm:text-base font-semibold text-purple-800 mb-2 sm:mb-3 flex items-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                                </svg>
                                Batch yang Dipilih
                              </h4>
                              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Nama Batch</label>
                                  <p className="text-sm sm:text-base text-gray-900 font-medium">{detailedData.batch.nama_batch}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Mulai</label>
                                    <p className="text-sm sm:text-base text-gray-900">{detailedData.batch.tanggal_mulai}</p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Selesai</label>
                                    <p className="text-sm sm:text-base text-gray-900">{detailedData.batch.tanggal_selesai}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Data Pribadi - Simplified for Sertifikasi */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-blue-200 shadow-sm">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Data Pribadi</h3>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900 font-medium">{detailedData.data_diri.nama_lengkap}</p>
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900 break-all">{detailedData.data_diri.email_pendaftar || detailedData.data_diri.email}</p>
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                            <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{detailedData.data_diri.nomor_handphone || detailedData.data_diri.nomor_telepon || detailedData.data_diri.no_telp}</p>
                          </div>
                        </div>
                      </div>

                      {/* Catatan Admin untuk Sertifikasi */}
                      {detailedData.catatan_admin && (
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-amber-200 shadow-sm">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 ${
                              pengajuanData.status === 'Disetujui' ? 'bg-green-600' : 
                              pengajuanData.status === 'Ditolak' ? 'bg-red-600' : 'bg-amber-600'
                            }`}>
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {pengajuanData.status === 'Disetujui' ? 'Catatan Persetujuan' : 
                               pengajuanData.status === 'Ditolak' ? 'Catatan Penolakan' : 'Catatan Admin'}
                            </h3>
                          </div>
                          <div className="bg-white p-3 sm:p-4 rounded-lg border-l-4 border-amber-500 shadow-sm">
                            <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap leading-relaxed">{detailedData.catatan_admin}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Full PKL view with all details */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Left Column */}
                      <div className="space-y-4 sm:space-y-6">
                        {/* Program Info */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-purple-200 shadow-sm">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Program</h3>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jenis Pengajuan</label>
                              <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{detailedData.jenis_pengajuan}</p>
                            </div>
                            {detailedData.posisi_pkl && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Posisi PKL</label>
                              <p className="bg-white p-3 rounded-lg border border-purple-200 text-gray-900">{detailedData.posisi_pkl.nama_posisi}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <p className="bg-white p-3 rounded-lg border border-purple-200 text-gray-900">{detailedData.posisi_pkl.kategori}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                <p className="bg-white p-3 rounded-lg border border-purple-200 text-gray-900">{detailedData.posisi_pkl.tipe}</p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Bulan)</label>
                              <p className="bg-white p-3 rounded-lg border border-purple-200 text-gray-900">{detailedData.posisi_pkl.durasi_bulan}</p>
                            </div>
                          </>
                        )}
                        {detailedData.sertifikasi && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikasi</label>
                              <p className="bg-white p-2 rounded border text-gray-900">{detailedData.sertifikasi.nama_sertifikasi}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Sertifikasi</label>
                              <p className="bg-white p-2 rounded border text-gray-900">{detailedData.sertifikasi.jenis_sertifikasi}</p>
                            </div>
                            {detailedData.sertifikasi.deskripsi && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <p className="bg-white p-2 rounded border text-gray-900">{detailedData.sertifikasi.deskripsi}</p>
                              </div>
                            )}
                          </>
                        )}
                        {detailedData.batch && (
                          <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
                            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                              </svg>
                              Batch yang Dipilih
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Batch</label>
                                <p className="text-gray-900 font-medium">{detailedData.batch.nama_batch}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Mulai</label>
                                  <p className="text-gray-900">{detailedData.batch.tanggal_mulai}</p>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Selesai</label>
                                  <p className="text-gray-900">{detailedData.batch.tanggal_selesai}</p>
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Kapasitas Peserta</label>
                                <p className="text-gray-900">{detailedData.batch.kapasitas_peserta} orang</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Data Diri */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Data Pribadi</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                          <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900 font-medium">{detailedData.data_diri.nama_lengkap}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.email_pendaftar || detailedData.data_diri.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.nomor_handphone || detailedData.data_diri.nomor_telepon || detailedData.data_diri.no_telp}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.tempat_lahir || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.tanggal_lahir ? formatDateSimple(detailedData.data_diri.tanggal_lahir) : 'Tidak ada data'}</p>
                          </div>
                        </div>
                        {detailedData.data_diri.alamat_lengkap && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.alamat_lengkap}</p>
                          </div>
                        )}
                        {/* Social Media Links - Always show for PKL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.instagram || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                            <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-900">{detailedData.data_diri.tiktok || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background Pendidikan */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Latar Belakang Pendidikan</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institusi Asal</label>
                          <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-900 font-medium">{detailedData.background_pendidikan?.institusi_asal || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah/Universitas</label>
                          <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-900">{detailedData.background_pendidikan?.asal_sekolah || detailedData.background_pendidikan?.jenis_institusi || 'N/A'}</p>
                        </div>
                        {detailedData.background_pendidikan?.institusi_asal === 'Sekolah' ? (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                              <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-900">{detailedData.background_pendidikan?.jurusan || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                              <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-900">{detailedData.background_pendidikan?.kelas || 'N/A'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                              <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-900">{detailedData.background_pendidikan?.program_studi || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                              <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-900">{detailedData.background_pendidikan?.semester || 'N/A'}</p>
                            </div>
                          </div>
                        )}
                        {/* Period PKL for both school and university */}
                        {detailedData && detailedData.posisi_pkl && detailedData.background_pendidikan && (
                          <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                              </svg>
                              Periode PKL
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600">Periode Awal:</span>
                                <p className="font-medium text-gray-900">{detailedData.background_pendidikan?.awal_pkl ? formatDateSimple(detailedData.background_pendidikan.awal_pkl) : 'Tidak ada data'}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Periode Akhir:</span>
                                <p className="font-medium text-gray-900">{detailedData.background_pendidikan?.akhir_pkl ? formatDateSimple(detailedData.background_pendidikan.akhir_pkl) : 'Tidak ada data'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Skill & Minat for PKL */}
                    {detailedData && detailedData.posisi_pkl && detailedData.skill_minat && (
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Skill & Minat</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Skill/Kelebihan</label>
                          <p className="bg-white p-3 rounded-lg border border-indigo-200 text-gray-900">{detailedData.skill_minat.skill_kelebihan || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kemampuan yang Ingin Ditingkatkan</label>
                          <p className="bg-white p-3 rounded-lg border border-indigo-200 text-gray-900">{detailedData.skill_minat.kemampuan_ditingkatkan || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pernah Membuat Video</label>
                          <p className="bg-white p-3 rounded-lg border border-indigo-200 text-gray-900">{detailedData.skill_minat.pernah_membuat_video || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Motivasi PKL */}
                    {detailedData && detailedData.posisi_pkl && (
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Motivasi PKL</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Motivasi</label>
                            <div className="bg-white p-3 rounded-lg border border-pink-200">
                              <span className="text-lg font-bold text-pink-600">{detailedData.motivasi_pkl?.tingkat_motivasi || 'Tidak ada data'}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Diri</label>
                            <p className="bg-white p-3 rounded-lg border border-pink-200 text-gray-900 whitespace-pre-wrap">{detailedData.motivasi_pkl?.nilai_diri || 'Tidak ada data'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivasi</label>
                            <p className="bg-white p-3 rounded-lg border border-pink-200 text-gray-900 whitespace-pre-wrap">{detailedData.motivasi_pkl?.motivasi || 'Tidak ada data'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Persyaratan Khusus PKL */}
                    {detailedData && detailedData.posisi_pkl && detailedData.persyaratan_khusus && (
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl border border-teal-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Persyaratan Khusus</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Memiliki Laptop</label>
                          <p className="bg-white p-3 rounded-lg border border-teal-200 text-gray-900">{detailedData.persyaratan_khusus.memiliki_laptop || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Memiliki Kamera DSLR</label>
                          <p className="bg-white p-3 rounded-lg border border-teal-200 text-gray-900">{detailedData.persyaratan_khusus.memiliki_kamera_dslr || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transportasi Operasional</label>
                          <p className="bg-white p-3 rounded-lg border border-teal-200 text-gray-900">{detailedData.persyaratan_khusus.transportasi_operasional || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apakah Merokok</label>
                          <p className="bg-white p-3 rounded-lg border border-teal-200 text-gray-900">{detailedData.persyaratan_khusus.apakah_merokok || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bersedia Ditempatkan</label>
                          <p className="bg-white p-3 rounded-lg border border-teal-200 text-gray-900">{detailedData.persyaratan_khusus.bersedia_ditempatkan || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bersedia Masuk 2x Seminggu</label>
                          <p className="bg-white p-3 rounded-lg border border-teal-200 text-gray-900">{detailedData.persyaratan_khusus.bersedia_masuk_2_kali || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Berkas PKL */}
                    {detailedData.posisi_pkl && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Berkas yang Diunggah</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CV</label>
                            {(detailedData.berkas?.cv_file_name || detailedData.cv_file_name) ? (
                              <div className="bg-white p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-900 flex-1 truncate font-medium">{detailedData.berkas?.cv_file_name || detailedData.cv_file_name}</span>
                                <button className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                  Download
                                </button>
                              </div>
                            ) : (
                              <p className="bg-white p-3 rounded-lg border border-orange-200 text-gray-500 text-sm text-center">Tidak ada file CV</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                            {(detailedData.berkas?.portfolio_file_name || detailedData.portfolio_file_name) ? (
                              <div className="bg-white p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-900 flex-1 truncate font-medium">{detailedData.berkas?.portfolio_file_name || detailedData.portfolio_file_name}</span>
                                <button className="text-xs bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                                  Download
                                </button>
                              </div>
                            ) : (
                              <p className="bg-white p-3 rounded-lg border border-orange-200 text-gray-500 text-sm text-center">Tidak ada file portfolio</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Berkas Persyaratan for Sertifikasi */}
                    {detailedData.berkas_persyaratan && detailedData.jenis_pengajuan.toLowerCase().includes('sertifikasi') && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Berkas Persyaratan</h3>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-orange-200 text-gray-900 text-center">
                          {Array.isArray(detailedData.berkas_persyaratan) 
                            ? detailedData.berkas_persyaratan.length + ' file(s) uploaded'
                            : 'Berkas telah diunggah'
                          }
                        </div>
                      </div>
                    )}

                    {/* Catatan Admin */}
                    {detailedData.catatan_admin && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                            pengajuanData.status === 'Disetujui' ? 'bg-green-600' : 
                            pengajuanData.status === 'Ditolak' ? 'bg-red-600' : 'bg-amber-600'
                          }`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pengajuanData.status === 'Disetujui' ? 'Catatan Persetujuan' : 
                             pengajuanData.status === 'Ditolak' ? 'Catatan Penolakan' : 'Catatan Admin'}
                          </h3>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500 shadow-sm">
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{detailedData.catatan_admin}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                  )}
                </>
              ) : (
                /* Basic Data Display (fallback) */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pengajuan</label>
                    <p className="bg-gray-50 p-3 rounded-lg text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {pengajuanData.jenis_pengajuan}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Program</label>
                    <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.nama}</p>
                  </div>

                  {pengajuanData.deskripsi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                      <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.deskripsi}</p>
                    </div>
                  )}

                  {pengajuanData.institusi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institusi</label>
                      <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.institusi}</p>
                    </div>
                  )}

                  {pengajuanData.periode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Periode Program</label>
                      <p className="bg-gray-50 p-3 rounded-lg text-gray-900">{pengajuanData.periode}</p>
                    </div>
                  )}

                  {/* Catatan Section */}
                  {pengajuanData.catatan && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {pengajuanData.status === 'Disetujui' ? 'Catatan Persetujuan' : pengajuanData.status === 'Ditolak' ? 'Catatan Penolakan' : 'Catatan Verifikasi'}
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900">{pengajuanData.catatan}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
