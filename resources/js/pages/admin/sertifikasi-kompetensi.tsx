import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, ChangeEvent, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Eye, MoreVertical, Briefcase, MapPin, Clock, Users, Filter } from 'lucide-react';

interface SertifikasiData {
  id: number;
  thumbnail: string;
  namaSertifikasi: string;
  jenisSertifikasi: string;
  jadwalSertifikasi: string; // kept for other usages if needed
  sertifikatList: string[]; // tipe sertifikat didapat (array)
  totalBatch: number;
  assessor: string;
  status: 'Aktif' | 'Draf';
}
interface RawSertifikasiRecord extends Record<string, unknown> {
  id: number; thumbnail?: string; namaSertifikasi: string; jenisSertifikasi: string; jadwalSertifikasi?: string; assessor?: string; status: 'Aktif'|'Draf'
}
interface FiltersState { search: string; jenis: string; status: string }
interface PaginationMeta { current_page:number; last_page:number; total:number }
interface PageProps extends Record<string, unknown> { sertifikasi: { data: RawSertifikasiRecord[]; meta: PaginationMeta }; filters?: Partial<FiltersState> }

export default function SertifikasiKompetensi() {
  const { props } = usePage<PageProps>();
  const serverData: RawSertifikasiRecord[] = props.sertifikasi?.data ?? [];

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Sertifikasi Kompetensi', href: '/admin/sertifikasi-kompetensi' }
  ];

  const buildThumbnailUrl = (raw?: string) => {
    if(!raw) return '/placeholder-thumb.jpg';
    if(raw.startsWith('http') || raw.startsWith('/')) return raw; // already absolute or rooted
    return `/storage/${raw}`; // assume stored path relative to storage disk
  };
  const sertifikasiData: SertifikasiData[] = useMemo(()=> serverData.map(item => {
    const rawTipe = (item as any).tipe_sertifikat ?? (item as any).tipeSertifikat;
    let tipe: string[] = [];
    if (Array.isArray(rawTipe)) {
      tipe = rawTipe as string[];
    } else if (typeof rawTipe === 'string' && rawTipe) {
      // Handle comma-separated string from controller
      tipe = rawTipe.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    return {
      id: item.id,
      thumbnail: buildThumbnailUrl(item.thumbnail),
      namaSertifikasi: item.namaSertifikasi,
      jenisSertifikasi: item.jenisSertifikasi,
      jadwalSertifikasi: item.jadwalSertifikasi || '-',
      sertifikatList: Array.isArray(tipe) ? tipe : [],
      totalBatch: (item as any).totalBatch ?? 0,
      assessor: item.assessor || '-',
      status: item.status,
    };
  }), [serverData]);

  // Filtering & pagination state (restored)
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ jenis: string[]; status: string[]; assessor: string[] }>({ jenis: [], status: [], assessor: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSertifikasi, setSelectedSertifikasi] = useState<SertifikasiData | null>(null);

  const toggleFilter = (key:'jenis'|'status'|'assessor', value:string) => {
    setActiveFilters(cur => { const list = cur[key]; return { ...cur, [key]: list.includes(value) ? list.filter(v=>v!==value) : [...list, value] }; });
  };
  const clearAllFilters = () => setActiveFilters({ jenis:[], status:[], assessor:[] });
  const uniqueAssessors = useMemo(()=> Array.from(new Set(sertifikasiData.map(s=>s.assessor).filter(Boolean))).sort((a,b)=>a.localeCompare(b)), [sertifikasiData]);
  const filteredData = useMemo(()=> sertifikasiData.filter(item => {
    if (search && ![item.namaSertifikasi, item.assessor, item.jenisSertifikasi].some(f=>f.toLowerCase().includes(search.toLowerCase()))) return false;
    if (activeFilters.jenis.length && !activeFilters.jenis.includes(item.jenisSertifikasi)) return false;
    if (activeFilters.status.length && !activeFilters.status.includes(item.status)) return false;
    if (activeFilters.assessor.length && !activeFilters.assessor.includes(item.assessor)) return false;
    return true;
  }), [search, activeFilters, sertifikasiData]);
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const handlePageChange = (page:number) => setCurrentPage(page);
  const handleItemsPerPageChange = (n:number) => { setItemsPerPage(n); setCurrentPage(1); };
  const totalSertifikasi = sertifikasiData.length;
  const sertifikasiAktif = sertifikasiData.filter(item => item.status === 'Aktif').length;
  const sertifikasiIndustri = sertifikasiData.filter(item => item.jenisSertifikasi === 'Industri').length;
  const sertifikasiBNSP = sertifikasiData.filter(item => item.jenisSertifikasi === 'BNSP').length;

  const [formData, setFormData] = useState({
    namaSertifikasi: '',
    jenisSertifikasi: '',
    jadwalSertifikasi: '',
    assessor: '',
    deskripsi: '',
    materi: '',
    thumbnail: null as File | null
  });

  const handleEditSertifikasi = (sertifikasi: SertifikasiData) => { window.location.href = `/admin/form-sertifikasi/${sertifikasi.id}`; };
  const handleViewSertifikasi = (sertifikasi: SertifikasiData) => { router.visit(`/admin/detail-sertifikasi/${sertifikasi.id}`); };
  const handleDeleteSertifikasi = (sertifikasi: SertifikasiData) => { setSelectedSertifikasi(sertifikasi); setIsDeleteModalOpen(true); };
  const handleSave = () => { setIsEditModalOpen(false); setSelectedSertifikasi(null); };
  const handleDelete = () => {
    if (!selectedSertifikasi) return;
    router.delete(`/admin/sertifikasi/${selectedSertifikasi.id}`, { preserveScroll:true, onFinish:()=> { setIsDeleteModalOpen(false); setSelectedSertifikasi(null); } });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sertifikasi Kompetensi" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Sertifikasi Kompetensi</h1>
            <p className="text-muted-foreground">Kelola program sertifikasi kompetensi</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              <Link href="/admin/form-sertifikasi">
                <Plus className="h-4 w-4" />
                Tambah Sertifikasi
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <StatsCard label="Total Sertifikasi" value={totalSertifikasi} icon={<Briefcase className="h-5 w-5" />} iconColor="text-blue-600 bg-blue-100" />
          <StatsCard label="Sertifikasi Aktif" value={sertifikasiAktif} icon={<Users className="h-5 w-5" />} iconColor="text-green-600 bg-green-100" />
          <StatsCard label="Sertifikasi Industri" value={sertifikasiIndustri} icon={<Clock className="h-5 w-5" />} iconColor="text-orange-600 bg-orange-100" />
          <StatsCard label="Sertifikasi BNSP" value={sertifikasiBNSP} icon={<MapPin className="h-5 w-5" />} iconColor="text-purple-600 bg-purple-100" />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
              <CardTitle className="text-base font-semibold">Daftar Sertifikasi</CardTitle>
              <div className="flex items-center gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="Cari sertifikasi / assessor..." />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Filter className="h-4 w-4 mr-2" />Filter
                      {(activeFilters.jenis.length + activeFilters.status.length + activeFilters.assessor.length) > 0 && (
                        <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs h-5 min-w-5 flex items-center justify-center">
                          {activeFilters.jenis.length + activeFilters.status.length + activeFilters.assessor.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Jenis Sertifikasi</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {['BNSP','Industri'].map(val => (
                        <DropdownMenuItem key={val} onClick={()=>toggleFilter('jenis', val)} className="flex items-center justify-between cursor-pointer">
                          <span>{val}</span>
                          {activeFilters.jenis.includes(val) && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {['Aktif','Draf'].map(val => (
                        <DropdownMenuItem key={val} onClick={()=>toggleFilter('status', val)} className="flex items-center justify-between cursor-pointer">
                          <span>{val}</span>
                          {activeFilters.status.includes(val) && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    {uniqueAssessors.length>0 && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Assessor</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {uniqueAssessors.map(val => (
                          <DropdownMenuItem key={val} onClick={()=>toggleFilter('assessor', val)} className="flex items-center justify-between cursor-pointer">
                            <span className="truncate max-w-[140px]" title={val}>{val}</span>
                            {activeFilters.assessor.includes(val) && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </>}
                    {(activeFilters.jenis.length + activeFilters.status.length + activeFilters.assessor.length) > 0 && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearAllFilters} className="text-destructive cursor-pointer">Reset Semua</DropdownMenuItem>
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
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead>Nama Sertifikasi</TableHead>
                  <TableHead className="hidden md:table-cell">Jenis</TableHead>
                  <TableHead className="hidden md:table-cell">Sertifikat</TableHead>
                  <TableHead className="hidden md:table-cell">Batch</TableHead>
                  <TableHead className="hidden md:table-cell">Assessor</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length ? paginatedData.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>{(currentPage-1)*itemsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <div className="h-12 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={item.thumbnail}
                          alt={item.namaSertifikasi}
                          loading="lazy"
                          onError={(e)=>{ (e.currentTarget as HTMLImageElement).src='/placeholder-thumb.jpg'; }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[220px] truncate" title={item.namaSertifikasi}>{item.namaSertifikasi}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={item.jenisSertifikasi === 'BNSP' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                        {item.jenisSertifikasi}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.sertifikatList.length ? (
                        <div className="flex flex-wrap gap-1">
                          {item.sertifikatList.map(val => (
                            <Badge key={val} variant="outline" className="text-[10px] font-normal px-1.5 py-0.5">{val}</Badge>
                          ))}
                        </div>
                      ) : <span className="text-xs text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.totalBatch}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.assessor}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={item.status === 'Aktif' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewSertifikasi(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSertifikasi(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSertifikasi(item)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {search ? 'Tidak ada data yang sesuai dengan pencarian / filter' : 'Tidak ada data sertifikasi'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Sertifikasi</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editNamaSertifikasi">Nama Sertifikasi</Label>
                  <Input id="editNamaSertifikasi" value={formData.namaSertifikasi} onChange={(e) => setFormData({ ...formData, namaSertifikasi: e.target.value })} placeholder="Masukkan nama sertifikasi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editJenisSertifikasi">Jenis Sertifikasi</Label>
                  <Select value={formData.jenisSertifikasi} onValueChange={(value) => setFormData({ ...formData, jenisSertifikasi: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis sertifikasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BNSP">BNSP</SelectItem>
                      <SelectItem value="Industri">Industri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editJadwalSertifikasi">Jadwal Sertifikasi</Label>
                  <Input id="editJadwalSertifikasi" value={formData.jadwalSertifikasi} onChange={(e) => setFormData({ ...formData, jadwalSertifikasi: e.target.value })} placeholder="21-05-2025 sd 21-06-2025" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAssessor">Assessor</Label>
                  <Input id="editAssessor" value={formData.assessor} onChange={(e) => setFormData({ ...formData, assessor: e.target.value })} placeholder="Nama assessor" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDeskripsi">Deskripsi</Label>
                <Textarea id="editDeskripsi" value={formData.deskripsi} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Deskripsi sertifikasi" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMateri">Materi</Label>
                <Textarea id="editMateri" value={formData.materi} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, materi: e.target.value })} placeholder="Materi yang akan dipelajari" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editThumbnail">Thumbnail</Label>
                <Input id="editThumbnail" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
              <Button onClick={handleSave}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Apakah Anda yakin ingin menghapus sertifikasi <strong>{selectedSertifikasi?.namaSertifikasi}</strong>?</p>
              <p className="text-sm text-muted-foreground mt-2">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
              <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
