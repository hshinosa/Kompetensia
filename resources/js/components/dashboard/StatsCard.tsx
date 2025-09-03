import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatsCardProps { 
  readonly label: string; 
  readonly value: number | string; 
  readonly className?: string; 
  readonly icon?: ReactNode; 
  readonly iconColor?: string;
  readonly onClick?: () => void;
  readonly isClickable?: boolean;
}

export function StatsCard({ label, value, className, icon, iconColor, onClick, isClickable = false }: StatsCardProps) {
  const colorClasses = iconColor || 'text-primary bg-primary/10';
  const baseClasses = ['p-6', className].filter(Boolean).join(' ');
  const clickableClasses = isClickable || onClick ? 
    'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2' : 
    '';
  
  const cardClasses = [baseClasses, clickableClasses].filter(Boolean).join(' ');

  const CardWrapper = onClick ? 'button' : 'div';
  
  return (
    <CardWrapper 
      className={onClick ? 'w-full text-left' : ''} 
      onClick={onClick}
      disabled={!onClick}
    >
      <Card className={cardClasses}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4">
            {icon && (
              <div className={["rounded-lg p-3 flex items-center justify-center flex-shrink-0", colorClasses].join(' ')}>
                {icon}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <CardTitle className="text-sm font-medium text-muted-foreground mb-1 leading-tight">
                {label}
              </CardTitle>
              <div className="text-2xl font-bold leading-none tracking-tight">
                {value}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
