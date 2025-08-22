import React from 'react';

export const BadgeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21l-8-4.5V9l8 4.5 8-4.5v7.5L12 21z"/>
    <path d="M12 12l8-4.5"/>
    <path d="M4 9l8 4.5"/>
    <path d="M12 3L4 7.5l8 4.5 8-4.5L12 3z"/>
  </svg>
);
