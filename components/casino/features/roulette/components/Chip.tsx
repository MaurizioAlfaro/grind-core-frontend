
import React from 'react';

interface ChipProps {
  value: number;
  onClick: (value: number) => void;
  disabled?: boolean;
  size?: 'normal' | 'small';
}

const Chip: React.FC<ChipProps> = ({ value, onClick, disabled = false, size = 'normal' }) => {
  const chipColors: { [key: number]: string } = {
    1: 'bg-gray-400',
    5: 'bg-chip-red', 10: 'bg-chip-blue', 25: 'bg-chip-green',
    100: 'bg-chip-black', 500: 'bg-purple-700',
  };
  const color = chipColors[value] || 'bg-gray-500';
  
  const sizeClasses = {
      normal: { container: 'w-11 h-11 sm:w-16 sm:h-16 text-xs sm:text-lg', inner: 'w-9 h-9 sm:w-12 sm:h-12 border-2 sm:border-4', hover: 'hover:scale-110' },
      small: { container: 'w-10 h-10 text-xs', inner: 'w-8 h-8 border-2', hover: '' }
  };
  const currentSize = sizeClasses[size];

  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`rounded-full flex items-center justify-center text-white font-bold shadow-chip focus:outline-none focus:ring-4 focus:ring-yellow-300 transform transition-transform disabled:opacity-50 disabled:cursor-not-allowed ${color} ${currentSize.container} ${!disabled ? currentSize.hover : ''}`}
    >
      <div className={`rounded-full border-white/50 flex items-center justify-center ${currentSize.inner}`}>
        ${value}
      </div>
    </button>
  );
};

export default Chip;