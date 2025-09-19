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
  
  // Debug log to see what data we're receiving
  React.useEffect(() => {
    if (isOpen && pendaftarData) {
      console.log('DetailPendaftaranModal data:', pendaftarData);
      console.log('Biodata:', pendaftarData.biodata);
      console.log('Sertifikasi:', pendaftarData.sertifikasi);
      console.log('PKL Info:', pendaftarData.pkl_info);
    }
  }, [isOpen, pendaftarData]);
  
  const approve = async () => { 
    setIsProcessing(true);
    setError(null);
    try {
      await onApproval('Disetujui'); 
      onClose(); 
    } catch (err) {
      setError('Gagal menyetujui pendaftaran. Silakan coba lagi.');
      console.error('Approve error:', err);
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
      console.error('Reject error:', err);
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
      <DialogContent className="w-auto h-auto !max-w-[95vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detail Pendaftaran - {pendaftarData.full_name || pendaftarData.nama}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {pendaftarData.jenis_pendaftaran}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="space-y-6">
              <Card className="min-w-[420px]">
                <CardHeader><CardTitle>Biodata Diri</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Nama Peserta</div>
                    <p className="text-sm font-medium">{pendaftarData.biodata.full_name || pendaftarData.biodata.nama}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                    <p className="text-sm font-medium">{pendaftarData.biodata.email || '-'}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">No. Telepon</div>
                    <p className="text-sm font-medium">{pendaftarData.biodata.phone || pendaftarData.biodata.noTelepon || '-'}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Tempat/Tanggal Lahir</div>
                    <p className="text-sm font-medium">
                      {pendaftarData.biodata.birth_place && pendaftarData.biodata.birth_date 
                        ? `${pendaftarData.biodata.birth_place}, ${pendaftarData.biodata.birth_date}`
                        : pendaftarData.biodata.tempatTanggalLahir || '-'
                      }
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Alamat</div>
                    <p className="text-sm font-medium">{pendaftarData.biodata.address || pendaftarData.biodata.alamat || '-'}</p>
                  </div>

                  {/* Berkas Persyaratan - Khusus untuk PKL */}
                  {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && pendaftarData.biodata.berkas_persyaratan && (
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-muted-foreground mb-3">Berkas Persyaratan</div>
                      <div className="space-y-3">
                        {(() => {
                          const berkas = pendaftarData.biodata.berkas_persyaratan;
                          
                          return (
                            <>
                              {/* CV */}
                              {berkas.cv && (
                                <div>
                                  <span className="block text-xs font-medium text-gray-700 mb-1">CV</span>
                                  <div className="p-2 bg-gray-50 border rounded">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-6 w-6 text-gray-500" />
                                        <div>
                                          <p className="text-xs font-medium">CV</p>
                                          <p className="text-xs text-gray-500">{berkas.cv.split('/').pop()}</p>
                                        </div>
                                      </div>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-6 px-2 text-xs"
                                        onClick={() => window.open(`/storage/${berkas.cv}`, '_blank')}
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Lihat
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Portfolio */}
                              {berkas.portfolio && (
                                <div>
                                  <span className="block text-xs font-medium text-gray-700 mb-1">Portfolio</span>
                                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                    <LinkIcon className="h-3 w-3 text-blue-600" />
                                    <a 
                                      href={berkas.portfolio} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline break-all flex-1 text-xs"
                                    >
                                      {berkas.portfolio}
                                    </a>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Program-specific Information */}
              {pendaftarData.jenis_pendaftaran === 'Sertifikasi Kompetensi' && pendaftarData.sertifikasi && (
                <Card className="min-w-[420px]">
                  <CardHeader><CardTitle>Sertifikasi Kompetensi</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Nama Sertifikasi</div>
                      <p className="text-sm font-medium">{pendaftarData.sertifikasi.namaSertifikasi}</p>
                    </div>
                    
                    {pendaftarData.sertifikasi.batch && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Batch</div>
                        <p className="text-sm font-medium">{pendaftarData.sertifikasi.batch}</p>
                      </div>
                    )}

                    {pendaftarData.sertifikasi.jadwalSertifikasi && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Jadwal Sertifikasi</div>
                        <p className="text-sm font-medium">{pendaftarData.sertifikasi.jadwalSertifikasi}</p>
                      </div>
                    )}

                    {pendaftarData.sertifikasi.assessor && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Assessor</div>
                        <p className="text-sm font-medium">{pendaftarData.sertifikasi.assessor}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {pendaftarData.jenis_pendaftaran === 'Praktik Kerja Lapangan' && pendaftarData.pkl_info && (
                <Card className="min-w-[420px]">
                  <CardHeader><CardTitle>Praktik Kerja Lapangan</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Posisi PKL</div>
                      <p className="text-sm font-medium">{pendaftarData.pkl_info.namaPosisi}</p>
                    </div>
                    
                    {pendaftarData.pkl_info.perusahaan && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Perusahaan</div>
                        <p className="text-sm font-medium">{pendaftarData.pkl_info.perusahaan}</p>
                      </div>
                    )}

                    {pendaftarData.pkl_info.kategori && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Kategori</div>
                        <p className="text-sm font-medium">{pendaftarData.pkl_info.kategori}</p>
                      </div>
                    )}

                    {(pendaftarData.pkl_info.tanggal_mulai || pendaftarData.pkl_info.tanggal_selesai) && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Periode</div>
                        <p className="text-sm font-medium">
                          {pendaftarData.pkl_info.tanggal_mulai || '-'} s/d {pendaftarData.pkl_info.tanggal_selesai || '-'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 space-y-4">
            {pendaftarData.status==='Pengajuan' && !showReject && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base">Approval</CardTitle></CardHeader>
                <CardContent>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 mb-3">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={approve} className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                      {isProcessing ? 'Memproses...' : 'Setujui'}
                    </Button>
                    <Button onClick={rejectFlow} variant="destructive" className="w-full" disabled={isProcessing}>
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {showReject && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base">Alasan Penolakan</CardTitle></CardHeader>
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
                      className="w-full min-h-[100px] max-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                    <div className="flex gap-2">
                      <Button onClick={submitReject} variant="destructive" className="flex-1" disabled={!rejectionReason.trim() || isProcessing}>
                        {isProcessing ? 'Memproses...' : 'Kirim'}
                      </Button>
                      <Button onClick={()=>{setShowReject(false); setError(null);}} variant="outline" className="flex-1" disabled={isProcessing}>
                        Batal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {pendaftarData.status === 'Ditolak' && pendaftarData.catatan_admin && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base text-red-600">Alasan Penolakan</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 bg-red-50 p-3 rounded-md border border-red-200 max-h-32 overflow-y-auto">
                    {pendaftarData.catatan_admin}
                  </div>
                </CardContent>
              </Card>
            )}
            {pendaftarData.status === 'Disetujui' && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base text-green-600">Status Pendaftaran</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Pendaftaran Disetujui</span>
                  </div>
                  {pendaftarData.catatan_admin && (
                    <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-md border border-green-200 mt-3 max-h-32 overflow-y-auto">
                      {pendaftarData.catatan_admin}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
