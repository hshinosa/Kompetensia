import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';

export interface ActiveFilters {
  jenisPendaftaran: string[];
  tanggalPendaftaran: { startDate: string; endDate: string } | null;
  status: string[];
}

interface FilterDropdownProps {
  readonly onFiltersChange: (filters: ActiveFilters) => void;
  readonly activeFilters: ActiveFilters;
}

const JENIS_OPTIONS = [
  { value: 'Sertifikasi Kompetensi', label: 'Sertifikasi Kompetensi' },
  { value: 'Praktik Kerja Lapangan', label: 'Praktik Kerja Lapangan' }
];
const STATUS_OPTIONS = [
  { value: 'Pengajuan', label: 'Pengajuan' },
  { value: 'Disetujui', label: 'Disetujui' },
  { value: 'Ditolak', label: 'Ditolak' }
];

export function FilterDropdown({ onFiltersChange, activeFilters }: FilterDropdownProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleArrayFilter = (key: 'jenisPendaftaran' | 'status', value: string) => {
    const list = activeFilters[key];
    const newList = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    onFiltersChange({ ...activeFilters, [key]: newList });
  };

  const applyDate = () => {
    if (startDate || endDate) {
      onFiltersChange({ ...activeFilters, tanggalPendaftaran: { startDate, endDate } });
    }
  };
  const clearDate = () => {
    setStartDate(''); setEndDate('');
    onFiltersChange({ ...activeFilters, tanggalPendaftaran: null });
  };
  const clearAll = () => {
    setStartDate(''); setEndDate('');
    onFiltersChange({ jenisPendaftaran: [], tanggalPendaftaran: null, status: [] });
  };

  const totalActive = activeFilters.jenisPendaftaran.length + activeFilters.status.length + (activeFilters.tanggalPendaftaran ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />Filter
            {totalActive > 0 && <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs h-5 min-w-5 flex items-center justify-center">{totalActive}</Badge>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end">
          <DropdownMenuLabel>Jenis Pendaftaran</DropdownMenuLabel>
          <DropdownMenuGroup>
            {JENIS_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={()=>toggleArrayFilter('jenisPendaftaran', opt.value)} className="flex items-center justify-between cursor-pointer">
                <span>{opt.label}</span>
                {activeFilters.jenisPendaftaran.includes(opt.value) && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Tanggal Pendaftaran</DropdownMenuLabel>
          <DropdownMenuGroup>
            <div className="px-2 py-1 space-y-2">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">Dari</span>
                <Input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="text-xs" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">Sampai</span>
                <Input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="text-xs" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={applyDate} className="flex-1 text-xs" disabled={!startDate && !endDate}>Terapkan</Button>
                {activeFilters.tanggalPendaftaran && <Button size="sm" variant="outline" onClick={clearDate} className="flex-1 text-xs">Hapus</Button>}
              </div>
              {activeFilters.tanggalPendaftaran && (
                <div className="text-xs text-muted-foreground px-1">
                  {activeFilters.tanggalPendaftaran.startDate || '-'}
                  {activeFilters.tanggalPendaftaran.endDate && ' - '+activeFilters.tanggalPendaftaran.endDate}
                </div>
              )}
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuGroup>
            {STATUS_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={()=>toggleArrayFilter('status', opt.value)} className="flex items-center justify-between cursor-pointer">
                <span>{opt.label}</span>
                {activeFilters.status.includes(opt.value) && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {totalActive>0 && <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAll} className="text-destructive cursor-pointer">Reset Semua</DropdownMenuItem>
          </>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
