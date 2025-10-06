import { Head, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, ChangeEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MoreVertical, FileText, User, Star, X } from 'lucide-react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import Pagination from '@/components/Pagination';
import { BlogFilterDropdown } from '@/components/BlogFilterDropdown';

interface Blog {
  id: number;
  nama_artikel: string;
  jenis_konten: string;
  deskripsi: string;
  thumbnail?: string | null;
  konten: string;
  status: string;
  penulis: string;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

interface PageProps extends InertiaPageProps {
  blogs: { data: Blog[]; meta: { current_page: number; last_page: number; per_page: number; total: number } };
  filters: Record<string, any>;
  stats?: { total: number; publish: number; draft: number };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Manajemen Konten', href: '#' },
  { title: 'Blog', href: '/admin/manajemen-blog' }
];

export default function ManajemenBlog() {
  const { props } = usePage<PageProps>();
  const blogs = (props as any).blogs;
  const filters = (props as any).filters || {};
  const stats = (props as any).stats || {};
  const initialData: Blog[] = blogs?.data || [];
  const [search, setSearch] = useState(filters.search || '');
  const [activeFilters, setActiveFilters] = useState({
    status: filters.status || '',
    jenis_konten: filters.jenis_konten || '',
    featured: filters.featured ? String(filters.featured) : ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState<Blog | null>(null);
  const [form, setForm] = useState({
    nama_artikel: '',
    jenis_konten: 'Blog',
    deskripsi: '',
    thumbnail: null as File | null,
    konten: '',
    status: 'Draft',
    penulis: 'Admin',
    featured: false,
    meta_title: '',
    meta_description: ''
  });

  // Use stats from backend (all data, not just current page)
  const total = stats?.total ?? 0;
  const publishCount = stats?.publish ?? 0;
  const draftCount = stats?.draft ?? 0;

  // Client-side pagination like dashboard
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const totalPages = Math.max(1, Math.ceil(initialData.length / perPage));
  React.useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);
  const paginatedData = initialData.slice((page - 1) * perPage, page * perPage);

  useEffect(()=>{
    const t = setTimeout(()=>{
      // Apply search with current filters and reset to first page
      router.get('/admin/manajemen-blog', { ...filters, search, page: 1 }, { preserveState: true, replace: true });
    }, 350);
    return ()=>clearTimeout(t);
  },[search]);

  const openCreate = ()=> { setEditing(null); setForm({ nama_artikel:'', jenis_konten:'Blog', deskripsi:'', thumbnail:null, konten:'', status:'Draft', penulis:'Admin', featured:false, meta_title:'', meta_description:'' }); setShowForm(true); };
  const openEdit = (b:Blog)=> { setEditing(b); setForm({ nama_artikel:b.nama_artikel, jenis_konten:b.jenis_konten, deskripsi:b.deskripsi, thumbnail:null, konten:b.konten, status:b.status, penulis:b.penulis, featured:b.featured, meta_title:b.meta_title||'', meta_description:b.meta_description||'' }); setShowForm(true); };
  const openDelete = (b:Blog)=> { setDeleting(b); setShowDelete(true); };

  const submitForm = () => {
    const data: any = { ...form };
    if (form.thumbnail) { data.thumbnail = form.thumbnail; }
    if (editing) {
      router.post(`/admin/blog/${editing.id}`, { ...data, _method: 'PUT' }, { onSuccess: ()=> setShowForm(false) });
    } else {
      router.post('/admin/blog', data, { onSuccess: ()=> setShowForm(false) });
    }
  };

  const confirmDelete = () => {
    if(!deleting) return;
    router.delete(`/admin/blog/${deleting.id}`, { onSuccess: ()=> setShowDelete(false) });
  };

  const getStatusBadgeClass = (s:string) => s === 'Publish' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Blog" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Manajemen Blog</h1>
            <p className="text-muted-foreground">Kelola artikel blog untuk platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openCreate} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"><Plus className="h-4 w-4"/>Tambah Artikel Blog</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Total Artikel" value={total} icon={<FileText className="h-5 w-5" />} iconColor="text-blue-600 bg-blue-100" />
          <StatsCard label="Publish" value={publishCount} icon={<Star className="h-5 w-5" />} iconColor="text-green-600 bg-green-100" />
          <StatsCard label="Draft" value={draftCount} icon={<FileText className="h-5 w-5" />} iconColor="text-amber-600 bg-amber-100" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="text-base font-semibold">Daftar Artikel Blog</CardTitle>
              <div className="flex gap-2 items-center flex-wrap">
                <SearchBar value={search} onChange={setSearch} placeholder="Cari artikel..." />
                <BlogFilterDropdown
                  activeFilters={activeFilters}
                  onFiltersChange={(newFilters) => {
                    setActiveFilters(newFilters);
                    const params = { ...filters, search, page: 1 };
                    if (newFilters.status) params.status = newFilters.status;
                    if (newFilters.jenis_konten) params.jenis_konten = newFilters.jenis_konten;
                    if (newFilters.featured && newFilters.featured !== '') params.featured = newFilters.featured === 'true';
                    router.get('/admin/manajemen-blog', params, { preserveState: true, replace: true });
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="w-[90px]"/>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length ? paginatedData.map(b => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" /> {b.nama_artikel}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{b.deskripsi}</div>
                    </TableCell>
                    <TableCell><Badge className={getStatusBadgeClass(b.status)}>{b.status}</Badge></TableCell>
                    <TableCell className="text-sm flex items-center gap-1"><User className="h-3 w-3" />{b.penulis}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4"/></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={()=>openEdit(b)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>openDelete(b)}><Trash2 className="mr-2 h-4 w-4"/>Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={perPage}
          totalItems={initialData.length}
          onPageChange={setPage}
          onItemsPerPageChange={setPerPage}
        />

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent hideClose={true} className="max-w-none sm:max-w-[90vw] lg:max-w-[1280px] w-[92vw] md:w-[90vw] max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="bg-purple-600 text-white px-6 py-4 rounded-t-lg relative">
              <DialogTitle className="text-xl font-semibold">{editing ? 'Edit Artikel' : 'Artikel Baru'}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={()=>setShowForm(false)}
                className="absolute right-4 top-4 h-8 w-8 rounded-full bg-orange-400 hover:bg-orange-500 text-white p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="grid gap-4 py-6 px-6">
              <div className="grid gap-2">
                <Label htmlFor="nama_artikel">Judul</Label>
                <Input id="nama_artikel" value={form.nama_artikel} onChange={e=>setForm(f=>({...f,nama_artikel:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea id="deskripsi" rows={3} value={form.deskripsi} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setForm(f=>({...f,deskripsi:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <RichTextEditor value={form.konten} onChange={(val)=> setForm(f=>({...f,konten:val}))} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v=>setForm(f=>({...f,status:v}))}>
                    <SelectTrigger><SelectValue placeholder="Pilih status"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Publish">Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Jenis Konten</Label>
                  <Select value={form.jenis_konten} onValueChange={v=>setForm(f=>({...f,jenis_konten:v}))}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenis"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blog">Blog</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Penulis</Label>
                  <Input value={form.penulis} onChange={e=>setForm(f=>({...f,penulis:e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label>Thumbnail</Label>
                  <Input type="file" accept="image/*" onChange={e=>setForm(f=>({...f,thumbnail:e.target.files?.[0]||null}))} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Meta Title</Label>
                  <Input value={form.meta_title} onChange={e=>setForm(f=>({...f,meta_title:e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label>Meta Description</Label>
                  <Input value={form.meta_description} onChange={e=>setForm(f=>({...f,meta_description:e.target.value}))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="featured" type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} className="h-4 w-4" />
                <Label htmlFor="featured" className="flex items-center gap-1">Tandai Featured</Label>
              </div>
            </div>
            <DialogFooter className="px-6 pb-6">
              <Button variant="outline" onClick={()=>setShowForm(false)}>Batal</Button>
              <Button onClick={submitForm} className="bg-purple-600 hover:bg-purple-700 text-white">{editing ? 'Simpan' : 'Tambah'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent>
            <DialogHeader><DialogTitle>Hapus Artikel</DialogTitle></DialogHeader>
            <p>Yakin hapus artikel <span className="font-semibold">{deleting?.nama_artikel}</span>?</p>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setShowDelete(false)}>Batal</Button>
              <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
