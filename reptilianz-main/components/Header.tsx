import React from "react";
import GlitchText from "./GlitchText";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 py-3 px-4 md:px-8 backdrop-blur-md bg-black/50 border-b-2 border-cyan-500/50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <a
          href="#"
          className="text-xl md:text-2xl font-display text-fuchsia-400 flex-shrink-0"
        >
          <GlitchText>REPTILIANZ</GlitchText>
        </a>
        <div className="flex items-center gap-6">
          <a
            href="/airdrop"
            className="text-sm md:text-base font-display text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            🎁 AIRDROP
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
