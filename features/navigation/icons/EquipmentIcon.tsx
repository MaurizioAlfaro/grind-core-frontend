import React from 'react';

export const EquipmentIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l-8 4 8 4 8-4-8-4z"/>
    <path d="M4 10v5.5a4.5 4.5 0 0 0 8 0V10"/>
    <path d="M20 10v5.5a4.5 4.5 0 0 1-8 0V10"/>
  </svg>
);
