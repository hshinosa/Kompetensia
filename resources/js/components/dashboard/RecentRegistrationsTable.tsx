import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Filter, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import SearchBar from '@/components/SearchBar';
import { FilterDropdown, type ActiveFilters } from '@/components/dashboard/FilterDropdown';

export interface RegistrationRow { 
  id: string; 
  original_id: number;
  user_id: number;
  nama: string; 
  full_name: string;
  jenis: string; 
  program: string; 
  batch?: string | null; 
  tanggal: string; 
  status: string;
  type: string;
}

interface RecentRegistrationsTableProps { 
  readonly rows: RegistrationRow[];
  readonly onApprove?: (registration: RegistrationRow) => void;
  readonly search?: string;
  readonly onSearchChange?: (search: string) => void;
  readonly activeFilters?: ActiveFilters;
  readonly onFiltersChange?: (filters: ActiveFilters) => void;
}

export function RecentRegistrationsTable({ 
  rows, 
  onApprove, 
  search = '', 
  onSearchChange, 
  activeFilters, 
  onFiltersChange 
}: RecentRegistrationsTableProps) {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'menunggu':
      case 'pengajuan':
        return 'secondary';
      case 'approved':
      case 'disetujui':
        return 'default';
      case 'rejected':
      case 'ditolak':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleApprove = (registration: RegistrationRow) => {
    if (onApprove) {
      onApprove(registration);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-base font-semibold">Pendaftaran Terbaru</CardTitle>
          <div className="flex gap-2 items-center flex-wrap">
            {onSearchChange && (
              <SearchBar 
                value={search} 
                onChange={onSearchChange} 
                placeholder="Cari pendaftaran..." 
              />
            )}
            {onFiltersChange && activeFilters && (
              <FilterDropdown 
                activeFilters={activeFilters} 
                onFiltersChange={onFiltersChange} 
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto px-4 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden md:table-cell">Jenis</TableHead>
                <TableHead className="hidden md:table-cell">Program</TableHead>
                <TableHead className="hidden md:table-cell">Batch</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows?.length ? rows.map((r, idx) => (
                <TableRow key={r.id} className="hover:bg-muted/50">
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium max-w-[180px]">
                    <div className="flex items-center gap-2">
                      {r.full_name || r.nama}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{r.jenis}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.program}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.batch || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.tanggal}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(r.status)}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(r)}
                      className="h-8 px-2 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={8} className="text-center py-6 text-muted-foreground">Belum ada data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
