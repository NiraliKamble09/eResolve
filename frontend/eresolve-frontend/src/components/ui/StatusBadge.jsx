import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getStatusColorClasses, getStatusDisplayName } from '../../utils/helpers';

const StatusBadge = ({ status, showIcon = true, size = 'sm' }) => {
  const colorClasses = getStatusColorClasses(status);
  const displayName = getStatusDisplayName(status);

  const getStatusIcon = (status) => {
    const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch (status) {
      case 'IN_PROGRESS':
        return <AlertCircle className={`${iconSize} text-blue-100`} />;
      case 'RESOLVED':
        return <CheckCircle className={`${iconSize} text-blue-100`} />;
      case 'CLOSED':
        return <XCircle className={`${iconSize} text-slate-100`} />;
      default:
        return <Clock className={`${iconSize} text-gray-500`} />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center space-x-1 rounded-full font-medium border
      ${colorClasses.full} ${sizeClasses[size]}
    `}>
      {showIcon && getStatusIcon(status)}
      <span>{displayName}</span>
    </span>
  );
};

export default StatusBadge;
