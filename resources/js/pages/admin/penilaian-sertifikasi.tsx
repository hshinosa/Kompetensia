import React from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/Pagination';
import { Users, Clock, Award, FileCheck, Filter } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface BatchSummary { id: number; namaBatch: string; jumlahPeserta: number; status: string; }
interface SertifikasiSummary { id: number; namaSertifikasi: string; assessor?: string; penyelenggara: string; batches: BatchSummary[] }

interface PaginationMeta { per_page: number; current_page: number; last_page: number; total: number }
interface Filters { search?: string; jenis?: string }
interface PageProps {
  sertifikasi: { data: SertifikasiSummary[] } | null;
  meta: PaginationMeta;
  filters: Filters;
  [key: string]: unknown; // allow extra inertia props (ziggy, auth, flash, etc.)
}

const PenilaianSertifikasiPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { sertifikasi, meta, filters } = props;
  const [search, setSearch] = React.useState(filters?.search || '');
  const [jenis, setJenis] = React.useState<string>(filters?.jenis || '');
  const [perPage, setPerPage] = React.useState(meta?.per_page || 10);
  const [activeId, setActiveId] = React.useState<number | null>(null);
  // (cert pagination handled by backend meta + changePage)
  const [batchPage, setBatchPage] = React.useState(1);
  const [batchPerPage, setBatchPerPage] = React.useState(5);
  // Batch-specific filters
  const [batchSearch, setBatchSearch] = React.useState('');
  const [batchStatus, setBatchStatus] = React.useState('');
  // Inline participant listing removed – detail page handles grading
  const firstLoad = React.useRef(true);

  // Debounce search & jenis changes
  React.useEffect(()=>{
    if(firstLoad.current){ firstLoad.current = false; return; }
    const t = setTimeout(()=>{
      router.get(route('admin.penilaian-sertifikasi'), { search, jenis, per_page: perPage, page: 1 }, { preserveState: true, replace: true });
    }, 400);
    return ()=> clearTimeout(t);
  }, [search, jenis, perPage]);

  const changePage = (page: number) => {
    router.get(route('admin.penilaian-sertifikasi'), { search, jenis, per_page: perPage, page }, { preserveState: true, replace: true });
  };

  const dataset: SertifikasiSummary[] = sertifikasi?.data || [];
  React.useEffect(()=>{ if(dataset.length && (activeId===null || !dataset.find(s=>s.id===activeId))) setActiveId(dataset[0].id); },[dataset, activeId]);
  const selected = dataset.find(s=>s.id===activeId);
  // Reset logic for batch selection removed (no inline participant list)

  const totalSertifikasi = dataset.length;
  const totalBatch = dataset.reduce((sum,s)=> sum + s.batches.length,0);
  const aktiveBatch = dataset.reduce((sum, s) => sum + s.batches.filter(b => b.status === 'Aktif').length, 0);
  const totalPeserta = dataset.reduce((sum, s) => sum + s.batches.reduce((x, b) => x + b.jumlahPeserta, 0), 0);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Penilaian', href: '#' },
    { title: 'Sertifikasi', href: '/admin/penilaian-sertifikasi' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Penilaian Sertifikasi Kompetensi" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Penilaian Sertifikasi</h1>
                        <p className="text-muted-foreground">Kelola penilaian peserta Sertifikasi</p>
                    </div>
                </div>
        {/* Stats */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sertifikasi</p>
                  <div className="text-2xl font-bold">{totalSertifikasi}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Batch</p>
                  <div className="text-2xl font-bold">{totalBatch}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch Aktif</p>
                  <div className="text-2xl font-bold">{aktiveBatch}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Peserta</p>
                  <div className="text-2xl font-bold">{totalPeserta}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle>Sertifikasi Kompetensi</CardTitle>
                <div className="flex gap-2 items-center flex-wrap">
                  <SearchBar value={search} onChange={setSearch} placeholder="Cari sertifikasi / asesor..." />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="relative">
                        <Filter className="h-4 w-4 mr-2" />Filter
                        {jenis && (
                          <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs h-5 min-w-5 flex items-center justify-center">1</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Jenis Penyelenggara</DropdownMenuLabel>
                      {['BNSP','Industri'].map(opt => (
                        <DropdownMenuItem key={opt} onClick={()=> setJenis(prev => prev === opt ? '' : opt)} className="flex items-center justify-between cursor-pointer">
                          <span>{opt}</span>
                          {jenis === opt && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </DropdownMenuItem>
                      ))}
                      {jenis && <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>setJenis('')} className="text-destructive cursor-pointer">Reset</DropdownMenuItem>
                      </>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Sertifikasi</TableHead>
                    <TableHead>Assessor</TableHead>
                    <TableHead>Penyelenggara</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataset.length ? dataset.map((s, idx) => (
                    <TableRow key={s.id} onClick={()=>setActiveId(s.id)} className={`cursor-pointer hover:bg-muted/50 ${activeId===s.id ? 'bg-muted/70' : ''}`}>
                      <TableCell className="font-medium">{(meta.current_page-1)*meta.per_page + idx + 1}</TableCell>
                      <TableCell className="font-medium">{s.namaSertifikasi}</TableCell>
                      <TableCell>{s.assessor}</TableCell>
                      <TableCell><Badge variant={s.penyelenggara === 'BNSP' ? 'default' : 'secondary'}>{s.penyelenggara}</Badge></TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{search ? 'Tidak ada data sesuai' : 'Tidak ada data sertifikasi'}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {dataset.length > 0 && (
              <div className="px-4 pb-4">
                <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
                  itemsPerPage={meta.per_page}
                  totalItems={meta.total}
                  onPageChange={changePage}
                  onItemsPerPageChange={(n)=>{ setPerPage(n); }}
                />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle>Batch {selected ? `(${selected.namaSertifikasi})` : ''}</CardTitle>
                {selected && (
                  <div className="flex gap-2 items-center flex-wrap">
                    <SearchBar value={batchSearch} onChange={setBatchSearch} placeholder="Cari batch..." />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="relative">
                          <Filter className="h-4 w-4 mr-2" />Filter
                          {batchStatus && (
                            <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs h-5 min-w-5 flex items-center justify-center">1</Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Status Batch</DropdownMenuLabel>
                        {['Aktif','Selesai','Akan Datang'].map(opt => (
                          <DropdownMenuItem key={opt} onClick={()=> setBatchStatus(prev => prev === opt ? '' : opt)} className="flex items-center justify-between cursor-pointer">
                            <span>{opt}</span>
                            {batchStatus === opt && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </DropdownMenuItem>
                        ))}
                        {batchStatus && <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={()=>setBatchStatus('')} className="text-destructive cursor-pointer">Reset</DropdownMenuItem>
                        </>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
                {selected ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>No</TableHead><TableHead>Nama Batch</TableHead><TableHead className="w-28">Peserta</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {selected.batches
                        .filter(b => (batchSearch ? b.namaBatch.toLowerCase().includes(batchSearch.toLowerCase()) : true))
                        .filter(b => (batchStatus ? b.status.toLowerCase() === batchStatus.toLowerCase() : true))
                        .slice((batchPage-1)*batchPerPage, batchPage*batchPerPage)
                        .map((b, idx) => (
                        <TableRow key={b.id} className="hover:bg-muted/50">
                          <TableCell>{(batchPage-1)*batchPerPage + idx + 1}</TableCell>
                          <TableCell>{b.namaBatch}</TableCell>
                          <TableCell>{b.jumlahPeserta}</TableCell>
                          <TableCell><Badge variant={b.status==='Aktif' ? 'default' : 'secondary'}>{b.status}</Badge></TableCell>
                          <TableCell><Button variant="outline" size="sm" onClick={()=> router.get(route('admin.batch-penilaian-sertifikasi', { sertifikasiId: selected.id, batchId: b.id }))}>Nilai</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center py-20 text-muted-foreground">Pilih sertifikasi</div>
                )}
            </CardContent>
            <div className="m-4 p-2">
              {/* Batch Pagination */}
              {selected && (
                <Pagination 
                  currentPage={batchPage} 
                  totalPages={Math.max(1, Math.ceil(selected.batches.filter(b => (batchSearch ? b.namaBatch.toLowerCase().includes(batchSearch.toLowerCase()) : true)).filter(b => (batchStatus ? b.status.toLowerCase() === batchStatus.toLowerCase() : true)).length / batchPerPage))} 
                  itemsPerPage={batchPerPage} 
                  totalItems={selected.batches.length} 
                  onPageChange={setBatchPage} 
                  onItemsPerPageChange={setBatchPerPage} 
                />
              )}
            </div>
          </Card>
        </div>
  {/* Inline peserta & penilaian dihapus; gunakan halaman detail-penilaian-sertifikasi */}
      </div>
    </AppLayout>
  );
};

export default PenilaianSertifikasiPage;
