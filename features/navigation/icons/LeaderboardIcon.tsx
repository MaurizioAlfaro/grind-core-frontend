import React from 'react';

export const LeaderboardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.5a3.5 3.5 0 0 0 4 0"/>
    <path d="M8 22v-5a4 4 0 0 1 8 0v5"/>
    <path d="M12 2v1.5"/>
    <path d="M12 11.5v-2"/>
  </svg>
);
