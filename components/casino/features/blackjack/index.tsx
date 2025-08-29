import React, { useState, useMemo, useEffect } from 'react';
import { GameState } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import { useActionPermissions } from './hooks/useActionPermissions';
import { usePrevious } from '../../hooks/usePrevious';
import SettingsModal from './components/modals/SettingsModal';
import DebugModal from './components/modals/DebugModal';
import BettingControls from './components/BettingControls';
import GameControls from './components/GameControls';
import PlayerHands from './components/PlayerHands';
import { TableUI } from './components/TableUI';
import { InsurancePrompt, EvenMoneyPrompt } from './components/GamePrompts';

const Controls: React.FC<{game: any, perms: any, onDeal: () => void, isLoading: boolean, totalBet: number}> = ({ game, perms, onDeal, isLoading, totalBet }) => {
    const { gameState, actions, mainBet, lastBet, chips, settings } = game;
    switch (gameState) {
        case GameState.BETTING:
            return <BettingControls onBet={actions.placeBet} onClear={actions.clearBet} onDeal={onDeal} onRepeat={actions.repeatBet} onMax={actions.maxBet} mainBet={mainBet} lastBet={lastBet} playerChips={chips} settings={settings} isLoading={isLoading} />;
        case GameState.PLAYER_TURN:
            return <GameControls onHit={actions.hit} onStand={actions.stand} onDouble={actions.double} onSplit={actions.split} onSurrender={actions.surrender} canDouble={perms.canDouble} canSplit={perms.canSplit} canSurrender={perms.canSurrender} isLoading={isLoading} />;
        case GameState.INSURANCE_BETTING:
            return <InsurancePrompt onInsurance={actions.decideInsurance} insuranceCost={totalBet / 2} canAfford={chips >= totalBet / 2} isLoading={isLoading} />;
        case GameState.EVEN_MONEY_CHOICE:
            return <EvenMoneyPrompt onEvenMoney={actions.decideEvenMoney} payout={totalBet} isLoading={isLoading} />;
        case GameState.ROUND_OVER:
            return <button onClick={actions.nextRound} disabled={isLoading} className="px-8 py-3 sm:px-10 sm:py-4 bg-yellow-500 text-gray-900 font-bold text-lg sm:text-xl rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-wait">Next Round</button>;
        default: return null;
    }
};

const BlackjackGame: React.FC = () => {
  const game = useGameLogic();
  const { gameState, chips, bets, mainBet, log, settings, actions, isLoading, tableMessage } = game;
  const [isDebugOpen, setDebugOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  
  const permissions = useActionPermissions(game);
  const prevGameState = usePrevious(gameState);
  const totalBet = useMemo(() => gameState === GameState.BETTING ? mainBet : bets.reduce((a, b) => a + b, 0), [gameState, mainBet, bets]);

  useEffect(() => {
    if (gameState === GameState.INSURANCE_BETTING && prevGameState !== GameState.INSURANCE_BETTING) {
      setIsPeeking(true);
      const timer = setTimeout(() => setIsPeeking(false), 1500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [gameState, prevGameState]);

  const handleDealClick = () => {
    setIsDealing(true);
    setTimeout(() => setIsDealing(false), 1000); 
    actions.deal();
  };

  return (
    <div className="w-full h-full bg-dark-felt rounded-b-3xl rounded-tr-3xl shadow-2xl p-2 sm:p-4 border-4 sm:border-8 border-black/20 flex flex-col">
      
      <div className="flex-grow flex flex-col justify-around">
        <TableUI 
          dealerHand={game.dealerHand} 
          gameState={gameState} 
          gameResults={game.gameResults} 
          netRoundWinnings={game.netRoundWinnings} 
          totalBet={totalBet} 
          isDealing={isDealing}
          isPeeking={isPeeking}
          tableMessage={tableMessage}
        />
        <PlayerHands hands={game.playerHands} bets={bets} results={game.gameResults} gameState={gameState} activeHandIndex={game.activeHandIndex} />
      </div>

      <div className="flex-shrink-0 pt-2 border-t-2 sm:border-t-4 border-black/20">
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="min-h-[9rem] sm:min-h-[10rem] flex items-center justify-center">
                <Controls game={game} perms={permissions} onDeal={handleDealClick} isLoading={isLoading} totalBet={totalBet}/>
            </div>
            <div className="w-full flex justify-between items-center text-white px-1">
                <div className="flex space-x-2">
                    <button onClick={() => setSettingsOpen(true)} className="px-3 py-1 bg-gray-700/80 rounded-md text-xs sm:text-sm hover:bg-gray-600">Settings</button>
                    <button onClick={() => setDebugOpen(true)} className="px-3 py-1 bg-gray-700/80 rounded-md text-xs sm:text-sm hover:bg-gray-600">Debug</button>
                </div>
                <div className="text-base sm:text-xl font-bold bg-black/50 px-3 py-1 rounded-lg">
                    Chips: <span className="text-yellow-300">${chips}</span>
                </div>
            </div>
        </div>
      </div>

      <DebugModal isOpen={isDebugOpen} onClose={() => setDebugOpen(false)} deck={game.deck} settings={settings} log={log} onClearLog={actions.clearLog} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} onSave={actions.handleSaveSettings} currentSettings={settings} />
    </div>
  );
};

export default BlackjackGame;