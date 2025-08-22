import React from 'react';

export const BossIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1"></circle>
    <circle cx="15" cy="12" r="1"></circle>
    <path d="M8 20v2h8v-2"></path>
    <path d="M12.5 17.5c-1.5-1-5-1-6.5 0"></path>
    <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9z"></path>
    <path d="M12 2c-3 0-3 3-3 3s0-3 3-3 3 3 3 3-3-3-3-3z"></path>
  </svg>
);
