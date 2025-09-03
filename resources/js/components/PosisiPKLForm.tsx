import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';

type WorkType = 'WFH' | 'WFO' | 'Hybrid';
type PosisiStatus = 'Aktif' | 'Draf' | 'Ditutup';

export interface PosisiPKLData {
  id: number;
  namaPosisi: string;
  kategoriPosisi: string;
  durasi: string;
  wfhWfoHybrid: WorkType;
  deskripsi: string;
  requirements: string[];
  benefits: string[];
  pesertaTerdaftar: number;
  status: PosisiStatus;
  tanggalDibuat: string;
  tanggalDiperbarui: string;
}

interface PosisiPKLFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: PosisiPKLData) => void;
  readonly editData?: PosisiPKLData | null;
}

export default function PosisiPKLForm({ isOpen, onClose, onSave, editData }: PosisiPKLFormProps) {
  const [formData, setFormData] = useState({
    namaPosisi: '',
    kategoriPosisi: '',
    durasi: '',
    wfhWfoHybrid: 'Hybrid' as WorkType,
    deskripsi: '',
    requirements: '',
    benefits: '',
    status: 'Draf' as PosisiStatus
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or edit data changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          namaPosisi: editData.namaPosisi,
          kategoriPosisi: editData.kategoriPosisi,
          durasi: editData.durasi,
          wfhWfoHybrid: editData.wfhWfoHybrid,
          deskripsi: editData.deskripsi,
          requirements: editData.requirements.join('\n'),
          benefits: editData.benefits.join('\n'),
          status: editData.status
        });
      } else {
        setFormData({
          namaPosisi: '',
          kategoriPosisi: '',
          durasi: '',
          wfhWfoHybrid: 'Hybrid',
          deskripsi: '',
          requirements: '',
          benefits: '',
          status: 'Draf'
        });
      }
    }
  }, [isOpen, editData]);

  const handleSave = async () => {
    // Validate required fields: benefit, persyaratan, deskripsi, nama_posisi
    if (!formData.namaPosisi || !formData.kategoriPosisi || !formData.deskripsi || 
        !formData.requirements.trim() || !formData.benefits.trim()) {
      // Remove 'dan Lokasi' from the alert message
      alert('Mohon lengkapi semua field yang wajib diisi: Nama Posisi, Kategori, Deskripsi, Persyaratan, dan Benefit');
      return;
    }

    setIsLoading(true);

    // Prepare values to avoid nested ternaries
    let tipeKerja: 'Remote' | 'Full-time' | 'Hybrid';
    if (formData.wfhWfoHybrid === 'WFH') {
      tipeKerja = 'Remote';
    } else if (formData.wfhWfoHybrid === 'WFO') {
      tipeKerja = 'Full-time';
    } else {
      tipeKerja = 'Hybrid';
    }

    let durasiBulan: number;
    if (formData.durasi === 'Project-Based') {
      durasiBulan = 1;
    } else if (formData.durasi === '1 Tahun') {
      durasiBulan = 12;
    } else {
      durasiBulan = parseInt(formData.durasi.replace(' Bulan', ''), 10) || 3;
    }

    let statusDb: 'Aktif' | 'Non-Aktif' | 'Penuh';
    if (formData.status === 'Draf') {
      statusDb = 'Non-Aktif';
    } else if (formData.status === 'Ditutup') {
      statusDb = 'Penuh';
    } else {
      statusDb = 'Aktif';
    }

    // Convert UI form data to database format
    const dbData = {
      nama_posisi: formData.namaPosisi,
      kategori: formData.kategoriPosisi,
      deskripsi: formData.deskripsi,
      persyaratan: formData.requirements,
      benefits: formData.benefits,
      tipe: tipeKerja,
      durasi_bulan: durasiBulan,
      status: statusDb
    };

    try {
      if (editData) {
        router.put(`/admin/praktik-kerja-lapangan/posisi/${editData.id}`, dbData, {
          onSuccess: () => {
            onClose();
            onSave({} as PosisiPKLData); // Trigger refresh
          },
          onError: (errors) => {
            console.error('Update error:', errors);
            alert('Gagal mengupdate posisi PKL');
          },
          onFinish: () => setIsLoading(false)
        });
      } else {
        router.post('/admin/praktik-kerja-lapangan/posisi', dbData, {
          onSuccess: () => {
            onClose();
            onSave({} as PosisiPKLData); // Trigger refresh
          },
          onError: (errors) => {
            console.error('Store error:', errors);
            alert('Gagal menyimpan posisi PKL');
          },
          onFinish: () => setIsLoading(false)
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl min-w-[300px] md:min-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Posisi PKL' : 'Tambah Posisi PKL'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="namaPosisi">Nama Posisi *</Label>
              <Input 
                id="namaPosisi" 
                value={formData.namaPosisi} 
                onChange={e=>setFormData({...formData, namaPosisi:e.target.value})} 
                placeholder="Masukkan nama posisi" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kategoriPosisi">Kategori Posisi *</Label>
              <Select value={formData.kategoriPosisi} onValueChange={value=>setFormData({...formData, kategoriPosisi:value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori posisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Kreatif">Kreatif</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="durasi">Durasi *</Label>
              <Select value={formData.durasi} onValueChange={value=>setFormData({...formData, durasi:value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih durasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project-Based">Project-Based</SelectItem>
                  <SelectItem value="3 Bulan">3 Bulan</SelectItem>
                  <SelectItem value="6 Bulan">6 Bulan</SelectItem>
                  <SelectItem value="1 Tahun">1 Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wfhWfoHybrid">Tipe Kerja *</Label>
              <Select value={formData.wfhWfoHybrid} onValueChange={(value: WorkType)=>setFormData({...formData, wfhWfoHybrid:value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kerja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WFH">Work From Home</SelectItem>
                  <SelectItem value="WFO">Work From Office</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: PosisiStatus)=>setFormData({...formData, status:value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draf">Draf</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Ditutup">Ditutup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi Posisi *</Label>
            <Textarea 
              id="deskripsi" 
              value={formData.deskripsi} 
              onChange={e=>setFormData({...formData, deskripsi:e.target.value})} 
              placeholder="Masukkan deskripsi posisi" 
              rows={4} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requirements">Persyaratan * (pisahkan dengan enter)</Label>
              <Textarea 
                id="requirements" 
                value={formData.requirements} 
                onChange={e=>setFormData({...formData, requirements:e.target.value})} 
                placeholder="Requirement 1&#10;Requirement 2" 
                rows={6} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits * (pisahkan dengan enter)</Label>
              <Textarea 
                id="benefits" 
                value={formData.benefits} 
                onChange={e=>setFormData({...formData, benefits:e.target.value})} 
                placeholder="Benefit 1&#10;Benefit 2" 
                rows={6} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {(() => {
              if (isLoading) return 'Menyimpan...';
              return editData ? 'Simpan Perubahan' : 'Simpan';
            })()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
