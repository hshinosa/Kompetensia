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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MoreVertical, Video as VideoIcon, Eye, User, Play } from 'lucide-react';

interface VideoItem {
  id: number;
  judul: string;
  deskripsi: string;
  thumbnail?: string | null;
  link_video?: string | null;
  status: string;
  penulis: string;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  videos?: { data: VideoItem[]; meta: { current_page: number; last_page: number; per_page: number; total: number } };
  filters?: Record<string, any>;
  [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Manajemen Konten', href: '#' },
  { title: 'Video', href: '/admin/manajemen-video' }
];

export default function ManajemenVideo() {
  const { props } = usePage();
  const videos = (props as PageProps).videos;
  const filters = (props as PageProps).filters || {};
  const data: VideoItem[] = videos && Array.isArray(videos.data) ? videos.data : [];

  const [search, setSearch] = useState((filters as any).search || '');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState<VideoItem | null>(null);
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    thumbnail: null as File | null,
    link_video: '',
    status: 'Draft',
    penulis: 'Admin',
    featured: false
  });
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  useEffect(()=>{ const t = setTimeout(()=>{ router.get('/admin/manajemen-video', { search }, { preserveState:true, replace:true }); },400); return ()=>clearTimeout(t); },[search]);

  // Statistik agregat berdasarkan data yang tampil di tabel
  const total = data.length;
  const publishCount = data.filter(v=>v.status==='Publish').length;
  const draftCount = data.filter(v=>v.status==='Draft').length;

  const extractYouTubeVideoId = (url: string): string | null => {
    if(!url) return null;
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /youtube\.com\/watch\?.*v=([^&\n?#]+)/];
    for(const p of patterns){ const m = p.exec(url); if(m) return m[1]; }
    return null;
  };
  const isValidYouTubeUrl = (url:string) => !!extractYouTubeVideoId(url);
  const getYouTubeEmbedUrl = (url:string) => { const id = extractYouTubeVideoId(url); return id ? `https://www.youtube.com/embed/${id}`:''; };

  useEffect(()=>{ setShowVideoPreview(isValidYouTubeUrl(form.link_video)); },[form.link_video]);

  const openCreate = ()=> { setEditing(null); setForm({ judul:'', deskripsi:'', thumbnail:null, link_video:'', status:'Draft', penulis:'Admin', featured:false }); setShowForm(true); };
  const openEdit = (v:VideoItem)=> { setEditing(v); setForm({ judul:v.judul, deskripsi:v.deskripsi, thumbnail:null, link_video:v.link_video||'', status:v.status, penulis:v.penulis, featured:v.featured }); setShowForm(true); };
  const openDelete = (v:VideoItem)=> { setDeleting(v); setShowDelete(true); };

  const submitForm = () => {
    // Validasi frontend
    const requiredFields: (keyof typeof form)[] = ['judul', 'deskripsi', 'link_video', 'status', 'penulis'];
    for (const field of requiredFields) {
      const value = form[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        alert('Field ' + field + ' wajib diisi!');
        return;
      }
    }

    // Siapkan data hanya field yang diperlukan
    const sendData: Record<string, any> = {
      judul: form.judul,
      deskripsi: form.deskripsi,
      link_video: form.link_video,
      status: form.status,
      penulis: form.penulis,
      featured: form.featured,
    };
    let data: any;
    let options: any = {
      onSuccess: () => setShowForm(false),
      onError: (errors: any) => {
        let msg = 'Gagal menambah video. Pastikan semua data sudah benar.';
        if (errors && typeof errors === 'object') {
          msg += '\n';
          msg += Object.values(errors).map(e => Array.isArray(e) ? e.join(', ') : e).join('\n');
        }
        alert(msg);
      }
    };
    if (form.thumbnail) {
      // Kirim sebagai FormData jika ada file
      const formData = new FormData();
      Object.entries(sendData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      });
      formData.append('thumbnail', form.thumbnail);
      data = formData;
      options.forceFormData = true;
    } else {
      data = sendData;
    }
    if (editing) {
      if (form.thumbnail) {
        data.append('_method', 'PUT');
        router.post(`/admin/video/${editing.id}`, data, options);
      } else {
        router.post(`/admin/video/${editing.id}`, { ...sendData, _method: 'PUT' }, options);
      }
    } else {
      router.post('/admin/video', data, options);
    }
  };

  const confirmDelete = () => {
    if(!deleting) return;
    router.delete(`/admin/video/${deleting.id}`, { onSuccess: ()=> setShowDelete(false) });
  };

  const statusBadgeVariant = (s:string) => s==='Publish' ? 'default' : 'secondary';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Video" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Manajemen Video</h1>
            <p className="text-muted-foreground">Kelola konten video untuk platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openCreate} className="flex items-center gap-2"><Plus className="h-4 w-4"/>Tambah Video</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Total Video" value={total} icon={<VideoIcon className="h-5 w-5" />} iconColor="text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-400/10" />
          <StatsCard label="Publish" value={publishCount} icon={<Eye className="h-5 w-5" />} iconColor="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10" />
          <StatsCard label="Draft" value={draftCount} icon={<VideoIcon className="h-5 w-5" />} iconColor="text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-400/10" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="font-heading">Daftar Video</CardTitle>
              <div className="flex items-center gap-2">
                <SearchBar value={search} onChange={setSearch} placeholder="Cari video..." className="w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="w-[90px]"/>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length ? data.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="font-medium flex flex-col gap-1">
                        <div className="flex items-center gap-2"><VideoIcon className="h-4 w-4 text-purple-500" /> {v.judul}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{v.deskripsi}</div>
                        {v.link_video && isValidYouTubeUrl(v.link_video) && (
                          <div className="text-[10px] inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded">
                            <Play className="h-3 w-3" /> YouTube
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={statusBadgeVariant(v.status)}>{v.status}</Badge></TableCell>
                    <TableCell className="text-sm flex items-center gap-1"><User className="h-3 w-3" />{v.penulis}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4"/></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {v.link_video && isValidYouTubeUrl(v.link_video) && <DropdownMenuItem onClick={()=>window.open(v.link_video!, '_blank')}><Play className="mr-2 h-4 w-4"/>Buka</DropdownMenuItem>}
                          <DropdownMenuItem onClick={()=>openEdit(v)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>openDelete(v)}><Trash2 className="mr-2 h-4 w-4"/>Hapus</DropdownMenuItem>
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

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-none sm:max-w-[90vw] lg:max-w-[960px] w-[92vw]">
            <DialogHeader><DialogTitle>{editing ? 'Edit Video' : 'Video Baru'}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="judul">Judul</Label>
                <Input id="judul" value={form.judul} onChange={e=>setForm(f=>({...f,judul:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea id="deskripsi" rows={3} value={form.deskripsi} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setForm(f=>({...f,deskripsi:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link_video">Link YouTube</Label>
                <Input id="link_video" value={form.link_video} onChange={e=>setForm(f=>({...f,link_video:e.target.value}))} placeholder="https://youtube.com/watch?v=..." />
                {form.link_video && !isValidYouTubeUrl(form.link_video) && <p className="text-xs text-red-500">Link YouTube tidak valid</p>}
                {showVideoPreview && form.link_video && <div className="mt-2 aspect-video rounded overflow-hidden bg-muted"><iframe src={getYouTubeEmbedUrl(form.link_video)} className="w-full h-full" allowFullScreen title="Preview"/></div>}
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
                  <Label>Penulis</Label>
                  <Input value={form.penulis} onChange={e=>setForm(f=>({...f,penulis:e.target.value}))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="featured" type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} className="h-4 w-4" />
                <Label htmlFor="featured" className="flex items-center gap-1">Tandai Featured</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setShowForm(false)}>Batal</Button>
              <Button onClick={submitForm}>{editing ? 'Simpan' : 'Tambah'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent>
            <DialogHeader><DialogTitle>Hapus Video</DialogTitle></DialogHeader>
            <p>Yakin hapus video <span className="font-semibold">{deleting?.judul}</span>?</p>
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
