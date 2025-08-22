
import React from 'react';

export const GoldIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8"></circle><path d="M12 2v20"></path><path d="M16 6l-8 12"></path><path d="M8 6l8 12"></path>
  </svg>
);
