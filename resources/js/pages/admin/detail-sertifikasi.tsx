import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Calendar, Clock, FileText, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';
import React from 'react';

interface Modul { id:number; judul:string; deskripsi?:string; poin_pembelajaran?:string[] }
interface Batch { id:number; nama_batch:string; tanggal_mulai:string; tanggal_selesai:string; status:string; jumlah_pendaftar?:number }
interface SertifikasiDetail { id:number; nama_sertifikasi:string; jenis_sertifikasi?:string; deskripsi?:string; modul:Modul[]; batch:Batch[]; nama_asesor?:string; jabatan_asesor?:string; instansi_asesor?:string; status?:string; created_at?:string; updated_at?:string }
interface PageProps extends Record<string, unknown> { sertifikasi: SertifikasiDetail }

export default function DetailSertifikasi(){
  const { props } = usePage<PageProps>();
  const s = props.sertifikasi;
  const breadcrumbs: BreadcrumbItem[] = [
    { title:'Dashboard', href:'/admin/dashboard' },
    { title:'Sertifikasi Kompetensi', href:'/admin/sertifikasi-kompetensi' },
    { title: s?.nama_sertifikasi || 'Detail', href:'#' }
  ];
  const [expandedModul, setExpandedModul] = React.useState<number[]>([]);
  const toggleModul = (id:number)=> setExpandedModul(prev => prev.includes(id)? prev.filter(i=>i!==id): [...prev,id]);
  const totalPeserta = s.batch.reduce((sum,b)=> sum + (b.jumlah_pendaftar||0),0);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={s?.nama_sertifikasi || 'Detail Sertifikasi'} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm"><Link href="/admin/sertifikasi-kompetensi"><ArrowLeft className="h-4 w-4" /></Link></Button>
            <div>
              <h1 className="text-2xl font-semibold">{s.nama_sertifikasi}</h1>
              <p className="text-muted-foreground">Detail program sertifikasi kompetensi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="flex items-center gap-2">
              <Link href={`/admin/sertifikasi/${s.id}/edit`}><Edit className="h-4 w-4" />Edit Sertifikasi</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informasi Umum</CardTitle>
                  {s.jenis_sertifikasi && <Badge variant={s.jenis_sertifikasi==='BNSP'?'default':'secondary'}>{s.jenis_sertifikasi}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Jumlah Batch</p>
                      <p className="font-medium">{s.batch.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Peserta Terdaftar</p>
                      <p className="font-medium">{totalPeserta}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3"><FileText className="h-5 w-5 text-muted-foreground" /><h4 className="font-semibold">Deskripsi Program</h4></div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.deskripsi}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-muted-foreground" /><CardTitle>Modul & Poin Pembelajaran</CardTitle></div></CardHeader>
              <CardContent className="space-y-3">
                {s.modul.map(m => {
                  const expanded = expandedModul.includes(m.id);
                  return (
                    <div key={m.id} className="border rounded-lg overflow-hidden">
                      <button type="button" className="w-full flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left" onClick={()=>toggleModul(m.id)}>
                        <div className="flex-1">
                          <h4 className="font-medium">{m.judul}</h4>
                          {m.deskripsi && <p className="text-sm text-muted-foreground mt-1">{m.deskripsi}</p>}
                        </div>
                        {expanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      {expanded && m.poin_pembelajaran && m.poin_pembelajaran.length>0 && (
                        <div className="p-4 pt-0">
                          <div className="bg-white rounded-lg p-4 border-l-4 border-primary/20">
                            <h5 className="font-medium text-sm mb-3 text-primary">Poin Pembelajaran:</h5>
                            <ul className="space-y-2 list-disc pl-4">
                              {m.poin_pembelajaran.map(p => (<li key={p} className="text-sm text-muted-foreground">{p}</li>))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Status Program</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Status</span><Badge variant={s.status==='Aktif'?'default':'secondary'}>{s.status || 'N/A'}</Badge></div>
                <Separator />
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total Batch</span><span className="font-medium">{s.batch.length}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total Peserta</span><span className="font-medium text-blue-600">{totalPeserta}</span></div>
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Dibuat: {s.created_at}</div>
                  <div>Diperbarui: {s.updated_at}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Jadwal Batch</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {s.batch.map(b => {
                  let variant: 'default' | 'destructive' | 'secondary' = 'secondary';
                  if (b.status === 'Aktif') variant = 'default';
                  else if (b.status === 'Selesai') variant = 'destructive';
                  return (
                  <div key={b.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between"><h4 className="font-medium">{b.nama_batch}</h4><Badge variant={variant as any}>{b.status}</Badge></div>
                    <p className="text-sm text-muted-foreground mt-1">{b.tanggal_mulai} - {b.tanggal_selesai}</p>
                    <div className="flex items-center justify-between mt-2 text-sm"><span className="text-muted-foreground">Peserta Terdaftar</span><span className="font-medium text-green-600">{b.jumlah_pendaftar ?? 0}</span></div>
                  </div>
                );})}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Detail Asesor</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                  <div className="flex-1"><h4 className="font-semibold text-base">{s.nama_asesor}</h4><p className="text-sm text-muted-foreground">{s.jabatan_asesor}</p></div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{s.nama_asesor}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Jabatan</span><span className="font-medium">{s.jabatan_asesor}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Instansi</span><span className="font-medium">{s.instansi_asesor}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
