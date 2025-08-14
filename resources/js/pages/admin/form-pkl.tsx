import React from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface PKL { 
  id: number; 
  nama_program?: string; 
  kategori?: string;
  posisi?: string;
  tipe_kerja?: string;
  durasi?: string;
  lokasi?: string; 
  status?: string;
}
interface PageProps extends Record<string, unknown> { pkl?: PKL; isEdit?: boolean; errors?: Record<string,string> }
const FormPKLPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { pkl, isEdit, errors } = props;
  const [namaProgram, setNamaProgram] = React.useState<string>(pkl?.nama_program || '');
  const [kategori, setKategori] = React.useState<string>(pkl?.kategori || 'Developer');
  const [posisi, setPosisi] = React.useState<string>(pkl?.posisi || '');
  const [tipeKerja, setTipeKerja] = React.useState<string>(pkl?.tipe_kerja || 'Full-time');
  const [durasi, setDurasi] = React.useState<string>(pkl?.durasi || '3 Bulan');
  const [lokasi, setLokasi] = React.useState<string>(pkl?.lokasi || '');
  const [statusProgram, setStatusProgram] = React.useState<string>(pkl?.status || 'Draft');

  const submit = (e:React.FormEvent)=>{
    e.preventDefault();
    const data = { 
      nama_program: namaProgram, 
      kategori,
      posisi,
      tipe_kerja: tipeKerja,
      durasi,
      lokasi, 
      status: statusProgram 
    };
    if(isEdit){
      if (pkl) router.post(`/admin/pkl/${pkl.id}`, { ...data, _method:'PUT' });
    } else {
      router.post('/admin/pkl', data);
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title:'Dashboard', href:'/dashboard' },
    { title:'PKL', href:'/admin/praktik-kerja-lapangan' },
    { title: isEdit ? 'Edit' : 'Buat', href:'#' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Edit PKL' : 'Buat PKL'} />
      <div className="p-6">
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{isEdit ? 'Edit Program PKL' : 'Buat Program PKL'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="nama_program" className="block text-sm font-medium mb-1">Nama Program</label>
                <input id="nama_program" value={namaProgram} onChange={e=>setNamaProgram(e.target.value)} className="w-full border rounded px-3 py-2" required />
                {errors?.nama_program && <p className="text-xs text-red-600 mt-1">{errors.nama_program}</p>}
              </div>
              
              <div>
                <label htmlFor="kategori" className="block text-sm font-medium mb-1">Kategori</label>
                <select id="kategori" value={kategori} onChange={e=>setKategori(e.target.value)} className="w-full border rounded px-3 py-2">
                  {['Developer', 'Kreatif', 'Marketing', 'Data Analyst', 'Quality Assurance', 'Lainnya'].map(k=> <option key={k} value={k}>{k}</option>)}
                </select>
                {errors?.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori}</p>}
              </div>

              <div>
                <label htmlFor="posisi" className="block text-sm font-medium mb-1">Posisi</label>
                <input id="posisi" value={posisi} onChange={e=>setPosisi(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Contoh: Frontend Developer, UI/UX Designer" />
                {errors?.posisi && <p className="text-xs text-red-600 mt-1">{errors.posisi}</p>}
              </div>

              <div>
                <label htmlFor="tipe_kerja" className="block text-sm font-medium mb-1">Tipe Kerja</label>
                <select id="tipe_kerja" value={tipeKerja} onChange={e=>setTipeKerja(e.target.value)} className="w-full border rounded px-3 py-2">
                  {['Full-time', 'Part-time', 'Remote', 'Hybrid'].map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
                {errors?.tipe_kerja && <p className="text-xs text-red-600 mt-1">{errors.tipe_kerja}</p>}
              </div>

              <div>
                <label htmlFor="durasi" className="block text-sm font-medium mb-1">Durasi</label>
                <select id="durasi" value={durasi} onChange={e=>setDurasi(e.target.value)} className="w-full border rounded px-3 py-2">
                  {['1 Bulan', '2 Bulan', '3 Bulan', '4 Bulan', '5 Bulan', '6 Bulan'].map(d=> <option key={d} value={d}>{d}</option>)}
                </select>
                {errors?.durasi && <p className="text-xs text-red-600 mt-1">{errors.durasi}</p>}
              </div>

              <div>
                <label htmlFor="lokasi" className="block text-sm font-medium mb-1">Lokasi</label>
                <input id="lokasi" value={lokasi} onChange={e=>setLokasi(e.target.value)} className="w-full border rounded px-3 py-2" />
                {errors?.lokasi && <p className="text-xs text-red-600 mt-1">{errors.lokasi}</p>}
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                <select id="status" value={statusProgram} onChange={e=>setStatusProgram(e.target.value)} className="w-full border rounded px-3 py-2">
                  {['Draft','Aktif','Selesai','Ditutup'].map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
                {errors?.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={()=>router.get('/admin/praktik-kerja-lapangan')}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FormPKLPage;
