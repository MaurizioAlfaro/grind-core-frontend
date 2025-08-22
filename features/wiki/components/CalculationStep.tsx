
import React from 'react';

interface CalculationStepProps {
  step: number;
  title: string;
  children: React.ReactNode;
}

export const CalculationStep: React.FC<CalculationStepProps> = ({ step, title, children }) => (
  <div className="flex items-start gap-4 p-3 bg-gray-900/50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-cyan-800 rounded-full flex items-center justify-center font-orbitron font-bold text-lg">{step}</div>
    <div className="flex-1">
      <h5 className="font-bold text-white">{title}</h5>
      <div className="text-sm text-gray-400">{children}</div>
    </div>
  </div>
);
