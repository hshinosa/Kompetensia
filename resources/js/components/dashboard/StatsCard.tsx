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
  // Use purple accent colors to match client dashboard
  const colorClasses = iconColor || 'text-purple-600 bg-purple-100';
  const baseClasses = ['p-6', className].filter(Boolean).join(' ');
  const clickableClasses = isClickable || onClick ? 
    'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2' : 
    '';
  
  const cardClasses = [baseClasses, clickableClasses].filter(Boolean).join(' ');

  const CardWrapper = onClick ? 'button' : 'div';
  
  return (
    <CardWrapper 
      className={onClick ? 'w-full text-left' : ''} 
      onClick={onClick}
      disabled={!onClick}
    >
      <Card className={`${cardClasses} border-2 border-purple-300`}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4">
            {icon && (
              <div className={["rounded-xl p-3 flex items-center justify-center flex-shrink-0", colorClasses].join(' ')}>
                {icon}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <CardTitle className="text-sm font-medium text-gray-600 mb-1 leading-tight">
                {label}
              </CardTitle>
              <div className="text-2xl font-bold leading-none tracking-tight text-gray-900">
                {value}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
