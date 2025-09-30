import React from 'react';

interface StatCardProps {
  href?: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  href,
  label,
  value,
  icon,
  iconBgColor = 'bg-purple-100',
  borderColor = 'border-purple-300',
  hoverBorderColor = 'hover:border-purple-400',
}) => {
  const cardContent = (
    <div className={`bg-white rounded-xl border-2 ${borderColor} p-6 hover:shadow-lg ${hoverBorderColor} transition-all ${href ? 'cursor-pointer' : ''}`}>  
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>{icon}</div>
        <div className="text-right">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{label}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return href ? <a href={href}>{cardContent}</a> : cardContent;
};

export default StatCard;
