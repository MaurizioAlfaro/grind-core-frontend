
import { useState } from 'react';
import { Card, GameState, GameResult, GameSettings } from '../types';
import { INITIAL_CHIPS, INITIAL_SETTINGS } from '../constants';

export const useGameState = () => {
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [deck, setDeck] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.BETTING);
  const [chips, setChips] = useState<number>(INITIAL_CHIPS);
  const [insuranceBet, setInsuranceBet] = useState<number>(0);
  
  const [playerHands, setPlayerHands] = useState<Card[][]>([]);
  const [bets, setBets] = useState<number[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  
  const [mainBet, setMainBet] = useState<number>(0);
  const [lastBet, setLastBet] = useState<number>(0);
  const [netRoundWinnings, setNetRoundWinnings] = useState<number>(0);

  return {
    settings, setSettings, deck, setDeck, dealerHand, setDealerHand,
    gameState, setGameState, chips, setChips, insuranceBet, setInsuranceBet,
    playerHands, setPlayerHands, bets, setBets, activeHandIndex, setActiveHandIndex,
    gameResults, setGameResults, mainBet, setMainBet, lastBet, setLastBet,
    netRoundWinnings, setNetRoundWinnings,
  };
};

export type IGameState = ReturnType<typeof useGameState>;
