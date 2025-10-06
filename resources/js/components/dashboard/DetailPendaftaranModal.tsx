import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, LinkIcon } from 'lucide-react';

export interface BiodataPeserta { 
  nama: string; 
  full_name?: string;
  email: string; 
  phone?: string;
  address?: string;
  birth_place?: string;
  birth_date?: string;
  tempatTanggalLahir?: string; 
  alamat?: string; 
  noTelepon?: string;
  berkas_persyaratan?: Record<string, string> | null;
  instagram?: string;
  tiktok?: string;
  background_pendidikan?: {
    institusi_asal?: string;
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
    skill_kelebihan?: string;
    kemampuan_ditingkatkan?: string;
    pernah_membuat_video?: string;
  };
  motivasi_pkl?: {
    tingkat_motivasi?: number;
    nilai_diri?: string;
    motivasi?: string;
  };
  persyaratan_khusus?: {
    memiliki_laptop?: string;
    memiliki_kamera_dslr?: string;
    transportasi_operasional?: string;
    apakah_merokok?: string;
    bersedia_ditempatkan?: string;
    bersedia_masuk_2_kali?: string;
  };
}

export interface SertifikasiKompetensi { 
  namaSertifikasi: string; 
  jadwalSertifikasi?: string; 
  batch?: string; 
  assessor?: string;
}

export interface PKLInfo {
  namaPosisi: string;
  perusahaan?: string;
  kategori?: string;
  durasi?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
}

export interface PendaftarData { 
  user_id?: number;
  original_id?: number;
  type?: string;
  nama: string; 
  full_name?: string;
  jenis_pendaftaran: 'Sertifikasi Kompetensi' | 'Praktik Kerja Lapangan';
  status: 'Pengajuan'|'Disetujui'|'Ditolak'; 
  biodata: BiodataPeserta; 
  sertifikasi?: SertifikasiKompetensi;
  pkl_info?: PKLInfo;
  catatan_admin?: string;
}
interface Props { readonly isOpen:boolean; readonly pendaftarData:PendaftarData; readonly onClose:()=>void; readonly onApproval:(status:'Disetujui'|'Ditolak', alasan?:string)=>Promise<void> | void }

export function DetailPendaftaranModal({ isOpen, pendaftarData, onClose, onApproval }:Props) {
  const [rejectionReason,setRejectionReason] = React.useState('');
  const [showReject,setShowReject] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Effect to track modal state
  React.useEffect(() => {
    // Modal data validation can be added here if needed
  }, [isOpen, pendaftarData]);
  
  const approve = async () => { 
    setIsProcessing(true);
    setError(null);
    try {
      await onApproval('Disetujui'); 
      onClose(); 
    } catch (err) {
      setError('Gagal menyetujui pendaftaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const rejectFlow = () => {
    setShowReject(true);
    setError(null);
  };
  
  const submitReject = async () => {
    if(!rejectionReason.trim()) {
      setError('Alasan penolakan harus diisi.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      await onApproval('Ditolak', rejectionReason);
      setRejectionReason('');
      setShowReject(false);
      onClose();
    } catch (err) {
      setError('Gagal menolak pendaftaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleOpenChange = (open:boolean) => { 
    if(!open){ 
      setShowReject(false); 
      setRejectionReason(''); 
      setError(null);
      onClose(); 
    } 
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent hideClose={true} className="w-auto h-auto !max-w-[95vw] max-h-[90vh] overflow-hidden p-0 flex flex-col">
        {/* Purple Header - matching client modal */}
        <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-t-lg relative flex-shrink-0">
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 pr-8">Detail Pendaftaran</h2>
          <p className="text-sm sm:text-base text-purple-100">{pendaftarData.jenis_pendaftaran}</p>
        </div>
        
        {/* Content Container with independent scroll areas */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left side - Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Pendaftar Info */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg mb-4 sm:mb-6">
              <div className="text-xs sm:text-sm text-gray-600">
                <p className="font-medium text-gray-900 text-base">{pendaftarData.biodata.full_name || pendaftarData.biodata.nama}</p>
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-4 sm:space-y-6">
              {/* Biodata Card - matching client style */}
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
                    <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900 font-medium">{pendaftarData.biodata.full_name || pendaftarData.biodata.nama}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900 break-all">{pendaftarData.biodata.email || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{pendaftarData.biodata.phone || pendaftarData.biodata.noTelepon || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{pendaftarData.biodata.birth_place || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{pendaftarData.biodata.birth_date || '-'}</p>
                    </div>
                  </div>
                  {pendaftarData.biodata.address && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{pendaftarData.biodata.address || pendaftarData.biodata.alamat}</p>
                    </div>
                  )}
                  {/* Social Media Links - for PKL */}
                  {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).instagram || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">TikTok</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).tiktok || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Berkas Persyaratan - PKL */}
              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && pendaftarData.biodata.berkas_persyaratan && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-orange-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Berkas yang Diunggah</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {(() => {
                      const berkas = pendaftarData.biodata.berkas_persyaratan;
                      
                      // Handle if berkas is a string (JSON), parse it
                      let berkasData = berkas;
                      if (typeof berkas === 'string') {
                        try {
                          berkasData = JSON.parse(berkas);
                        } catch (e) {
                          return <p className="text-sm text-gray-500">Gagal memuat berkas</p>;
                        }
                      }
                      
                      // Check if we have any files
                      const hasFiles = berkasData && typeof berkasData === 'object' && Object.keys(berkasData).length > 0;
                      
                      if (!hasFiles) {
                        return <p className="text-sm text-gray-500">Tidak ada berkas yang diunggah</p>;
                      }
                      
                      // Helper function to get download URL using admin route
                      const getDownloadUrl = (type: string) => {
                        if (!pendaftarData.original_id) {
                          return '#';
                        }
                        return `/admin/pendaftaran-pkl/${pendaftarData.original_id}/download/${type}`;
                      };
                      
                      // Helper to handle download
                      const handleDownload = (type: string) => {
                        const url = getDownloadUrl(type);
                        if (url !== '#') {
                          window.location.href = url;
                        }
                      };
                      
                      return (
                        <>
                          {/* CV */}
                          {berkasData.cv && (
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">CV</label>
                              <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <span className="text-xs sm:text-sm text-gray-900 flex-1 truncate font-medium">{berkasData.cv.split('/').pop()}</span>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs bg-purple-600 text-white hover:bg-purple-700 border-0 flex-shrink-0"
                                  onClick={() => handleDownload('cv')}
                                >
                                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Portfolio */}
                          {berkasData.portfolio && (
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                              {berkasData.portfolio.startsWith('http') ? (
                                <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                  </div>
                                  <a 
                                    href={berkasData.portfolio} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 underline break-all flex-1 font-medium"
                                  >
                                    {berkasData.portfolio}
                                  </a>
                                </div>
                              ) : (
                                <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-900 flex-1 truncate font-medium">{berkasData.portfolio.split('/').pop()}</span>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs bg-purple-600 text-white hover:bg-purple-700 border-0 flex-shrink-0"
                                    onClick={() => handleDownload('portfolio')}
                                  >
                                    <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}


                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Background Pendidikan - PKL */}
              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && (pendaftarData.biodata as any).background_pendidikan && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Latar Belakang Pendidikan</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Institusi Asal</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-green-200 text-sm sm:text-base text-gray-900 font-medium">{(pendaftarData.biodata as any).background_pendidikan.institusi_asal || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Sekolah/Universitas</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-green-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.asal_sekolah || (pendaftarData.biodata as any).background_pendidikan.jenis_institusi || 'N/A'}</p>
                    </div>
                    {(pendaftarData.biodata as any).background_pendidikan.institusi_asal === 'Sekolah' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                          <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-green-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.jurusan || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Kelas</label>
                          <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-green-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.kelas || 'N/A'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                          <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-green-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.program_studi || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Semester</label>
                          <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-green-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.semester || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    {/* Period PKL */}
                    {((pendaftarData.biodata as any).background_pendidikan.awal_pkl || (pendaftarData.biodata as any).background_pendidikan.akhir_pkl) && (
                      <div className="bg-white p-3 sm:p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                        <h4 className="text-sm sm:text-base font-semibold text-green-800 mb-2 sm:mb-3 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                          </svg>
                          Periode PKL
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div>
                            <span className="text-gray-600">Periode Awal:</span>
                            <p className="font-medium text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.awal_pkl || 'Tidak ada data'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Periode Akhir:</span>
                            <p className="font-medium text-gray-900">{(pendaftarData.biodata as any).background_pendidikan.akhir_pkl || 'Tidak ada data'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skill & Minat - PKL */}
              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && (pendaftarData.biodata as any).skill_minat && (
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-indigo-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Skill & Minat</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Skill/Kelebihan</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-indigo-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).skill_minat.skill_kelebihan || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Kemampuan yang Ingin Ditingkatkan</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-indigo-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).skill_minat.kemampuan_ditingkatkan || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Pernah Membuat Video</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-indigo-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).skill_minat.pernah_membuat_video || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Motivasi PKL */}
              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && (pendaftarData.biodata as any).motivasi_pkl && (
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-pink-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Motivasi PKL</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tingkat Motivasi</label>
                      <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-pink-200">
                        <span className="text-base sm:text-lg font-bold text-pink-600">{(pendaftarData.biodata as any).motivasi_pkl.tingkat_motivasi || 'Tidak ada data'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nilai Diri</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-pink-200 text-sm sm:text-base text-gray-900 whitespace-pre-wrap">{(pendaftarData.biodata as any).motivasi_pkl.nilai_diri || 'Tidak ada data'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Motivasi</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-pink-200 text-sm sm:text-base text-gray-900 whitespace-pre-wrap">{(pendaftarData.biodata as any).motivasi_pkl.motivasi || 'Tidak ada data'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Persyaratan Khusus - PKL */}
              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && (pendaftarData.biodata as any).persyaratan_khusus && (
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-teal-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Persyaratan Khusus</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Memiliki Laptop</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-teal-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).persyaratan_khusus.memiliki_laptop || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Memiliki Kamera DSLR</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-teal-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).persyaratan_khusus.memiliki_kamera_dslr || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Transportasi Operasional</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-teal-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).persyaratan_khusus.transportasi_operasional || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Apakah Merokok</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-teal-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).persyaratan_khusus.apakah_merokok || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Bersedia Ditempatkan</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-teal-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).persyaratan_khusus.bersedia_ditempatkan || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Bersedia Masuk 2x Seminggu</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-teal-200 text-sm sm:text-base text-gray-900">{(pendaftarData.biodata as any).persyaratan_khusus.bersedia_masuk_2_kali || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sertifikasi Kompetensi Card - matching client style */}
              {pendaftarData.jenis_pendaftaran === 'Sertifikasi Kompetensi' && pendaftarData.sertifikasi && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-purple-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Sertifikasi</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Sertifikasi</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.sertifikasi.namaSertifikasi}</p>
                    </div>
                    {pendaftarData.sertifikasi.batch && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Batch</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.sertifikasi.batch}</p>
                      </div>
                    )}
                    {pendaftarData.sertifikasi.jadwalSertifikasi && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jadwal Sertifikasi</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.sertifikasi.jadwalSertifikasi}</p>
                      </div>
                    )}
                    {pendaftarData.sertifikasi.assessor && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Assessor</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.sertifikasi.assessor}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PKL Info Card - matching client style */}
              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && pendaftarData.pkl_info && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-purple-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informasi PKL</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Posisi PKL</label>
                      <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.pkl_info.namaPosisi}</p>
                    </div>
                    {pendaftarData.pkl_info.perusahaan && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Perusahaan</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.pkl_info.perusahaan}</p>
                      </div>
                    )}
                    {pendaftarData.pkl_info.kategori && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">{pendaftarData.pkl_info.kategori}</p>
                      </div>
                    )}
                    {(pendaftarData.pkl_info.tanggal_mulai || pendaftarData.pkl_info.tanggal_selesai) && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Periode</label>
                        <p className="bg-white p-2.5 sm:p-3 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-900">
                          {pendaftarData.pkl_info.tanggal_mulai || '-'} s/d {pendaftarData.pkl_info.tanggal_selesai || '-'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Fixed Approval Section */}
          <div className="lg:w-[350px] xl:w-[380px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Approval Card - Pending Status */}
              {pendaftarData.status==='Pengajuan' && !showReject && (
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="text-base text-purple-900">Approval</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 mb-3">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Button 
                        onClick={approve} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Memproses...' : 'Setujui'}
                      </Button>
                      <Button 
                        onClick={rejectFlow} 
                        variant="destructive" 
                        className="w-full" 
                        disabled={isProcessing}
                      >
                        Tolak
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Card */}
              {showReject && (
                <Card className="border-2 border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-base text-red-900">Alasan Penolakan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                          {error}
                        </div>
                      )}
                      <textarea 
                        value={rejectionReason} 
                        onChange={e=>setRejectionReason(e.target.value)} 
                        placeholder="Masukkan alasan penolakan..." 
                        className="w-full min-h-[100px] max-h-[150px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={submitReject} 
                          variant="destructive" 
                          className="flex-1" 
                          disabled={!rejectionReason.trim() || isProcessing}
                        >
                          {isProcessing ? 'Memproses...' : 'Kirim'}
                        </Button>
                        <Button 
                          onClick={()=>{setShowReject(false); setError(null);}} 
                          variant="outline" 
                          className="flex-1" 
                          disabled={isProcessing}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejected Status with Notes */}
              {pendaftarData.status === 'Ditolak' && pendaftarData.catatan_admin && (
                <Card className="border-2 border-red-200">
                  <CardHeader className="bg-white">
                    <CardTitle className="text-base text-gray-900">Catatan Penolakan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{pendaftarData.catatan_admin}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Approved Status with Optional Notes */}
              {pendaftarData.status === 'Disetujui' && (
                <Card className="border-2 border-gray-200">
                  <CardHeader className="bg-white">
                    <CardTitle className="text-base text-gray-900">Status Pendaftaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Pendaftaran Disetujui</span>
                    </div>
                    {pendaftarData.catatan_admin && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{pendaftarData.catatan_admin}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
