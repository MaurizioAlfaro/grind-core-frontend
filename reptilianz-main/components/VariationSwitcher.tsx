import React from 'react';

interface VariationSwitcherProps {
  variation: number;
  setVariation: (v: number) => void;
  className?: string;
}

const VariationSwitcher: React.FC<VariationSwitcherProps> = ({ variation, setVariation, className }) => {
  return (
    <div className={`absolute top-4 left-4 z-40 flex flex-wrap gap-1 bg-black/50 p-1 border border-gray-600 rounded-md max-w-[240px] ${className}`}>
      {Array.from({ length: 21 }, (_, i) => i + 1).map((v) => (
        <button
          key={v}
          onClick={() => setVariation(v)}
          aria-label={`Select Variation ${v}`}
          className={`w-6 h-6 font-display text-xs border-2 transition-all duration-200 rounded-sm flex-shrink-0 ${
            variation === v
              ? 'bg-lime-400 text-black border-lime-300'
              : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
};

export default React.memo(VariationSwitcher);