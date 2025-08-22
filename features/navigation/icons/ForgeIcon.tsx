import React from 'react';

export const ForgeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 15v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
    <path d="M12 15v6" />
    <path d="M9 18h6" />
    <path d="M12 3a3.5 3.5 0 0 1 3.5 3.5 4.24 4.24 0 0 1-1 3 3.5 3.5 0 0 1-5 0 4.24 4.24 0 0 1-1-3A3.5 3.5 0 0 1 12 3" />
  </svg>
);