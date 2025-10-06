import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Link as LinkIcon, Globe, File as FileIcon, FileText, FileArchive, FileImage, FileVideo, FileAudio, FileCode, FileSpreadsheet, Download } from 'lucide-react';

interface PenilaianEntry { id:number; status_kelulusan?:string | null; catatan_asesor?:string | null }
interface SertifikatEntry { 
  id: number; 
  link_sertifikat: string; 
  tanggal_selesai: string; 
  catatan_admin?: string | null;
}
interface PendaftaranEntry { 
  id:number; 
  user?:{ name?:string; email?:string }; 
  berkas_persyaratan?: Record<string,string> | string[] | null; 
  penilaian?: PenilaianEntry | null;
  sertifikat?: SertifikatEntry | null;
  upload_tugas?: Array<{
    id: number;
    judul_tugas: string;
    link_url?: string;
    nama_file?: string;
    path_file?: string;
    download_url?: string;
    status: string;
    tanggal_upload: string;
    feedback?: string;
    dinilai_oleh?: string;
  }>;
}
interface BatchPageProps {
  batch: {
    id:number;
    nama_batch?:string | null;
    tanggal_mulai?:string | null;
    tanggal_selesai?:string | null;
    sertifikasi?: { id:number; nama_sertifikasi?:string | null };
    pendaftaran: PendaftaranEntry[];
  };
  sertifikasi_id:number;
  batch_id:number;
  [key:string]:unknown;
}

const StatusBadge: React.FC<{ status?: string | null }> = ({ status }) => {
  let className = '';
  if (status === 'Diterima' || status === 'Lulus') {
    className = 'bg-purple-100 text-purple-800 border-purple-200';
  } else if (status === 'Ditolak') {
    className = 'bg-orange-100 text-orange-800 border-orange-200';
  } else {
    className = 'bg-gray-100 text-gray-800 border-gray-200';
  }
  return <Badge className={className}>{status || 'Belum Dinilai'}</Badge>;
};

interface TugasAssessmentCardProps {
  upload: {
    id: number;
    judul_tugas: string;
    link_url?: string;
    nama_file?: string;
    path_file?: string;
    download_url?: string;
    status: string;
    tanggal_upload: string;
    feedback?: string;
    dinilai_oleh?: string;
  };
}

const TugasAssessmentCard: React.FC<TugasAssessmentCardProps> = ({ upload }) => {
  const [status, setStatus] = React.useState(upload.status);
  const [feedback, setFeedback] = React.useState(upload.feedback || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSaveAssessment = () => {
    setIsSubmitting(true);
    router.post(route('admin.update-tugas-status', upload.id), {
      status,
      feedback
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        // Optionally show success message
      },
      onError: (errors) => {
        setIsSubmitting(false);
        }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 border-green-200 text-green-800';
      case 'rejected': return 'bg-red-100 border-red-200 text-red-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '✓ Disetujui';
      case 'rejected': return '✗ Ditolak';
      default: return 'Belum Dinilai';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Judul Tugas */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Judul Tugas</span>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-900 font-medium">{upload.judul_tugas}</p>
        </div>
      </div>
      
      {/* Upload Date and Current Status */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Tanggal Upload: {new Date(upload.tanggal_upload).toLocaleDateString('id-ID')}
        </span>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
          {getStatusText(upload.status)}
        </div>
      </div>

      {/* Link URL */}
      {upload.link_url && (
        <div>
          <span className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Link URL</span>
          <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <a 
              href={upload.link_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 underline break-all flex-1 font-medium"
            >
              {upload.link_url}
            </a>
          </div>
        </div>
      )}

      {/* File Tugas */}
      {upload.nama_file && (
        <div>
          <span className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">File Tugas</span>
          <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-orange-200 flex items-center space-x-3 hover:shadow-md transition-shadow">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm text-gray-900 flex-1 truncate font-medium">{upload.nama_file}</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs bg-purple-600 text-white hover:bg-purple-700 border-0 flex-shrink-0"
              onClick={() => {
                if (upload.download_url) {
                  window.location.href = upload.download_url;
                }
              }}
              disabled={!upload.download_url}
            >
              <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )}

      {/* Assessment Form */}
      <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
        <h4 className="font-medium text-gray-900">Penilaian Tugas</h4>
        
        {/* Status Selection */}
        <div className="space-y-2">
          <Label>Status Penilaian</Label>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              className={status === 'approved' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border border-purple-600 text-purple-600 hover:bg-purple-50'}
              onClick={() => setStatus('approved')}
            >
              Setujui
            </Button>
            <Button 
              size="sm" 
              style={status === 'rejected' 
                ? { backgroundColor: '#ea580c', color: 'white', border: 'none' } 
                : { backgroundColor: 'white', color: '#ea580c', border: '1px solid #ea580c' }
              }
              className={status === 'rejected' ? 'hover:opacity-90 transition-opacity' : 'hover:bg-orange-50 transition-colors'}
              onClick={() => setStatus('rejected')}
            >
              Tolak
            </Button>
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-1">
          <Label>Feedback untuk Klien</Label>
          <Textarea 
            rows={3} 
            value={feedback} 
            onChange={e => setFeedback(e.target.value)} 
            placeholder="Berikan feedback yang akan dilihat klien..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            size="sm" 
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleSaveAssessment}
            disabled={isSubmitting || status === upload.status && feedback === (upload.feedback || '')}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Penilaian'}
          </Button>
        </div>
      </div>

      {/* Admin Feedback (if exists) */}
      {upload.feedback && (
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Feedback Admin Sebelumnya</span>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">{upload.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const BatchPenilaianSertifikasiPage: React.FC = () => {
  const { props } = usePage<BatchPageProps>();
  const { batch } = props;
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const selected = React.useMemo(()=> batch.pendaftaran.find(p=>p.id===selectedId), [selectedId, batch.pendaftaran]);
  
  // Debug: Log all status values
  React.useEffect(() => {
    batch.pendaftaran.forEach((p, idx) => {
      const hasUploadedTugas = p.upload_tugas && p.upload_tugas.length > 0;
      const allTugasApproved = hasUploadedTugas && 
        p.upload_tugas!.every(t => t.status === 'approved');
      const isPassed = p.penilaian?.status_kelulusan === 'Diterima' || 
                       p.penilaian?.status_kelulusan === 'Lulus';
      
      });
  }, [batch.pendaftaran]);
  
  // Certificate modal state
  const [openCertModal, setOpenCertModal] = React.useState(false);
  const [certPendaftaranId, setCertPendaftaranId] = React.useState<number | null>(null);
  const [certLink, setCertLink] = React.useState('');
  const [certDate, setCertDate] = React.useState('');
  const [certNote, setCertNote] = React.useState('');
  const [isSubmittingCert, setIsSubmittingCert] = React.useState(false);

  const openPenilaian = (id:number) => {
    const row = batch.pendaftaran.find(p=>p.id===id);
    // Debug log
    // Debug log
    setSelectedId(id);
    setOpenModal(true);
  };
  
  const openCertificateModal = (pendaftaranId: number) => {
    setCertPendaftaranId(pendaftaranId);
    setCertLink('');
    setCertDate(new Date().toISOString().split('T')[0]);
    setCertNote('');
    setOpenCertModal(true);
  };
  
  const handleSubmitCertificate = () => {
    if (!certPendaftaranId || !certLink || !certDate) {
      alert('Link sertifikat dan tanggal selesai harus diisi');
      return;
    }
    
    setIsSubmittingCert(true);
    router.post(`/admin/sertifikat-kelulusan/${certPendaftaranId}`, {
      link_sertifikat: certLink,
      tanggal_selesai: certDate,
      catatan_admin: certNote,
    }, {
      preserveScroll: true,
      onSuccess: (page) => {
        // Close modal
        setOpenCertModal(false);
        
        // Reset form
        setCertLink('');
        setCertDate('');
        setCertNote('');
        setCertPendaftaranId(null);
        setIsSubmittingCert(false);
        
        // Show success message
        const flash = page.props?.flash as { success?: string; error?: string } | undefined;
        if (flash?.success) {
          alert(flash.success);
        }
      },
      onError: (errors) => {
        setIsSubmittingCert(false);
        
        // Show error message
        const errorMsg = typeof errors === 'object' && errors 
          ? Object.values(errors).flat().join(', ')
          : 'Gagal menerbitkan sertifikat';
        alert(errorMsg);
      },
      onFinish: () => {
        setIsSubmittingCert(false);
      }
    });
  };
  const breadcrumbs: BreadcrumbItem[] = [
    { title:'Dashboard', href:'/admin/dashboard' },
    { title:'Penilaian', href:'#' },
    { title:'Sertifikasi', href:'/admin/penilaian-sertifikasi' },
    { title: batch.sertifikasi?.nama_sertifikasi || 'Batch', href:'#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Penilaian Batch - ${batch.sertifikasi?.nama_sertifikasi || ''}`} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="ghost" size="sm" onClick={()=>router.get('/admin/penilaian-sertifikasi')}> <ArrowLeft className="h-4 w-4 mr-1" /></Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Penilaian Batch Sertifikasi</h1>
            <p className="text-muted-foreground">Daftar peserta batch untuk dinilai</p>
          </div>
        </div>

        {/* Info Batch (pindah ke atas sendiri) */}
        <Card className="">
          <CardHeader>
            <CardTitle>Info Batch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:flex md:items-start md:gap-10 md:space-y-0">
            <div>
              <span className="text-muted-foreground">Sertifikasi</span>
              <div className="font-medium">{batch.sertifikasi?.nama_sertifikasi || '-'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Nama Batch</span>
              <div className="font-medium">{batch.nama_batch || `Batch ${batch.id}`}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Tanggal</span>
              <div className="font-medium">{batch.tanggal_mulai && batch.tanggal_selesai ? `${batch.tanggal_mulai} s/d ${batch.tanggal_selesai}` : '-'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Jumlah Peserta</span>
              <div className="font-medium">{batch.pendaftaran.length}</div>
            </div>
          </CardContent>
        </Card>

        {/* Peserta Batch (full width) */}
        <Card className="">
          <CardHeader>
            <CardTitle>Peserta Batch ({batch.nama_batch || `Batch ${batch.id}`})</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Peserta</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status Penilaian</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batch.pendaftaran.length ? batch.pendaftaran.map((p, idx)=>(
                    <TableRow key={p.id}>
                      <TableCell>{idx+1}</TableCell>
                      <TableCell className="font-medium">{p.user?.name || '-'}</TableCell>
                      <TableCell>{p.user?.email || '-'}</TableCell>
                      <TableCell>
                          <StatusBadge status={p.penilaian?.status_kelulusan} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={()=>openPenilaian(p.id)}>Nilai</Button>
                          {(() => {
                            // If certificate already issued, show "Lihat Sertifikat" button
                            if (p.sertifikat) {
                              return (
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => window.open(p.sertifikat!.link_sertifikat, '_blank')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Lihat Sertifikat
                                </Button>
                              );
                            }
                            
                            // Show "Terbitkan Sertifikat" if penilaian status is Diterima/Lulus
                            const isPassed = p.penilaian?.status_kelulusan === 'Diterima' || 
                                           p.penilaian?.status_kelulusan === 'diterima' ||
                                           p.penilaian?.status_kelulusan === 'Lulus' ||
                                           p.penilaian?.status_kelulusan === 'lulus';
                            
                            // OR show button if all tugas are approved
                            const hasUploadedTugas = p.upload_tugas && p.upload_tugas.length > 0;
                            const allTugasApproved = hasUploadedTugas && 
                              p.upload_tugas!.every(t => t.status === 'approved');
                            
                            if (isPassed || allTugasApproved) {
                              return (
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={()=>openCertificateModal(p.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Terbitkan Sertifikat
                                </Button>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada peserta</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
      </CardContent>
    </Card>
      </div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" hideClose>
          <DialogHeader className="bg-purple-600 text-white -mt-6 -mx-6 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-white text-lg font-semibold">Penilaian Peserta</DialogTitle>
                <DialogDescription className="text-purple-100 text-sm">
                  {selected ? selected.user?.name : ''}
                </DialogDescription>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 text-sm mt-4">
              {/* Berkas Persyaratan - Format sesuai dengan PKL Modal */}
              <div className="space-y-4">
                <Label>Berkas / Link Peserta</Label>
                
                {(() => {
                  const uploads = selected?.upload_tugas;
                  if(!uploads || uploads.length === 0) {
                    return <p className="text-xs text-muted-foreground">Tidak ada berkas</p>;
                  }

                  return (
                    <div className="space-y-4">
                      {uploads.map((upload, index) => (
                        <TugasAssessmentCard key={upload.id} upload={upload} />
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Informational note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Penilaian Per Tugas</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Berikan penilaian untuk setiap tugas yang diupload peserta. Status akan otomatis terupdate di halaman peserta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpenModal(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Modal */}
      <Dialog open={openCertModal} onOpenChange={setOpenCertModal}>
        <DialogContent className="sm:max-w-lg" hideClose>
          <DialogHeader className="bg-purple-600 text-white -mt-6 -mx-6 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-white text-lg font-semibold">Terbitkan Sertifikat Kelulusan</DialogTitle>
                <DialogDescription className="text-purple-100 text-sm">
                  Masukkan link sertifikat digital untuk peserta yang telah lulus
                </DialogDescription>
              </div>
              <button
                onClick={() => setOpenCertModal(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-400 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4 mt-4">
            {/* Important Reminder */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">⚠️ Penting!</h4>
                  <p className="text-sm text-amber-700">
                    Pastikan file sertifikat sudah di-<strong>share secara PUBLIC</strong> agar dapat diakses oleh peserta. 
                    <br />
                    <span className="text-xs">
                      (Google Drive: Klik kanan → Bagikan → Ubah ke "Siapa saja yang memiliki link")
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-link">Link Sertifikat *</Label>
              <input
                id="cert-link"
                type="url"
                value={certLink}
                onChange={(e) => setCertLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500">
                Masukkan link Google Drive, Dropbox, atau platform lainnya
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-date">Tanggal Selesai *</Label>
              <input
                id="cert-date"
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-note">Catatan Admin (Opsional)</Label>
              <Textarea
                id="cert-note"
                value={certNote}
                onChange={(e) => setCertNote(e.target.value)}
                rows={3}
                placeholder="Catatan tambahan untuk peserta..."
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenCertModal(false)}
              disabled={isSubmittingCert}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitCertificate}
              disabled={isSubmittingCert || !certLink || !certDate}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmittingCert ? 'Menerbitkan...' : 'Terbitkan Sertifikat'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default BatchPenilaianSertifikasiPage;
