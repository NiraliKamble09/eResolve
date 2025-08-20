import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'p-6',
  ...props 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div
      className={`
        rounded-xl border shadow-lg ${padding} transition-all duration-300
        ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}
        ${hover ? 'hover:transform hover:-translate-y-2 hover:shadow-xl' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
