import React, { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { Filter, MoreVertical, Edit, Briefcase, Layers, Users, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Pagination from '@/components/Pagination';
import { type BreadcrumbItem } from '@/types';
import PosisiPKLForm, { PosisiPKLData } from '@/components/PosisiPKLForm';

interface ServerPosisiRecord {
  id:number;
  nama_posisi:string;
  perusahaan?:string;
  kategori?:string;
  deskripsi:string;
  persyaratan:string | string[]; // can be string or array now
  benefits?:string | string[]; // can be string or array
  lokasi:string; // mapping to wfh/wfo/hybrid display
  tipe:string; // WFH/WFO/Hybrid/Full-time/Part-time etc.
  durasi_bulan:number;
  jumlah_pendaftar:number;
  status:string; // Aktif, Non-Aktif, Penuh
  created_at:string;
  updated_at:string;
}

interface PageProps extends Record<string, unknown> {
  posisi?: { data: ServerPosisiRecord[]; meta?: { current_page:number; last_page:number; total:number; per_page:number } };
  filters?: { search?:string; status?:string; kategori?:string };
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive'> = { Aktif:'default', Draf:'secondary', Ditutup:'destructive' };

const PraktikKerjaLapanganPage: React.FC = () => {
  const breadcrumbs: BreadcrumbItem[] = [
    { title:'Dashboard', href:'/admin/dashboard' },
    { title:'PKL', href:'/admin/praktik-kerja-lapangan' }
  ];

  const { props } = usePage<PageProps>();
  const raw = props.posisi?.data ?? [];
  const [search, setSearch] = useState(props.filters?.search || '');
  const [statusFilter, setStatusFilter] = useState<string>(props.filters?.status || '');
  const [kategoriFilter, setKategoriFilter] = useState<string>(props.filters?.kategori || '');
  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const data = useMemo<PosisiPKLData[]>(() => raw.map(mapServer), [raw]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PosisiPKLData | null>(null);

  const filtered = useMemo(()=> data.filter(item => {
    return (
      (search ? item.namaPosisi.toLowerCase().includes(search.toLowerCase()) || item.kategoriPosisi.toLowerCase().includes(search.toLowerCase()) : true) &&
      (statusFilter ? item.status === statusFilter : true) &&
      (kategoriFilter ? item.kategoriPosisi === kategoriFilter : true)
    );
  }), [data, search, statusFilter, kategoriFilter]);
  // Compute pagination values
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (n: number) => { setItemsPerPage(n); setCurrentPage(1); };

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (row:PosisiPKLData) => { setEditing(row); setShowForm(true); };
  const onSave = (_payload:PosisiPKLData) => {
    // Placeholder: integrate store endpoint when available
    setShowForm(false);
    setEditing(null);
    router.reload({ only: ['posisi'] });
  };

  function mapServer(r:ServerPosisiRecord): PosisiPKLData {
    const workType = deriveWorkType(r.tipe);
    const status = mapStatus(r.status);
    return {
      id: r.id,
      namaPosisi: r.nama_posisi,
      kategoriPosisi: r.kategori || r.perusahaan || 'Umum',
      durasi: r.durasi_bulan + ' Bulan',
      wfhWfoHybrid: workType,
      deskripsi: r.deskripsi,
  requirements: Array.isArray(r.persyaratan) ? r.persyaratan : (r.persyaratan?.split(/\n+/).filter(Boolean) || []),
  benefits: Array.isArray(r.benefits) ? r.benefits : (r.benefits?.split(/\n+/).filter(Boolean) || []),
      pesertaTerdaftar: r.jumlah_pendaftar,
      status,
      tanggalDibuat: r.created_at?.slice(0,10) || '',
      tanggalDiperbarui: r.updated_at?.slice(0,10) || '',
    };
  }

  function deriveWorkType(tipe:string): 'WFH' | 'WFO' | 'Hybrid' {
    if (tipe === 'Remote') return 'WFH';
    if (tipe === 'Full-time' || tipe === 'Part-time') return 'WFO';
    return 'Hybrid';
  }

  function mapStatus(raw:string): 'Aktif' | 'Draf' | 'Ditutup' {
    if (raw === 'Non-Aktif') return 'Draf';
    if (raw === 'Penuh') return 'Ditutup';
    return 'Aktif';
  }

  // Aggregated stats
  const totalPosisi = data.length;
  const aktifCount = data.filter(d=>d.status==='Aktif').length;
  const draftCount = data.filter(d=>d.status==='Draf').length;
  const ditutupCount = data.filter(d=>d.status==='Ditutup').length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Program PKL" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Program PKL</h1>
                        <p className="text-muted-foreground">Kelola posisi dan program PKL yang tersedia</p>
                    </div>
                </div>
          <Button onClick={openCreate}>Tambah Posisi</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard label="Total Posisi" value={totalPosisi} icon={<Briefcase className="h-5 w-5" />} iconColor="text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10" />
          <StatsCard label="Aktif" value={aktifCount} icon={<Layers className="h-5 w-5" />} iconColor="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10" />
          <StatsCard label="Draft" value={draftCount} icon={<Users className="h-5 w-5" />} iconColor="text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-400/10" />
          <StatsCard label="Ditutup" value={ditutupCount} icon={<Archive className="h-5 w-5" />} iconColor="text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-400/10" />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
              <CardTitle className="text-base font-semibold">Daftar Posisi</CardTitle>
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="Cari posisi atau kategori..." className="w-full md:w-96" />
                <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="self-start md:self-auto">
                      <Filter className="h-4 w-4 mr-2" />Filter
                      {(statusFilter || kategoriFilter) && (
                        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                          {Number(!!statusFilter) + Number(!!kategoriFilter)}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    {['Aktif','Draf','Ditutup'].map(s=>(
                      <DropdownMenuItem key={s} onClick={()=> setStatusFilter(prev => prev === s ? '' : s)} className="flex items-center justify-between cursor-pointer">
                        <span>{s}</span>
                        {statusFilter === s && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Kategori</DropdownMenuLabel>
                    {['Developer','Kreatif','Marketing','Data Analyst','Quality Assurance'].map(k=>(
                      <DropdownMenuItem key={k} onClick={()=> setKategoriFilter(prev => prev === k ? '' : k)} className="flex items-center justify-between cursor-pointer">
                        <span>{k}</span>
                        {kategoriFilter === k && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {(statusFilter || kategoriFilter) && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={()=>{ setStatusFilter(''); setKategoriFilter(''); }} className="text-destructive cursor-pointer">Reset Semua</DropdownMenuItem>
                    </>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto px-4 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Nama Posisi</TableHead>
                    <TableHead className="hidden md:table-cell">Kategori</TableHead>
                    <TableHead className="hidden md:table-cell">Tipe</TableHead>
                    <TableHead className="hidden md:table-cell">Peserta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length ? paginatedData.map((row, idx)=>(
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell>{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                      <TableCell className="font-medium max-w-[220px] truncate" title={row.namaPosisi}>{row.namaPosisi}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.kategoriPosisi}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.wfhWfoHybrid}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.pesertaTerdaftar}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[row.status] ?? 'secondary'}>{row.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=>openEdit(row)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={()=>{
                              if(confirm('Hapus posisi ini?')){
                                router.delete(`/admin/praktik-kerja-lapangan/posisi/${row.id}`, { preserveScroll:true, onSuccess:()=>{ /* auto reloaded by inertia */ } });
                              }
                            }}>Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Tidak ada data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
          </CardContent>
        </Card>
        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      <PosisiPKLForm isOpen={showForm} onClose={()=>{ setShowForm(false); setEditing(null); }} onSave={onSave} editData={editing} />
    </AppLayout>
  );
};

export default PraktikKerjaLapanganPage;
