import React from 'react';
import { cn } from '@/lib/utils';

interface FilterField { name: string; placeholder?: string; type?: 'text' | 'select'; options?: { label: string; value: string }[] }
interface Props<V extends Record<string, string>> {
  fields: FilterField[];
  values: V;
  onChange: (name: keyof V & string, value: string) => void;
  rightSlot?: React.ReactNode;
  className?: string;
}
function DataFilterBar<V extends Record<string, string>>({ fields, values, onChange, rightSlot, className }: Props<V>) {
  return (
    <div className={cn('flex flex-wrap gap-2 items-center', className)}>
      {fields.map(f => f.type === 'select' ? (
        <select key={f.name} value={values[f.name] ?? ''} onChange={e=>onChange(f.name,e.target.value)} className="border px-2 py-1 rounded text-sm">
          <option value="">{f.placeholder || f.name}</option>
          {f.options?.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input key={f.name} value={values[f.name] ?? ''} onChange={e=>onChange(f.name,e.target.value)} placeholder={f.placeholder} className="border px-2 py-1 rounded text-sm" />
      ))}
      {rightSlot}
    </div>
  );
}

export default DataFilterBar;
