
import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  startOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, startOpen = true }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        <div className="bg-gray-700 rounded-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 font-semibold text-left"
            >
                <span>{title}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <div className="p-3 border-t border-gray-600 space-y-4">{children}</div>}
        </div>
    )
}

export default Accordion;
