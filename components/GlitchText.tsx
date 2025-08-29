
import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ children, className }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), Math.random() * 150 + 50);
    }, Math.random() * 4000 + 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const glitchClasses = isGlitching ? 'translate-x-1 -translate-y-1' : '';

  return (
    <div className={`relative inline-block ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 w-full h-full text-cyan-400 opacity-80 mix-blend-screen transition-transform duration-100 ${glitchClasses} -translate-x-0.5`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 w-full h-full text-fuchsia-500 opacity-80 mix-blend-screen transition-transform duration-100 ${glitchClasses} translate-x-0.5`}
      >
        {children}
      </span>
      <span className="relative">{children}</span>
    </div>
  );
};

export default GlitchText;
