import React from 'react';

export const LabIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2.5a2.5 2.5 0 0 1 3 3L8 15H5v-3L14.5 2.5z"></path>
    <path d="M7 16l-4 4"></path>
    <path d="M16 8l4 4"></path>
    <path d="M2 21h6"></path>
    <path d="M19 11.5l-2-2"></path>
    <path d="M19.5 13.5L18 12"></path>
    <path d="M16.5 10.5L15 9"></path>
    <path d="M13.5 19.5L12 18"></path>
  </svg>
);