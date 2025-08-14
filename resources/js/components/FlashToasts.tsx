import React from 'react';
import { usePage } from '@inertiajs/react';

interface FlashBag { success?: string; error?: string }
type ErrorBag = Record<string, string | string[]>;
interface PageProps extends Record<string, unknown> { flash?: FlashBag; errors?: ErrorBag }

export const FlashToasts: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { flash, errors } = props;
  const [visible, setVisible] = React.useState(true);
  React.useEffect(()=>{ if(flash?.success || flash?.error){ setVisible(true); const t=setTimeout(()=>setVisible(false),4000); return ()=>clearTimeout(t);} },[flash]);
  if(!visible) return null;
  const message = flash?.success || flash?.error || null;
  let type: 'success' | 'error' | null = null;
  if (flash?.success) type='success'; else if(flash?.error) type='error';
  if(!message) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm rounded shadow-lg px-4 py-3 text-sm text-white ${type==='success'?'bg-emerald-600':'bg-red-600'}`}>
      <div className="font-semibold mb-1">{type==='success'?'Berhasil':'Terjadi Kesalahan'}</div>
      <div>{message}</div>
    {type==='error' && errors && Object.keys(errors).length>0 && (
        <ul className="mt-2 list-disc list-inside space-y-0.5 opacity-90">
      {Object.entries(errors).slice(0,3).map(([k,v])=> <li key={k}>{Array.isArray(v)? v.join(', '): v}</li>)}
          {Object.entries(errors).length>3 && <li>Dan lainnya...</li>}
        </ul>
      )}
    </div>
  );
};
