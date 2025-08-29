
import { useState } from 'react';
import { Card, BaccaratGameState, BaccaratSettings, BaccaratResult, BaccaratBetType } from '../types';
import { INITIAL_CHIPS, INITIAL_BACCARAT_SETTINGS } from '../constants';

export const useBaccaratState = () => {
  const [settings, setSettings] = useState<BaccaratSettings>(INITIAL_BACCARAT_SETTINGS);
  const [deck, setDeck] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<BaccaratGameState>(BaccaratGameState.BETTING);
  const [chips, setChips] = useState<number>(INITIAL_CHIPS);
  
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [bankerHand, setBankerHand] = useState<Card[]>([]);

  const [bets, setBets] = useState<Record<BaccaratBetType, number>>({
      player: 0, banker: 0, tie: 0, playerPair: 0, bankerPair: 0
  });
  const [lastBets, setLastBets] = useState<Record<BaccaratBetType, number> | null>(null);

  const [result, setResult] = useState<{ winner: BaccaratResult, playerScore: number, bankerScore: number } | null>(null);
  const [netRoundWinnings, setNetRoundWinnings] = useState<number>(0);

  return {
    settings, setSettings,
    deck, setDeck,
    gameState, setGameState,
    chips, setChips,
    playerHand, setPlayerHand,
    bankerHand, setBankerHand,
    bets, setBets,
    lastBets, setLastBets,
    result, setResult,
    netRoundWinnings, setNetRoundWinnings,
  };
};

export type IBaccaratState = ReturnType<typeof useBaccaratState>;
