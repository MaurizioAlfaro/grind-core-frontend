
import React from 'react';

interface WikiSectionProps {
  title: string;
  children: React.ReactNode;
  startExpanded?: boolean;
}

export const WikiSection: React.FC<WikiSectionProps> = ({ title, children, startExpanded = false }) => {
    const [isExpanded, setIsExpanded] = React.useState(startExpanded);
    const id = title.replace(/\s+/g, '-').toLowerCase();

    return (
        <section className="mb-6 last:mb-0 bg-gray-900/50 rounded-lg border border-gray-700">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-800/50 rounded-t-lg"
                aria-expanded={isExpanded}
                aria-controls={`wiki-section-${id}`}
            >
                <h3 className="text-xl font-orbitron font-bold text-cyan-400">{title}</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {isExpanded && (
                <div id={`wiki-section-${id}`} className="px-4 pb-4 border-t border-gray-700/50 space-y-4 text-gray-300 leading-relaxed animate-fade-in-up">
                    {children}
                </div>
            )}
        </section>
    );
};
