import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import React from 'react';

export interface DashboardFilters { jenis?:string; status?:string }
interface Props { readonly value:DashboardFilters; readonly onChange:(f:DashboardFilters)=>void; }

export function DashboardFilterBar({ value, onChange }:Props) {
  const ALL = '__all';
  const setField = (k:keyof DashboardFilters, v:string|undefined) => onChange({ ...value, [k]: v });
  const handleJenis = (v:string) => setField('jenis', v===ALL? undefined : v);
  const handleStatus = (v:string) => setField('status', v===ALL? undefined : v);
  const clear = () => onChange({});
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Jenis</div>
        <Select value={value.jenis ?? ALL} onValueChange={handleJenis}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua</SelectItem>
            <SelectItem value="Sertifikasi">Sertifikasi</SelectItem>
            <SelectItem value="PKL">PKL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Status</div>
        <Select value={value.status ?? ALL} onValueChange={handleStatus}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua</SelectItem>
            <SelectItem value="Pengajuan">Pengajuan</SelectItem>
            <SelectItem value="Disetujui">Disetujui</SelectItem>
            <SelectItem value="Ditolak">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={clear}>Reset</Button>
    </div>
  );
}
