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
interface PendaftaranEntry { 
  id:number; 
  user?:{ name?:string; email?:string }; 
  berkas_persyaratan?: Record<string,string> | string[] | null; 
  penilaian?: PenilaianEntry | null;
  upload_tugas?: Array<{
    id: number;
    judul_tugas: string;
    link_url?: string;
    nama_file?: string;
    path_file?: string;
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
  let variant: any = 'outline';
  if (status === 'Diterima') variant = 'default';
  else if (status === 'Ditolak') variant = 'destructive';
  return <Badge variant={variant}>{status || 'Belum Dinilai'}</Badge>;
};

interface TugasAssessmentCardProps {
  upload: {
    id: number;
    judul_tugas: string;
    link_url?: string;
    nama_file?: string;
    path_file?: string;
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
        console.error('Error saving assessment:', errors);
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
          <span className="block text-sm font-medium text-gray-700 mb-2">Link URL</span>
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
            <LinkIcon className="h-4 w-4 text-blue-600" />
            <a 
              href={upload.link_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
            >
              {upload.link_url}
            </a>
          </div>
        </div>
      )}

      {/* File Tugas */}
      {upload.nama_file && (
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">File Tugas</span>
          <div className="p-3 bg-gray-50 border rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-gray-500" />
                <div>
                  <p className="font-medium">{upload.nama_file}</p>
                  <p className="text-sm text-gray-500">Tugas Sertifikasi</p>
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/storage/${upload.path_file}`, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
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
              variant={status === 'approved' ? 'default' : 'outline'} 
              onClick={() => setStatus('approved')}
            >
              Setujui
            </Button>
            <Button 
              size="sm" 
              variant={status === 'rejected' ? 'destructive' : 'outline'} 
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

  const openPenilaian = (id:number) => {
    const row = batch.pendaftaran.find(p=>p.id===id);
    console.log('Selected pendaftaran data:', row); // Debug log
    console.log('Upload tugas data:', row?.upload_tugas); // Debug log
    setSelectedId(id);
    setOpenModal(true);
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
                        <Button size="sm" variant="outline" onClick={()=>openPenilaian(p.id)}>Nilai</Button>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Penilaian Peserta</DialogTitle>
            <DialogDescription>
              {selected ? selected.user?.name : ''}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 text-sm">
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
    </AppLayout>
  );
};

export default BatchPenilaianSertifikasiPage;
