// Basic card and log types, isolated from Blackjack
export enum Suit {
  Spades = '♠', Clubs = '♣', Hearts = '♥', Diamonds = '♦',
}

export enum Rank {
  Ace = 'A', Two = '2', Three = '3', Four = '4', Five = '5', Six = '6',
  Seven = '7', Eight = '8', Nine = '9', Ten = '10', Jack = 'J',
  Queen = 'Q', King = 'K',
}

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type LogType = 'action' | 'game' | 'state' | 'info' | 'decision' | 'payout' | 'error';

export interface LogEntry {
  timestamp: string;
  type: LogType;
  message: string;
  data?: any;
}

// Baccarat-specific types
export enum BaccaratGameState {
  BETTING,
  DEALING,
  ROUND_OVER,
}

export type BaccaratBetType = 'player' | 'banker' | 'tie' | 'playerPair' | 'bankerPair';

export type BaccaratResult = 'Player' | 'Banker' | 'Tie' | null;

export interface BaccaratSettings {
  deckCount: number;
  minBet: number;
  maxBet: number;
  tiePayout: number;
  pairPayout: number;
  bankerCommission: number; // e.g. 0.05 for 5%
}

export interface BaccaratState {
    settings: BaccaratSettings;
    deck: Card[];
    gameState: BaccaratGameState;
    chips: number;
    playerHand: Card[];
    bankerHand: Card[];
    bets: Record<BaccaratBetType, number>;
    lastBets: Record<BaccaratBetType, number> | null;
    result: { winner: BaccaratResult, playerScore: number, bankerScore: number } | null;
    netRoundWinnings: number;
    log: {type: LogType, message: string} | null;
}
