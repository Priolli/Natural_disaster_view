import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 ${color} mr-2`} />
        <div className="text-sm text-gray-500">{title}</div>
      </div>
      <div className="flex items-baseline">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`ml-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    </div>
  );
};

export default StatCard;