import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const progress = (current / total) * 100;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Step {current} of {total}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;