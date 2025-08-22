import React from 'react';

export const LootboxIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/>
    <path d="M4 10V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/>
    <path d="M10 12h4"/>
    <path d="M12 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
