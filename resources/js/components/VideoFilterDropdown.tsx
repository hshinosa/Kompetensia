import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

export interface VideoActiveFilters {
  status: string;
  featured: string;
}

interface VideoFilterDropdownProps {
  readonly onFiltersChange: (filters: VideoActiveFilters) => void;
  readonly activeFilters: VideoActiveFilters;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Publish', label: 'Publish' }
];

const FEATURED_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'true', label: 'Ya' },
  { value: 'false', label: 'Tidak' }
];

export function VideoFilterDropdown({ onFiltersChange, activeFilters }: VideoFilterDropdownProps) {
  const handleFilterChange = (key: keyof VideoActiveFilters, value: string) => {
    onFiltersChange({ ...activeFilters, [key]: value });
  };

  const clearAll = () => {
    onFiltersChange({ status: '', featured: '' });
  };

  const totalActive = [activeFilters.status, activeFilters.featured].filter(v => v && v !== '').length;

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
