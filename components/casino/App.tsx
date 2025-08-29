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
}> = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl font-bold rounded-t-lg transition-colors focus:outline-none
            ${
              isActive
                ? "bg-dark-felt text-yellow-300"
                : "bg-black/30 text-white hover:bg-black/50"
            }`}
  >
    {title}
  </button>
);

const App: React.FC = () => {
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
          />
          <GameTab
            title="Roulette"
            isActive={activeGame === "roulette"}
            onClick={() => setActiveGame("roulette")}
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
          {activeGame === "chat" && <Chat />}
        </div>
      </div>
    </div>
  );
};

export default App;
