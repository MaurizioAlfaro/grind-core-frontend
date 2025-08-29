import React, { useState, useMemo } from "react";
import { useRouletteLogic } from "./hooks/useRouletteLogic";
import { RouletteGameState, RouletteNumber } from "./types";
import RouletteTable from "./components/RouletteTable";
import RouletteWheel from "./components/RouletteWheel";
import ResultDisplay from "./components/ResultDisplay";
import Chip from "./components/Chip";
import RouletteSettingsModal from "./components/RouletteSettingsModal";
import RouletteDebugModal from "./components/RouletteDebugModal";
import { CHIP_DENOMINATIONS } from "./constants";

const RouletteGame: React.FC = () => {
  const game = useRouletteLogic();
  const {
    gameState,
    chips,
    bets,
    actions,
    settings,
    log,
    winningNumber,
    spinTargetIndex,
    spinHistory,
    netRoundWinnings,
    isLoading,
  } = game;

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isDebugOpen, setDebugOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState<number>(1);

  const totalBet = useMemo(
    () => Object.values(bets).reduce((a, b) => a + b, 0),
    [bets]
  );

  const handleBet = (betType: string) => {
    if (gameState !== RouletteGameState.BETTING || isLoading) return;
    actions.placeBet(betType, selectedChip);
  };

  return (
    <div className="w-full h-full bg-dark-felt rounded-b-3xl rounded-tr-3xl shadow-2xl p-2 sm:p-6 border-4 sm:border-8 border-black/20 relative flex flex-col">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex space-x-2 z-20">
        {/* Settings and Debug buttons hidden
                <button onClick={() => setSettingsOpen(true)} className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600">Settings</button>
                <button onClick={() => setDebugOpen(true)} className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600">Debug</button>
                */}
      </div>
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white text-base sm:text-2xl font-bold bg-black/50 px-2 py-1 sm:px-4 sm:py-2 rounded-lg z-20">
        Chips: <span className="text-yellow-300">${chips}</span>
      </div>

      <div className="flex-grow flex flex-col md:grid md:grid-cols-3 md:gap-6">
        <div className="flex flex-col items-center justify-start space-y-4 py-4">
          <RouletteWheel
            winningIndex={spinTargetIndex}
            isSpinning={gameState === RouletteGameState.SPINNING}
          />

          <div className="w-full text-center p-2 bg-black/30 rounded-lg">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              History
            </h3>
            <div className="flex justify-center flex-wrap gap-1">
              {spinHistory.map((num, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold rounded-full text-white text-xs sm:text-sm bg-roulette-${num.color}`}
                >
                  {num.value}
                </span>
              ))}
            </div>
          </div>

          <div className="h-24 sm:h-32 flex items-center justify-center">
            {gameState === RouletteGameState.PAYOUT && winningNumber && (
              <ResultDisplay
                winningNumber={winningNumber}
                netWinnings={netRoundWinnings}
                onNextRound={actions.nextRound}
              />
            )}
          </div>
        </div>
        <div className="md:col-span-2 flex items-center">
          <RouletteTable
            bets={bets}
            onBet={handleBet}
            gameState={gameState}
            winningNumber={winningNumber}
          />
        </div>
      </div>

      <div className="flex-shrink-0 border-t-2 sm:border-t-4 border-black/20 mt-2 pt-2">
        {gameState === RouletteGameState.BETTING && (
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="text-center">
              <h3 className="text-base sm:text-xl font-bold text-white">
                Select Chip & Place Bets
              </h3>
              <p className="text-white text-sm sm:text-base">
                Total Bet:{" "}
                <span className="text-yellow-300 font-bold">${totalBet}</span>
              </p>
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              {CHIP_DENOMINATIONS.map((value) => (
                <div
                  key={value}
                  className={`rounded-full p-0.5 sm:p-1 transition-all ${
                    selectedChip === value ? "bg-yellow-400" : "bg-transparent"
                  }`}
                >
                  <Chip
                    value={value}
                    onClick={() => setSelectedChip(value)}
                    disabled={isLoading || chips < value}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-end space-x-2 sm:space-x-4">
              <button
                onClick={actions.spin}
                disabled={isLoading || totalBet === 0}
                className="px-5 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500"
              >
                Spin
              </button>
              <button
                onClick={actions.clearBets}
                disabled={isLoading || totalBet === 0}
                className="px-5 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-red-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500"
              >
                Clear
              </button>
              <button
                onClick={actions.repeatLastBet}
                disabled={isLoading || !game.lastBets}
                className="px-5 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500"
              >
                Repeat
              </button>
            </div>
          </div>
        )}
        {gameState !== RouletteGameState.BETTING && (
          <div className="h-[148px] sm:h-[164px]" />
        )}
      </div>

      <RouletteSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={actions.handleSaveSettings}
        currentSettings={settings}
      />
      <RouletteDebugModal
        isOpen={isDebugOpen}
        onClose={() => setDebugOpen(false)}
        settings={settings}
        log={log}
        onClearLog={actions.clearLog}
      />
    </div>
  );
};

export default RouletteGame;
