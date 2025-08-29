
import { GameResult, Rank, Card, GameState } from '../types';
import { useGameLogger } from './useGameLogger';
import { IGameState } from './useGameState';
import { calculateHandValue } from '../utils/hand';
import { RANK_VALUES } from '../constants';

const cardToString = (c: Card) => `${c.rank}${c.suit}`;

export const usePlayerActions = (
  state: IGameState,
  addLogEntry: ReturnType<typeof useGameLogger>['addLogEntry']
) => {
  const { gameState, setGameState, deck, setDeck, playerHands, setPlayerHands, activeHandIndex, setActiveHandIndex, gameResults, setGameResults, setChips, bets, setBets, mainBet, setNetRoundWinnings, settings } = state;

  const advanceToNextHandOrDealer = () => {
    if (activeHandIndex < playerHands.length - 1) {
        const newIndex = activeHandIndex + 1;
        addLogEntry('state', `Advancing to player hand ${newIndex + 1}.`);
        setActiveHandIndex(newIndex);
    } else {
        addLogEntry('state', "--- Dealer's Turn ---");
        setGameState(GameState.DEALER_TURN);
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    if (!newCard) return;

    const newHands = [...playerHands];
    newHands[activeHandIndex] = [...newHands[activeHandIndex], newCard];
    setPlayerHands(newHands);
    setDeck(newDeck);
    
    const { value } = calculateHandValue(newHands[activeHandIndex]);
    addLogEntry('action', `Player HITS. Got ${cardToString(newCard)}. New value: ${value}`);
    
    if (value >= 21) {
      if (value > 21) {
        addLogEntry('game', `Player BUSTS on hand ${activeHandIndex + 1}.`);
        const newResults = [...gameResults];
        newResults[activeHandIndex] = GameResult.PLAYER_BUST;
        setGameResults(newResults);
      }
      setTimeout(advanceToNextHandOrDealer, 500);
    }
  };
  
  const stand = () => {
    addLogEntry('action', `Player STANDS on hand ${activeHandIndex + 1}.`);
    advanceToNextHandOrDealer();
  };

  const double = () => {
      const bet = bets[activeHandIndex];
      addLogEntry('action', `Player DOUBLES DOWN on hand ${activeHandIndex + 1}.`);
      setChips(prev => prev - bet);
      const newBets = [...bets];
      newBets[activeHandIndex] *= 2;
      setBets(newBets);

      const newDeck = [...deck];
      const newCard = newDeck.pop();
      if (!newCard) return;

      const newHands = [...playerHands];
      newHands[activeHandIndex] = [...newHands[activeHandIndex], newCard];
      const { value } = calculateHandValue(newHands[activeHandIndex]);
      addLogEntry('game', `Player receives ${cardToString(newCard)}. Final value: ${value}`);
      setPlayerHands(newHands);
      setDeck(newDeck);
      
      if (value > 21) {
          addLogEntry('game', `Player BUSTS on double down.`);
          const newResults = [...gameResults];
          newResults[activeHandIndex] = GameResult.PLAYER_BUST;
          setGameResults(newResults);
      }
      setTimeout(advanceToNextHandOrDealer, 500);
  };
  
  const split = () => {
      const hand = playerHands[activeHandIndex];
      const bet = bets[activeHandIndex];
      addLogEntry('action', `Player SPLITS [${hand.map(cardToString).join(', ')}].`);
      setChips(prev => prev - bet);
      
      const newDeck = [...deck];
      const hand1 = [hand[0], newDeck.pop()!];
      const hand2 = [hand[1], newDeck.pop()!];
      
      const newHands = [...playerHands];
      newHands.splice(activeHandIndex, 1, hand1, hand2);
      setPlayerHands(newHands);

      const newBets = [...bets];
      newBets.splice(activeHandIndex, 1, bet, bet);
      setBets(newBets);
      
      const newResults = [...gameResults];
      newResults.splice(activeHandIndex, 1, GameResult.NONE, GameResult.NONE);
      setGameResults(newResults);
      setDeck(newDeck);
  };

  const surrender = () => {
      const refund = mainBet / 2;
      addLogEntry('action', `Player SURRENDERS. Half of bet ($${refund}) returned.`);
      setChips(prev => prev + refund);
      setGameResults([GameResult.SURRENDER]);
      setNetRoundWinnings(-refund);
      addLogEntry('state', 'Round Over.');
      setGameState(GameState.ROUND_OVER);
  };

  const activeActions = gameState === GameState.PLAYER_TURN ? { hit, stand, double, split, surrender } : {};
  return activeActions;
};
