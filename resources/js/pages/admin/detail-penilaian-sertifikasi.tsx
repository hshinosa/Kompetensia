import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Award, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
interface PenilaianDetailPageProps {
  pendaftaran: {
    id:number;
    user:{ id:number; name:string; email:string; phone?:string };
    sertifikasi:{ id:number; nama_sertifikasi:string; jenis_sertifikasi:string; nama_asesor?:string; };
    batch?: { id:number; nama_batch?:string; tanggal_mulai?:string; tanggal_selesai?:string } | null;
    status:string;
    tanggal_pendaftaran:string;
    motivasi?:string | null;
    penilaian?: { id:number; status_kelulusan:string; catatan_asesor?:string | null; tanggal_penilaian?:string|null } | null;
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
  };
  [key:string]: any;
}

export default function DetailPenilaianSertifikasi() {
  const { props } = usePage<{ pendaftaran: PenilaianDetailPageProps['pendaftaran']; [key:string]: any }>();
  const { pendaftaran } = props;
  // Only acceptance/rejection now; components granular removed (future advanced rubric omitted)
  const currentStatus = pendaftaran.penilaian?.status_kelulusan ?? 'Belum Dinilai';
  const [statusKelulusan, setStatusKelulusan] = useState<string>(currentStatus);
  const [catatan, setCatatan] = useState<string>(pendaftaran.penilaian?.catatan_asesor || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const statusBadgeVariant = () => {
    if(currentStatus==='Diterima') return 'default';
    if(currentStatus==='Ditolak') return 'destructive';
    return 'outline';
  };
  const tempBadgeVariant = () => {
    if(statusKelulusan==='Diterima') return 'default';
    if(statusKelulusan==='Ditolak') return 'destructive';
    return 'outline';
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title:'Dashboard', href:'/admin/dashboard' },
    { title:'Penilaian', href:'#' },
    { title:'Sertifikasi', href:'/admin/penilaian-sertifikasi' },
    { title: pendaftaran.user.name, href:'#' }
  ];

  const saveStatus = () => {
  router.post(route('admin.penilaian-sertifikasi.store', pendaftaran.id), {
      pendaftaran_id: pendaftaran.id,
      status_kelulusan: statusKelulusan,
      catatan_asesor: catatan
    }, { preserveScroll: true, onSuccess: ()=> setShowConfirm(false) });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
  <Head title={`Detail Penilaian - ${pendaftaran.user.name}`} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm"><Link href="/admin/penilaian-sertifikasi" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />Kembali</Link></Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Penilaian Sertifikasi</h1>
            <p className="text-muted-foreground">Kelola penilaian dan evaluasi peserta sertifikasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Informasi Peserta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><Label className="text-muted-foreground">Nama</Label><p className="font-medium">{pendaftaran.user.name}</p></div>
                <div><Label className="text-muted-foreground">Email</Label><p className="font-medium">{pendaftaran.user.email}</p></div>
                <div><Label className="text-muted-foreground">Status Pendaftaran</Label><p className="font-medium">{pendaftaran.status}</p></div>
                <div><Label className="text-muted-foreground">Tanggal Daftar</Label><p className="font-medium">{pendaftaran.tanggal_pendaftaran}</p></div>
                <div><Label className="text-muted-foreground">Batch</Label><p className="font-medium">{pendaftaran.batch?.nama_batch || '—'}</p></div>
                <div><Label className="text-muted-foreground">Motivasi</Label><p className="font-medium line-clamp-3">{pendaftaran.motivasi || '-'}</p></div>
              </div>
              {/* Additional biodata fields can be loaded once available */}
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Informasi Sertifikasi</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><Label className="text-muted-foreground">Nama Sertifikasi</Label><p className="font-medium">{pendaftaran.sertifikasi.nama_sertifikasi}</p></div>
                <div><Label className="text-muted-foreground">Jenis Sertifikasi</Label><Badge variant={pendaftaran.sertifikasi.jenis_sertifikasi==='BNSP' ? 'default':'secondary'}>{pendaftaran.sertifikasi.jenis_sertifikasi}</Badge></div>
                <div><Label className="text-muted-foreground">Nama Asesor</Label><p className="font-medium">{pendaftaran.sertifikasi.nama_asesor || '-'}</p></div>
                <div><Label className="text-muted-foreground">Tanggal Batch</Label><p className="font-medium">{pendaftaran.batch ? `${pendaftaran.batch.tanggal_mulai} s/d ${pendaftaran.batch.tanggal_selesai}` : '-'}</p></div>
                <div><Label className="text-muted-foreground">Status Penilaian</Label><Badge variant={statusBadgeVariant() as any}>{currentStatus}</Badge></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Ringkasan Nilai</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex gap-2">
                  <Button variant={statusKelulusan==='Diterima' ? 'default':'outline'} size="sm" onClick={()=> setStatusKelulusan('Diterima')}>Terima</Button>
                  <Button variant={statusKelulusan==='Ditolak' ? 'destructive':'outline'} size="sm" onClick={()=> setStatusKelulusan('Ditolak')}>Tolak</Button>
                  <Button variant="secondary" size="sm" onClick={()=> { setStatusKelulusan('Belum Dinilai'); }}>Reset</Button>
                </div>
                <div className="space-y-1">
                  <Label>Catatan Asesor</Label>
                  <Textarea rows={4} value={catatan} onChange={e=> setCatatan(e.target.value)} placeholder="Tambahkan catatan (opsional)" />
                </div>
                <div className="flex justify-end">
                  <Button disabled={statusKelulusan===currentStatus && catatan=== (pendaftaran.penilaian?.catatan_asesor||'')} onClick={()=> setShowConfirm(true)}>Simpan Penilaian</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Uploaded Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dokumen yang Diunggah ({pendaftaran.upload_tugas?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendaftaran.upload_tugas && pendaftaran.upload_tugas.length > 0 ? (
              <div className="space-y-4">
                {pendaftaran.upload_tugas.map((upload, index) => (
                  <div key={upload.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">{upload.judul_tugas}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Tanggal Upload: {new Date(upload.tanggal_upload).toLocaleDateString('id-ID')}</span>
                          <Badge variant={upload.status === 'approved' ? 'default' : upload.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {upload.status === 'approved' ? 'Disetujui' : upload.status === 'rejected' ? 'Ditolak' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upload.link_url && (
                        <div>
                          <Label className="text-muted-foreground">Link URL</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <a 
                              href={upload.link_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                            >
                              {upload.link_url}
                            </a>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(upload.link_url, '_blank')}
                            >
                              Buka
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {upload.nama_file && (
                        <div>
                          <Label className="text-muted-foreground">File</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-900">{upload.nama_file}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Handle file download using proper route
                                window.location.href = `/admin/upload-tugas/${upload.id}/download`;
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {upload.feedback && (
                      <div>
                        <Label className="text-muted-foreground">Feedback</Label>
                        <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{upload.feedback}</p>
                        {upload.dinilai_oleh && (
                          <p className="text-xs text-gray-500 mt-1">Dinilai oleh: {upload.dinilai_oleh}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada dokumen yang diunggah</h3>
                <p className="text-gray-600">Peserta belum mengunggah tugas untuk sertifikasi ini</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Penilaian</DialogTitle>
              <DialogDescription>Simpan status kelulusan peserta ini?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={tempBadgeVariant() as any}>{statusKelulusan}</Badge>
              </div>
              {catatan && <div className="text-xs bg-muted p-2 rounded">Catatan: {catatan}</div>}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={()=> setShowConfirm(false)}>Batal</Button>
                <Button onClick={saveStatus}>Simpan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
