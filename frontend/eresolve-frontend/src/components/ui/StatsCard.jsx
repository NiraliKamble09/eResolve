import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  bgColor = 'bg-slate-50',
  textColor = 'text-slate-600',
  valueColor = 'text-slate-800',
  iconColor = 'text-slate-500',
  onClick = null,
  loading = false
}) => {
  const CardWrapper = onClick ? 'button' : 'div';
  
  return (
    <CardWrapper
      onClick={onClick}
      className={`
        ${bgColor} rounded-lg p-6 border border-slate-200
        ${onClick ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor} text-sm font-medium`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${valueColor}`}>
            {loading ? '...' : value}
          </p>
        </div>
        {Icon && (
          <Icon className={`w-8 h-8 ${iconColor}`} />
        )}
      </div>
    </CardWrapper>
  );
};

export default StatsCard;
