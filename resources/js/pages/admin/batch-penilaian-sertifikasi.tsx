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
interface PendaftaranEntry { id:number; user?:{ name?:string; email?:string }; berkas_persyaratan?: Record<string,string> | string[] | null; penilaian?: PenilaianEntry | null }
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

const BatchPenilaianSertifikasiPage: React.FC = () => {
  const { props } = usePage<BatchPageProps>();
  const { batch } = props;
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [statusKelulusan, setStatusKelulusan] = React.useState<string>('Belum Dinilai');
  const [catatan, setCatatan] = React.useState<string>('');
  const selected = React.useMemo(()=> batch.pendaftaran.find(p=>p.id===selectedId), [selectedId, batch.pendaftaran]);

  const openPenilaian = (id:number) => {
    const row = batch.pendaftaran.find(p=>p.id===id);
    setSelectedId(id);
    setStatusKelulusan(row?.penilaian?.status_kelulusan || 'Belum Dinilai');
    setCatatan(row?.penilaian?.catatan_asesor || '');
    setOpenModal(true);
  };

  const savePenilaian = () => {
    if(!selected) return;
    
    router.post(route('admin.penilaian-sertifikasi.store', selected.id), {
      pendaftaran_id: selected.id,
      status_kelulusan: statusKelulusan,
      catatan_asesor: catatan
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setOpenModal(false);
        // Refresh current batch page to reflect updated status
        router.get(route('admin.batch-penilaian-sertifikasi', { sertifikasiId: props.sertifikasi_id, batchId: props.batch_id }), { preserveScroll: true, replace: true });
      },
      onError: (errors) => {
        console.error('Error saving penilaian:', errors);
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
                  const files = selected?.berkas_persyaratan;
                  if(!files || (Array.isArray(files) && files.length===0)) {
                    return <p className="text-xs text-muted-foreground">Tidak ada berkas</p>;
                  }

                  // Pastikan files adalah object
                  const berkas = Array.isArray(files) ? {} : files;
                  
                  return (
                    <div className="space-y-4">
                      {/* Judul Tugas - Wajib ditampilkan */}
                      {berkas.judul_tugas && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-2">Judul Tugas</span>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 font-medium">{berkas.judul_tugas}</p>
                          </div>
                        </div>
                      )}

                      {/* Link URL */}
                      {berkas.link_url && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-2">Link URL</span>
                          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                            <LinkIcon className="h-4 w-4 text-blue-600" />
                            <a 
                              href={berkas.link_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
                            >
                              {berkas.link_url}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* File Tugas */}
                      {berkas.file && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-2">File Tugas</span>
                          <div className="p-3 bg-gray-50 border rounded">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-gray-500" />
                                <div>
                                  <p className="font-medium">File Tugas</p>
                                  <p className="text-sm text-gray-500">{berkas.file.split('/').pop()}</p>
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.open(`/storage/${berkas.file}`, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Lihat
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Kondisi 1: Belum Dinilai - Tampilkan form penilaian */}
              {(!selected.penilaian || !selected.penilaian.status_kelulusan) && (
                <>
                  <div className="space-y-2">
                    <Label>Penentuan Kelulusan</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant={statusKelulusan==='Diterima' ? 'default':'outline'} onClick={()=>setStatusKelulusan('Diterima')}>Terima</Button>
                      <Button size="sm" variant={statusKelulusan==='Ditolak' ? 'destructive':'outline'} onClick={()=>setStatusKelulusan('Ditolak')}>Tolak</Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Catatan Asesor</Label>
                    <Textarea rows={4} value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="Tambahkan catatan untuk peserta" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Status saat ini: <span className="font-medium text-orange-600">Belum Dinilai</span></div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={()=>setOpenModal(false)}>Batal</Button>
                      <Button size="sm" disabled={!['Diterima','Ditolak'].includes(statusKelulusan)} onClick={savePenilaian}>Simpan Penilaian</Button>
                    </div>
                  </div>
                </>
              )}

              {/* Kondisi 2: Diterima - Tampilkan hasil penilaian dengan badge hijau */}
              {selected.penilaian?.status_kelulusan === 'Diterima' && (
                <>
                  <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <Label className="text-green-700 font-medium">Status Kelulusan</Label>
                    </div>
                    <div className="text-green-600 font-semibold">✓ DITERIMA</div>
                    {selected.penilaian.catatan_asesor && (
                      <div className="space-y-1">
                        <Label className="text-green-700">Catatan Asesor</Label>
                        <p className="text-sm text-green-600 bg-white p-3 rounded border border-green-200">{selected.penilaian.catatan_asesor}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Status: <span className="font-medium text-green-600">Sudah Dinilai</span></div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={()=>setOpenModal(false)}>Tutup</Button>
                      <Button size="sm" variant="default" onClick={() => {
                        setStatusKelulusan('Belum Dinilai');
                        setCatatan(selected.penilaian?.catatan_asesor || '');
                      }}>Edit Penilaian</Button>
                    </div>
                  </div>
                </>
              )}

              {/* Kondisi 3: Ditolak - Tampilkan hasil penilaian dengan badge merah */}
              {selected.penilaian?.status_kelulusan === 'Ditolak' && (
                <>
                  <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <Label className="text-red-700 font-medium">Status Kelulusan</Label>
                    </div>
                    <div className="text-red-600 font-semibold">✗ DITOLAK</div>
                    {selected.penilaian.catatan_asesor && (
                      <div className="space-y-1">
                        <Label className="text-red-700">Catatan Asesor</Label>
                        <p className="text-sm text-red-600 bg-white p-3 rounded border border-red-200">{selected.penilaian.catatan_asesor}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Status: <span className="font-medium text-red-600">Sudah Dinilai</span></div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={()=>setOpenModal(false)}>Tutup</Button>
                      <Button size="sm" variant="destructive" onClick={() => {
                        setStatusKelulusan('Belum Dinilai');
                        setCatatan(selected.penilaian?.catatan_asesor || '');
                      }}>Edit Penilaian</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default BatchPenilaianSertifikasiPage;
