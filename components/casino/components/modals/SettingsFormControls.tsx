
import React from 'react';

export const Toggle: React.FC<{label: string; checked: boolean; onChange: (checked: boolean) => void}> = ({label, checked, onChange}) => (
    <label className="flex items-center justify-between">
      <span className="font-semibold">{label}</span>
      <div className="relative inline-block w-12 h-6">
        <input type="checkbox" className="absolute w-0 h-0 opacity-0" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={`block w-12 h-6 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-600'}`}></span>
        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></span>
      </div>
    </label>
);

export const RadioGroup: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: {value: string; label: string}[];
}> = ({ value, onChange, options}) => (
    <div className="flex space-x-2">
        {options.map(opt => (
            <button key={opt.value} onClick={() => onChange(opt.value)} className={`px-3 py-1 text-sm rounded-full transition-colors ${value === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-900'}`}>
                {opt.label}
            </button>
        ))}
    </div>
);
