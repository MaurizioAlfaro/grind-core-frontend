import React from "react";
import CasinoApp from "./App";
import "./casino.css";

interface CasinoViewProps {
  onClose: () => void;
  playerLevel: number;
  currentPlayerId?: string;
}

const CasinoView: React.FC<CasinoViewProps> = ({
  onClose,
  playerLevel,
  currentPlayerId,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-felt-green rounded-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-bold transition-colors"
        >
          ✕
        </button>

        {/* Casino content */}
        <div className="w-full h-full">
          <CasinoApp
            playerLevel={playerLevel}
            currentPlayerId={currentPlayerId}
          />
        </div>
      </div>
    </div>
  );
};

export default CasinoView;
