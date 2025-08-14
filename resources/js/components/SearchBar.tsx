import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly onSearch?: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Cari...',
  className = 'w-64'
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
    onSearch?.(newValue);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
