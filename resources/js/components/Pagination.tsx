import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly itemsPerPage: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
  readonly onItemsPerPageChange?: (itemsPerPage: number) => void;
  readonly compact?: boolean; // Hide "Menampilkan ... data" text for compact mode
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  compact = false
}: PaginationProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    
    if (isMobile) {
      // Mobile: show current, one before, one after
      if (currentPage === 1) {
        pages.push(1, 2, '...', totalPages);
      } else if (currentPage === totalPages) {
        pages.push(1, '...', totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    } else {
      // Desktop: more pages visible
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Detect mobile view using window width
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pageNumbers = getPageNumbers(isMobile);

  return (
    <div className={`flex ${compact ? 'flex-col gap-2' : 'flex-col sm:flex-row gap-3 sm:gap-4'} items-start sm:items-center justify-between px-2 sm:px-4 py-3 sm:py-4`}>
      {/* Info and Items Per Page */}
      <div className={`flex ${compact ? 'flex-row' : 'flex-col sm:flex-row'} items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto`}>
        {!compact && (
          <div className="hidden md:block text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            Menampilkan {startItem}-{endItem} dari {totalItems} data
          </div>
        )}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Tampilkan</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
              <SelectTrigger className="w-14 sm:w-16 h-7 sm:h-8 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">per halaman</span>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-center sm:justify-end gap-0.5 sm:gap-1 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1} 
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
          aria-label="First page"
        >
          <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        {pageNumbers.map((page, index) => (
          <React.Fragment key={`page-${page}-${index}`}>
            {page === '...' ? (
              <span className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">...</span>
            ) : (
              <Button
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`h-7 min-w-[28px] sm:h-8 sm:min-w-[32px] px-1.5 sm:px-2 text-xs sm:text-sm flex-shrink-0 ${
                  page === currentPage 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                    : ''
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
          aria-label="Next page"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
          aria-label="Last page"
        >
          <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
