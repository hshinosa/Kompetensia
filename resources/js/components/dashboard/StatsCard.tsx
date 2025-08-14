import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatsCardProps { readonly label:string; readonly value:number|string; readonly className?:string; readonly icon?:ReactNode; readonly iconColor?:string }
export function StatsCard({ label, value, className, icon, iconColor }:StatsCardProps) {
  const colorClasses = iconColor || 'text-primary bg-primary/10';
  return (
    <Card className={['p-6', className].filter(Boolean).join(' ')}>
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          {icon && <div className={["rounded-md p-2 flex items-center justify-center", colorClasses].join(' ')}>{icon}</div>}
          <div className="flex flex-col">
            <CardTitle className="text-sm font-medium text-muted-foreground mb-2">{label}</CardTitle>
            <div className="text-2xl font-bold leading-none tracking-tight">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
