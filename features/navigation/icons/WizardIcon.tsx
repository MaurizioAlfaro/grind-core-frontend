import React from 'react';

export const WizardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13.37a2.5 2.5 0 0 1 0-2.74l5.4-3.12a2.5 2.5 0 0 1 2.5 0l5.4 3.12a2.5 2.5 0 0 1 0 2.74l-5.4 3.12a2.5 2.5 0 0 1-2.5 0Z"/>
    <path d="M12 22v-4"/>
    <path d="m18.7 18.7-2.8-2.8"/>
    <path d="m5.3 18.7 2.8-2.8"/>
    <path d="M22 12h-4"/>
    <path d="M6 12H2"/>
    <path d="m18.7 5.3-2.8 2.8"/>
    <path d="m5.3 5.3 2.8 2.8"/>
    <path d="M12 6V2"/>
  </svg>
);
