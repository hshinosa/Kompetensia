import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

export interface BlogActiveFilters {
  status: string;
  jenis_konten: string;
  featured: string;
}

interface BlogFilterDropdownProps {
  readonly onFiltersChange: (filters: BlogActiveFilters) => void;
  readonly activeFilters: BlogActiveFilters;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Publish', label: 'Publish' }
];

const JENIS_OPTIONS = [
  { value: '', label: 'Semua Jenis' },
  { value: 'Blog', label: 'Blog' },
  { value: 'News', label: 'News' },
  { value: 'Tutorial', label: 'Tutorial' }
];

const FEATURED_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'true', label: 'Ya' },
  { value: 'false', label: 'Tidak' }
];

export function BlogFilterDropdown({ onFiltersChange, activeFilters }: BlogFilterDropdownProps) {
  const handleFilterChange = (key: keyof BlogActiveFilters, value: string) => {
    onFiltersChange({ ...activeFilters, [key]: value });
  };

  const clearAll = () => {
    onFiltersChange({ status: '', jenis_konten: '', featured: '' });
  };

  const totalActive = [activeFilters.status, activeFilters.jenis_konten, activeFilters.featured].filter(v => v && v !== '').length;

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
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuGroup>
            {STATUS_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={() => handleFilterChange('status', opt.value)} className="flex items-center justify-between cursor-pointer">
                <span>{opt.label}</span>
                {activeFilters.status === opt.value && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Jenis Konten</DropdownMenuLabel>
          <DropdownMenuGroup>
            {JENIS_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={() => handleFilterChange('jenis_konten', opt.value)} className="flex items-center justify-between cursor-pointer">
                <span>{opt.label}</span>
                {activeFilters.jenis_konten === opt.value && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Featured</DropdownMenuLabel>
          <DropdownMenuGroup>
            {FEATURED_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={() => handleFilterChange('featured', opt.value)} className="flex items-center justify-between cursor-pointer">
                <span>{opt.label}</span>
                {activeFilters.featured === opt.value && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {totalActive > 0 && <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAll} className="text-destructive cursor-pointer">Reset Semua</DropdownMenuItem>
          </>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
