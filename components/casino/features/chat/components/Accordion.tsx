import React from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="bg-gray-900/50 rounded-md">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-3 font-semibold text-left text-yellow-300"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <div className="p-3 border-t border-gray-700">{children}</div>}
        </div>
    )
}

export default Accordion;
