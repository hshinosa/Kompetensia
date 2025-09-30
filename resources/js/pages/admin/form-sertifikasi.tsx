import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, User, Save, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AsesorAutocomplete, { AsesorOption } from '@/components/AsesorAutocomplete';

interface RawModul { judul:string; deskripsi:string; order?:number }
interface RawBatch { nama_batch:string; tanggal_mulai:string; tanggal_selesai:string; status?:BatchItem['status'] }
interface RawSertifikasi { id:number; nama_sertifikasi:string; jenis_sertifikasi:string; deskripsi:string; modul?:RawModul[]; batch?:RawBatch[]; asesor_id?:number; tipe_sertifikat?:string[]; thumbnail_url?:string|null; asesor?: { id: number; nama_asesor: string; jabatan_asesor: string; instansi_asesor: string; foto_asesor_url: string | null }; }
interface PageProps extends Record<string, unknown> { sertifikasi?: RawSertifikasi; isEdit?: boolean; }

interface FormDataShape {
  nama_sertifikasi: string;
  jenis_sertifikasi: string;
  deskripsi: string;
  thumbnail: File | null;
  asesor_id: number | null;
  // Fields untuk asesor baru (manual input)
  nama_asesor: string;
  jabatan_asesor: string;
  instansi_asesor: string;
  foto_asesor: File | null;
  tipe_sertifikat: string[];
}

interface ModulItem { id:number; judul:string; deskripsi:string; order:number; }
interface BatchItem { id:number; nama_batch:string; tanggal_mulai:string; tanggal_selesai:string; status:'Draf'|'Aktif'|'Selesai'|'Ditutup'; }


function SortableModulItem({ modul, onEdit, onDelete }: Readonly<{ modul:ModulItem; onEdit:(m:ModulItem)=>void; onDelete:(id:number)=>void }>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: modul.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging?0.5:1 };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"><GripVertical className="h-5 w-5" /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 truncate">{modul.judul || 'Tanpa Judul'}</h4>
            <p className="text-sm text-gray-600 mt-1 truncate">{modul.deskripsi}</p>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Button type="button" variant="ghost" size="sm" onClick={()=>onEdit(modul)} className="text-gray-500 hover:text-gray-700"><Edit className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={()=>onDelete(modul.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FormSertifikasi() {
  const { props } = usePage<PageProps>();
  const s = props.sertifikasi;
  const isEdit = !!props.isEdit;

  const breadcrumbs: BreadcrumbItem[] = [
    { title:'Dashboard', href:'/admin/dashboard' },
    { title:'Sertifikasi Kompetensi', href:'/admin/sertifikasi-kompetensi' },
    { title: isEdit? 'Edit Sertifikasi':'Buat Sertifikasi', href:'#' }
  ];

  const errors: Record<string,string> = (props as any).errors || {};
  const [saving,setSaving] = useState(false);
  const [isCreatingNewAsesor, setIsCreatingNewAsesor] = useState(false);
  const [selectedAsesor, setSelectedAsesor] = useState<AsesorOption | null>(
    s?.asesor ? {
      id: s.asesor.id,
      name: s.asesor.nama_asesor,
      label: s.asesor.nama_asesor,
      jabatan: s.asesor.jabatan_asesor,
      instansi: s.asesor.instansi_asesor,
      foto_asesor_url: s.asesor.foto_asesor_url
    } : null
  );
  const [form,setForm] = useState<FormDataShape>({
    nama_sertifikasi: s?.nama_sertifikasi || '',
    jenis_sertifikasi: s?.jenis_sertifikasi || '',
    deskripsi: s?.deskripsi || '',
    thumbnail: null,
    asesor_id: s?.asesor_id || null,
    // Fields untuk asesor manual
    nama_asesor: '',
    jabatan_asesor: '',
    instansi_asesor: '',
    foto_asesor: null,
    tipe_sertifikat: Array.isArray(s?.tipe_sertifikat) ? s.tipe_sertifikat : [],
  });

  const [modul, setModul] = useState<ModulItem[]>(() => (s?.modul || []).map((m,i)=>({ id: Date.now()+i, judul:m.judul, deskripsi:m.deskripsi, order:m.order ?? i })));
  const [batch, setBatch] = useState<BatchItem[]>(() => (s?.batch || []).map((b,i)=>({ id: Date.now()+i, nama_batch:b.nama_batch, tanggal_mulai:b.tanggal_mulai, tanggal_selesai:b.tanggal_selesai, status:b.status || 'Draf' })));

  // DnD
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor,{ coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = (e:DragEndEvent) => {
    const { active, over } = e; if (!over || active.id===over.id) return;
    setModul(prev => {
      const oldIndex = prev.findIndex(m=>m.id===active.id);
      const newIndex = prev.findIndex(m=>m.id===over.id);
      const moved = arrayMove(prev, oldIndex, newIndex).map((m,i)=>({...m, order:i}));
      return [...moved];
    });
  };

  // Modul modal state
  const [isModulModalOpen,setIsModulModalOpen]=useState(false);
  const [editingModul,setEditingModul]=useState<ModulItem|null>(null);
  const [modulForm,setModulForm]=useState({ judul:'', deskripsi:'' });

  const handleAddModul = () => { setEditingModul(null); setModulForm({ judul:'', deskripsi:'' }); setIsModulModalOpen(true); };
  const handleEditModul = (m:ModulItem) => { setEditingModul(m); setModulForm({ judul:m.judul, deskripsi:m.deskripsi }); setIsModulModalOpen(true); };
  const handleSaveModul = () => {
  setModul(prev => editingModul ? prev.map((p:ModulItem)=> p.id===editingModul.id ? { ...p, judul:modulForm.judul, deskripsi:modulForm.deskripsi }:p) : [...prev, { id:Date.now(), judul:modulForm.judul, deskripsi:modulForm.deskripsi, order:prev.length }]);
    setIsModulModalOpen(false); setModulForm({ judul:'', deskripsi:'' }); setEditingModul(null);
  };
  const handleDeleteModul = (id:number) => setModul(prev=> prev.filter(m=>m.id!==id).map((m:ModulItem,i:number)=>({...m, order:i})));

  // Batch modal state
  const [isBatchModalOpen,setIsBatchModalOpen]=useState(false);
  const [editingBatch,setEditingBatch]=useState<BatchItem|null>(null);
  const [batchForm,setBatchForm]=useState({ nama_batch:'', tanggal_mulai:'', tanggal_selesai:'', status:'Draf' as BatchItem['status'] });
  const handleAddBatch = () => { setEditingBatch(null); setBatchForm({ nama_batch:'', tanggal_mulai:'', tanggal_selesai:'', status:'Draf' }); setIsBatchModalOpen(true); };
  const handleEditBatch = (b:BatchItem) => { setEditingBatch(b); setBatchForm({ nama_batch:b.nama_batch, tanggal_mulai:b.tanggal_mulai, tanggal_selesai:b.tanggal_selesai, status:b.status }); setIsBatchModalOpen(true); };
  const handleSaveBatch = () => { setBatch(prev => editingBatch ? prev.map(p=> p.id===editingBatch.id ? { ...p, ...batchForm }:p) : [...prev, { id:Date.now(), ...batchForm }]); setIsBatchModalOpen(false); setEditingBatch(null); setBatchForm({ nama_batch:'', tanggal_mulai:'', tanggal_selesai:'', status:'Draf' }); };
  const handleDeleteBatch = (id:number) => setBatch(prev => prev.filter(b=>b.id!==id));

  const sortedModul = useMemo<ModulItem[]>(()=> [...modul].sort((a,b)=>a.order-b.order), [modul]);
  let submitLabel: string;
  if (saving) submitLabel = 'Menyimpan...';
  else if (isEdit) submitLabel = 'Simpan Perubahan';
  else submitLabel = 'Simpan Sertifikasi';

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const hasError = false;
    
    // Check basic fields
    if (!form.nama_sertifikasi.trim()) {
      alert('Nama sertifikasi harus diisi');
      return;
    }
    
    if (!form.jenis_sertifikasi) {
      alert('Jenis sertifikasi harus dipilih');
      return;
    }
    
    if (!form.deskripsi.trim()) {
      alert('Deskripsi harus diisi');
      return;
    }
    
    // Check asesor
    if (isCreatingNewAsesor) {
      if (!form.nama_asesor.trim()) {
        alert('Nama asesor harus diisi');
        return;
      }
      if (!form.jabatan_asesor.trim()) {
        alert('Jabatan asesor harus diisi');
        return;
      }
      if (!form.instansi_asesor.trim()) {
        alert('Instansi asesor harus diisi');
        return;
      }
    } else if (!selectedAsesor || selectedAsesor.id <= 0) {
      alert('Pilih asesor yang ada atau buat asesor baru');
      return;
    }
    
    // Check tipe sertifikat
    if (form.tipe_sertifikat.length === 0) {
      alert('Minimal pilih satu tipe sertifikat');
      return;
    }
    
    // Check modul
    if (modul.length === 0) {
      alert('Minimal tambahkan satu modul');
      return;
    }
    
    // Check batch
    if (batch.length === 0) {
      alert('Minimal atur satu batch');
      return;
    }
    
    setSaving(true);
    
    const fd = new FormData();
    
    // Basic sertifikasi data
    fd.append('nama_sertifikasi', form.nama_sertifikasi);
    fd.append('jenis_sertifikasi', form.jenis_sertifikasi);
    fd.append('deskripsi', form.deskripsi);
    
    // Thumbnail
    if (form.thumbnail) {
      fd.append('thumbnail', form.thumbnail);
    }
    
    // Asesor handling - conditional based on mode
    if (isCreatingNewAsesor) {
      // Mode buat asesor baru - kirim data asesor baru
      fd.append('nama_asesor', form.nama_asesor);
      fd.append('jabatan_asesor', form.jabatan_asesor);
      fd.append('instansi_asesor', form.instansi_asesor);
      if (form.foto_asesor) {
        fd.append('foto_asesor', form.foto_asesor);
      }
      // Tidak perlu kirim asesor_id karena akan dibuat baru
    } else if (selectedAsesor && selectedAsesor.id > 0) {
      // Mode pilih asesor existing
      fd.append('asesor_id', selectedAsesor.id.toString());
      // Jika ada foto baru untuk asesor existing
      if (form.foto_asesor) {
        fd.append('foto_asesor', form.foto_asesor);
      }
    }
    
    // Tipe sertifikat
    form.tipe_sertifikat.forEach(tipe => {
      fd.append('tipe_sertifikat[]', tipe);
    });
    
    // Modul data
    const sortedModul = [...modul].sort((a,b)=>a.order-b.order);
    sortedModul.forEach((m:ModulItem,i:number)=>{
      fd.append(`modul[${i}][judul]`, m.judul);
      fd.append(`modul[${i}][deskripsi]`, m.deskripsi);
      fd.append(`modul[${i}][order]`, String(i));
    });
    
    // Batch data
    batch.forEach((b:BatchItem,i:number)=>{
      fd.append(`batch[${i}][nama_batch]`, b.nama_batch);
      fd.append(`batch[${i}][tanggal_mulai]`, b.tanggal_mulai);
      fd.append(`batch[${i}][tanggal_selesai]`, b.tanggal_selesai);
      fd.append(`batch[${i}][status]`, b.status);
    });
    
    // Debug: Log what we're sending
    console.log('Form submission data:');
    console.log('isCreatingNewAsesor:', isCreatingNewAsesor);
    console.log('selectedAsesor:', selectedAsesor);
    console.log('Form data entries:');
    for (const pair of fd.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    const url = isEdit && s?.id ? `/admin/sertifikasi/${s.id}?_method=PUT` : '/admin/sertifikasi';
    
    router.post(url, fd, { 
      forceFormData: true, 
      onFinish: () => setSaving(false), 
      onSuccess: () => { 
        if(isEdit){ 
          window.scrollTo({ top:0, behavior:'smooth' }); 
        } 
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        // Scroll to top to show validation errors
        window.scrollTo({ top:0, behavior:'smooth' });
      }
    });
  };

  const toggleTipeSertifikat = (opt:string) => {
    setForm(f=>{
      const checked = f.tipe_sertifikat.includes(opt);
      return {
        ...f,
        tipe_sertifikat: checked ? f.tipe_sertifikat.filter(x=>x!==opt) : [...f.tipe_sertifikat, opt]
      };
    });
  };

  const renderThumbnail = () => {
    if (form.thumbnail) return <img src={URL.createObjectURL(form.thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />;
    if (s?.thumbnail_url) return <img src={s.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />;
    return <div className="text-center text-gray-400"><div className="text-2xl mb-2">📷</div><div className="text-sm">Upload Thumbnail</div></div>;
  };

  const renderFotoAsesor = () => {
    // Prioritaskan foto yang baru dipilih
    if (form.foto_asesor) {
      return <img src={URL.createObjectURL(form.foto_asesor)} alt="Foto Asesor" className="w-full h-full object-cover" />;
    }
    // Jika tidak ada foto baru dan sedang tidak membuat asesor baru, tampilkan foto yang sudah ada
    if (!isCreatingNewAsesor && selectedAsesor?.foto_asesor_url) {
      return <img src={selectedAsesor.foto_asesor_url} alt={selectedAsesor.name} className="w-full h-full object-cover" />;
    }
    // Placeholder
    return (
      <div className="text-center text-gray-400">
        <div className="text-2xl mb-1">👤</div>
        <div className="text-xs">
          {isCreatingNewAsesor ? 'Upload Foto' : selectedAsesor ? 'Ganti Foto' : 'Foto Asesor'}
        </div>
      </div>
    );
  };

  const handleAsesorChange = (asesorOption: AsesorOption | null) => {
    if (asesorOption && asesorOption.id > 0) {
      // Pilih asesor yang sudah ada
      setSelectedAsesor(asesorOption);
      setIsCreatingNewAsesor(false);
      setForm(f => ({ 
        ...f, 
        asesor_id: asesorOption.id,
        nama_asesor: '',
        jabatan_asesor: '',
        instansi_asesor: '',
        foto_asesor: null // Reset foto saat ganti asesor
      }));
    } else {
      // Mode buat asesor baru
      setSelectedAsesor(null);
      setIsCreatingNewAsesor(true);
      setForm(f => ({ 
        ...f, 
        asesor_id: null,
        nama_asesor: asesorOption?.name || '',
        jabatan_asesor: '',
        instansi_asesor: '',
        foto_asesor: null
      }));
    }
  };

  const handleCreateNewAsesorClick = () => {
    setSelectedAsesor(null);
    setIsCreatingNewAsesor(true);
    setForm(f => ({ 
      ...f, 
      asesor_id: null,
      nama_asesor: '',
      jabatan_asesor: '',
      instansi_asesor: '',
      foto_asesor: null // Reset foto saat buat asesor baru
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Edit Sertifikasi' : 'Buat Sertifikasi'} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm"><Link href="/admin/sertifikasi-kompetensi"><ArrowLeft className="h-4 w-4" /></Link></Button>
            <div>
              <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Sertifikasi' : 'Buat Sertifikasi Kompetensi'}</h1>
              <p className="text-muted-foreground">{isEdit ? 'Perbarui informasi sertifikasi' : 'Tambahkan program sertifikasi baru'}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Detail Sertifikasi</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Sertifikasi</Label>
                  <button
                    type="button"
                    className="aspect-video w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden hover:bg-gray-50 transition-colors"
                    onClick={()=>document.getElementById('thumbnail')?.click()}
                  >
          {renderThumbnail()}
          <Input id="thumbnail" type="file" accept="image/*" onChange={e=>setForm(f=>({...f, thumbnail:e.target.files?.[0]||null}))} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama_sertifikasi">Nama Sertifikasi</Label>
          <Input id="nama_sertifikasi" value={form.nama_sertifikasi} onChange={e=>setForm(f=>({...f, nama_sertifikasi:e.target.value}))} placeholder="Masukkan nama sertifikasi" required />
                    {errors.nama_sertifikasi && <p className="text-xs text-red-600">{errors.nama_sertifikasi}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenis_sertifikasi">Jenis Sertifikasi</Label>
                    <Select value={form.jenis_sertifikasi} onValueChange={v=>setForm(f=>({...f, jenis_sertifikasi:v}))}>
                      <SelectTrigger><SelectValue placeholder="Pilih jenis sertifikasi" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Industri">Sertifikat Industri</SelectItem>
                        <SelectItem value="BNSP">Sertifikat BNSP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Tipe sertifikat tunggal dihilangkan; multi pilih ada di bagian bawah */}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Sertifikasi</Label>
        <Textarea id="deskripsi" value={form.deskripsi} onChange={e=>setForm(f=>({...f, deskripsi:e.target.value}))} rows={4} placeholder="Deskripsi lengkap" required />
                {errors.deskripsi && <p className="text-xs text-red-600">{errors.deskripsi}</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><div className="flex items-center justify-between"><CardTitle>Modul Sertifikasi</CardTitle><Button type="button" onClick={handleAddModul} className="flex items-center gap-2" variant="outline"><Plus className="h-4 w-4" />Tambah Modul</Button></div></CardHeader>
            <CardContent>
              {modul.length? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={modul.map(m=>m.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {sortedModul.map(m => (
                        <SortableModulItem key={m.id} modul={m} onEdit={handleEditModul} onDelete={handleDeleteModul} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ):<div className="text-center py-8 text-muted-foreground">Belum ada modul ditambahkan. Klik "Tambah Modul" untuk memulai.</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Pengaturan Jadwal Batch</CardTitle><Button type="button" onClick={handleAddBatch} className="flex items-center gap-2" variant="outline"><Plus className="h-4 w-4" />Atur Batch</Button></div></CardHeader>
            <CardContent>
              {batch.length ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Mulai</TableHead><TableHead>Selesai</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {batch.map(b => {
                      let badgeClass = 'bg-yellow-100 text-yellow-800';
                      if (b.status==='Aktif') badgeClass = 'bg-green-100 text-green-800';
                      else if (b.status==='Selesai') badgeClass = 'bg-gray-100 text-gray-800';
                      return (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.nama_batch}</TableCell>
                          <TableCell>{b.tanggal_mulai}</TableCell>
                          <TableCell>{b.tanggal_selesai}</TableCell>
                          <TableCell><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>{b.status}</span></TableCell>
                          <TableCell><div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="sm" onClick={()=>handleEditBatch(b)}><Edit className="h-4 w-4" /></Button>
                            <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={()=>handleDeleteBatch(b.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : <div className="text-center py-8 text-muted-foreground">Belum ada batch dijadwalkan. Klik "Atur Batch" untuk menambahkan jadwal.</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Detail Asesor</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="space-y-2">
                  <Label>Foto Asesor</Label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        document.getElementById('foto_asesor')?.click();
                      }}
                    >
                      {renderFotoAsesor()}
                    </button>
                    <Input 
                      id="foto_asesor" 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setForm(f => ({...f, foto_asesor: e.target.files?.[0] || null}))} 
                      className="hidden" 
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="nama_asesor">Nama Asesor <span className="text-red-500">*</span></Label>
                      {!isCreatingNewAsesor && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleCreateNewAsesorClick}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          + Buat Baru
                        </Button>
                      )}
                    </div>
                    {isCreatingNewAsesor ? (
                      <Input 
                        id="nama_asesor" 
                        value={form.nama_asesor} 
                        onChange={e => setForm(f => ({...f, nama_asesor: e.target.value}))} 
                        placeholder="Masukkan nama asesor" 
                        required
                      />
                    ) : (
                      <>
                        <AsesorAutocomplete
                          value={selectedAsesor}
                          onChange={handleAsesorChange}
                          placeholder="Cari dan pilih asesor atau ketik nama baru..."
                          error={errors.asesor_id || errors.nama_asesor}
                          allowCreate={true}
                        />
                        {selectedAsesor && (
                          <div className="text-sm text-green-600 bg-green-50 p-2 rounded border">
                            ✓ Dipilih: {selectedAsesor.name}
                          </div>
                        )}
                      </>
                    )}
                    {(errors.asesor_id || errors.nama_asesor) && (
                      <p className="text-xs text-red-600">{errors.asesor_id || errors.nama_asesor}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jabatan_asesor">Jabatan {isCreatingNewAsesor && <span className="text-red-500">*</span>}</Label>
                    <Input 
                      id="jabatan_asesor" 
                      value={isCreatingNewAsesor ? form.jabatan_asesor : (selectedAsesor?.jabatan || '')} 
                      onChange={isCreatingNewAsesor ? (e => setForm(f => ({...f, jabatan_asesor: e.target.value}))) : undefined}
                      readOnly={!isCreatingNewAsesor}
                      placeholder={isCreatingNewAsesor ? "Masukkan jabatan asesor" : "Jabatan akan terisi otomatis"} 
                      className={!isCreatingNewAsesor ? "bg-gray-50" : ""}
                      required={isCreatingNewAsesor}
                    />
                    {errors.jabatan_asesor && (
                      <p className="text-xs text-red-600">{errors.jabatan_asesor}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instansi_asesor">Instansi {isCreatingNewAsesor && <span className="text-red-500">*</span>}</Label>
                    <Input 
                      id="instansi_asesor" 
                      value={isCreatingNewAsesor ? form.instansi_asesor : (selectedAsesor?.instansi || '')} 
                      onChange={isCreatingNewAsesor ? (e => setForm(f => ({...f, instansi_asesor: e.target.value}))) : undefined}
                      readOnly={!isCreatingNewAsesor}
                      placeholder={isCreatingNewAsesor ? "Masukkan instansi asesor" : "Instansi akan terisi otomatis"} 
                      className={!isCreatingNewAsesor ? "bg-gray-50" : ""}
                      required={isCreatingNewAsesor}
                    />
                    {errors.instansi_asesor && (
                      <p className="text-xs text-red-600">{errors.instansi_asesor}</p>
                    )}
                  </div>
                  {!isCreatingNewAsesor && selectedAsesor && (
                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground">
                        Pilih asesor yang sudah ada atau klik tombol "Buat Baru" untuk menambahkan asesor baru.
                      </div>
                    </div>
                  )}
                  {isCreatingNewAsesor && (
                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsCreatingNewAsesor(false);
                          setSelectedAsesor(null);
                          setForm(f => ({ 
                            ...f, 
                            asesor_id: null,
                            nama_asesor: '',
                            jabatan_asesor: '',
                            instansi_asesor: '',
                            foto_asesor: null
                          }));
                        }}
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        Pilih dari Database
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sertifikat yang Didapatkan</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Pilih Tipe Sertifikat (bisa lebih dari satu)</Label>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {['Sertifikat Keahlian','Sertifikat Kompetensi','Sertifikat Pelatihan'].map(opt => {
                    const checked = form.tipe_sertifikat.includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm border rounded-md p-2 cursor-pointer hover:bg-accent">
                        <input type="checkbox" className="h-4 w-4" checked={checked} onChange={()=>toggleTipeSertifikat(opt)} />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.tipe_sertifikat && <p className="text-xs text-red-600">{errors.tipe_sertifikat}</p>}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center gap-4 pt-2">
            <Button asChild variant="outline"><Link href="/admin/sertifikasi-kompetensi">Batal</Link></Button>
            <Button type="submit" disabled={saving} className="flex items-center gap-2"><Save className="h-4 w-4" />{submitLabel}</Button>
          </div>
        </form>
        <Dialog open={isModulModalOpen} onOpenChange={setIsModulModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingModul? 'Edit Modul':'Tambah Modul'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label htmlFor="judulModul">Judul Modul</Label><Input id="judulModul" value={modulForm.judul} onChange={e=>setModulForm({...modulForm, judul:e.target.value})} placeholder="Judul modul" /></div>
              <div className="space-y-2"><Label htmlFor="deskripsiModul">Deskripsi</Label><Textarea id="deskripsiModul" value={modulForm.deskripsi} onChange={e=>setModulForm({...modulForm, deskripsi:e.target.value})} rows={3} placeholder="Deskripsi modul" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setIsModulModalOpen(false)}>Batal</Button>
              <Button onClick={handleSaveModul}>{editingModul? 'Simpan Perubahan':'Tambah Modul'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingBatch? 'Edit Batch':'Atur Batch'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label htmlFor="namaBatch">Nama Batch</Label><Input id="namaBatch" value={batchForm.nama_batch} onChange={e=>setBatchForm({...batchForm, nama_batch:e.target.value})} placeholder="Contoh: Batch 1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="tanggalMulai">Tanggal Mulai</Label><Input id="tanggalMulai" type="date" value={batchForm.tanggal_mulai} onChange={e=>setBatchForm({...batchForm, tanggal_mulai:e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="tanggalSelesai">Tanggal Selesai</Label><Input id="tanggalSelesai" type="date" value={batchForm.tanggal_selesai} onChange={e=>setBatchForm({...batchForm, tanggal_selesai:e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="statusBatch">Status</Label><Select value={batchForm.status} onValueChange={v=>setBatchForm({...batchForm, status:v as BatchItem['status']})}><SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger><SelectContent><SelectItem value="Draf">Draf</SelectItem><SelectItem value="Aktif">Aktif</SelectItem><SelectItem value="Selesai">Selesai</SelectItem><SelectItem value="Ditutup">Ditutup</SelectItem></SelectContent></Select></div>
              {/* field kuota sudah dibersihkan */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setIsBatchModalOpen(false)}>Batal</Button>
              <Button onClick={handleSaveBatch}>{editingBatch? 'Simpan Perubahan':'Tambah Batch'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
