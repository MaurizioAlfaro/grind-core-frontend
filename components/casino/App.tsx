import React, { useState, useEffect } from "react";
import BlackjackGame from "./features/blackjack";
import BaccaratGame from "./features/baccarat";
import RouletteGame from "./features/roulette";
import Chat from "./features/chat";
import DealerAvatar from "./components/DealerAvatar";

const Disclaimer: React.FC = () => (
  <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/60 rounded-lg p-4 mb-3 text-center shadow-lg">
    <div className="flex items-center justify-center space-x-2">
      <span className="text-yellow-400 text-lg">⚠️</span>
      <p className="text-yellow-100 text-sm font-medium">
        <span className="font-bold text-yellow-300">Disclaimer:</span> Casino
        chips are not related to gold as of now. They will be in the future.
      </p>
      <span className="text-yellow-400 text-lg">⚠️</span>
    </div>
  </div>
);

const AddChipsButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentChips, setCurrentChips] = useState(0);

  // Get current chips for display
  useEffect(() => {
    const updateChips = () => {
      const chips = parseInt(localStorage.getItem("blackjack_chips") || "0");
      setCurrentChips(chips);
    };

    updateChips();
    window.addEventListener("chipsUpdated", updateChips);
    return () => window.removeEventListener("chipsUpdated", updateChips);
  }, []);

  const addChips = () => {
    // Get current chips from localStorage or default to 0
    const storedChips = parseInt(
      localStorage.getItem("blackjack_chips") || "0"
    );
    const newChips = storedChips + 1000;
    localStorage.setItem("blackjack_chips", newChips.toString());

    // Dispatch a custom event to notify the blackjack game
    window.dispatchEvent(
      new CustomEvent("chipsUpdated", { detail: { chips: newChips } })
    );

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 left-4 z-20">
      <button
        onClick={addChips}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-colors text-sm"
        title={`Add 1000 chips for testing (Current: ${currentChips})`}
      >
        🪙 +1000 Chips
      </button>

      {/* Success message */}
      {showSuccess && (
        <div className="absolute top-12 left-0 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          ✅ Added 1000 chips!
        </div>
      )}
    </div>
  );
};

const GameTab: React.FC<{
  title: string;
  isActive: boolean;
  onClick: () => void;
  isLocked?: boolean;
  requiredLevel?: number;
}> = ({ title, isActive, onClick, isLocked, requiredLevel }) => (
  <button
    onClick={onClick}
    disabled={isLocked}
    className={`px-2 py-1 md:px-3 md:py-2 text-sm md:text-base font-bold rounded-t-lg transition-colors focus:outline-none relative
            ${
              isActive
                ? "bg-dark-felt text-yellow-300"
                : isLocked
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-black/30 text-white hover:bg-black/50"
            }`}
  >
    {title}
    {isLocked && (
      <div className="absolute -top-2 -right-2 flex flex-col items-center text-xs">
        <span className="text-gray-400">🔒</span>
      </div>
    )}
  </button>
);

const App: React.FC<{ playerLevel: number; currentPlayerId?: string }> = ({
  playerLevel,
  currentPlayerId,
}) => {
  const [activeGame, setActiveGame] = useState<
    "blackjack" | "baccarat" | "roulette" | "chat"
  >("blackjack");

  return (
    <div className="w-full h-full bg-felt-green flex flex-col items-center justify-start font-sans p-1 sm:p-2 md:p-4 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
        <div className="flex-shrink-0 flex space-x-1 sm:space-x-2">
          <GameTab
            title="Blackjack"
            isActive={activeGame === "blackjack"}
            onClick={() => setActiveGame("blackjack")}
          />
          <GameTab
            title="Baccarat"
            isActive={activeGame === "baccarat"}
            onClick={() => setActiveGame("baccarat")}
            isLocked={playerLevel < 10}
            requiredLevel={10}
          />
          <GameTab
            title="Roulette"
            isActive={activeGame === "roulette"}
            onClick={() => setActiveGame("roulette")}
            isLocked={playerLevel < 20}
            requiredLevel={20}
          />
          <GameTab
            title="Chat"
            isActive={activeGame === "chat"}
            onClick={() => setActiveGame("chat")}
          />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        <div className="relative flex-grow min-h-0">
          {activeGame !== "chat" && <DealerAvatar />}

          {/* Add Chips Button - Only visible for blackjack */}
          <AddChipsButton isVisible={activeGame === "blackjack"} />

          {activeGame === "blackjack" && <BlackjackGame />}
          {activeGame === "baccarat" && <BaccaratGame />}
          {activeGame === "roulette" && <RouletteGame />}
          {activeGame === "chat" && <Chat currentPlayerId={currentPlayerId} />}
        </div>
      </div>
    </div>
  );
};

export default App;
