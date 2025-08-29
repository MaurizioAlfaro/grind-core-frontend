import React, { useState } from "react";
import BlackjackGame from "./features/blackjack";
import BaccaratGame from "./features/baccarat";
import RouletteGame from "./features/roulette";
import Chat from "./features/chat";
import DealerAvatar from "./components/DealerAvatar";

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
    className={`px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl font-bold rounded-t-lg transition-colors focus:outline-none relative
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
        <span className="text-gray-400">LVL {requiredLevel}</span>
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
        <div className="relative flex-grow min-h-0">
          {activeGame !== "chat" && <DealerAvatar />}
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
