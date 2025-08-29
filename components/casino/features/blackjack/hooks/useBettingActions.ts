
import { GameState } from '../types';
import { useGameLogger } from './useGameLogger';
import { IGameState } from './useGameState';

export const useBettingActions = (
  state: IGameState,
  addLogEntry: ReturnType<typeof useGameLogger>['addLogEntry']
) => {
  const { gameState, mainBet, setMainBet, chips, setChips, settings, lastBet } = state;

  const placeBet = (amount: number) => {
    if (gameState !== GameState.BETTING) return;
    const newBet = mainBet + amount;
    if (chips >= amount && newBet <= settings.maxBet) {
      addLogEntry('action', `Player bets $${amount}.`);
      setMainBet(prev => prev + amount);
      setChips(prev => prev - amount);
    }
  };
  
  const clearBet = () => {
    if (gameState === GameState.BETTING) {
      addLogEntry('action', `Cleared bet of $${mainBet}.`);
      setChips(prev => prev + mainBet);
      setMainBet(0);
    }
  };

  const repeatBet = () => {
    if (gameState === GameState.BETTING && lastBet > 0 && chips >= lastBet) {
      addLogEntry('action', `Repeating last bet of $${lastBet}.`);
      setMainBet(lastBet);
      setChips(prev => prev - lastBet);
    }
  }

  const maxBet = () => {
    if (gameState !== GameState.BETTING) return;
    const amountToBet = Math.min(chips + mainBet, settings.maxBet);
    addLogEntry('action', `Player bets max: $${amountToBet}.`);
    setChips(prev => prev - amountToBet + mainBet);
    setMainBet(amountToBet);
  }

  return { placeBet, clearBet, repeatBet, maxBet };
};
