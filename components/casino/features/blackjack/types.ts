
export enum Suit {
  Spades = '♠', Clubs = '♣', Hearts = '♥', Diamonds = '♦', HIDDEN = '?',
}

export enum Rank {
  Ace = 'A', Two = '2', Three = '3', Four = '4', Five = '5', Six = '6',
  Seven = '7', Eight = '8', Nine = '9', Ten = '10', Jack = 'J',
  Queen = 'Q', King = 'K', HIDDEN = '?',
}

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface GameSettings {
  deckCount: number;
  minBet: number;
  maxBet: number;
  hitSoft17: boolean;
  doubleDownRule: 'any' | '9_10_11';
  doubleAfterSplit: boolean;
  surrenderEnabled: boolean;
  blackjackPayout: '3_2' | '6_5';
  insuranceEnabled: boolean;
  showDealerCard: boolean;
  splitAcesRule: 'one_card' | 'multiple_cards';
  maxResplits: number;
  fiveCardCharlieWins: boolean;
  perfectPairsBonus: boolean;
  twentyOnePlusThreeBonus: boolean;
}

export enum GameState {
  BETTING, INSURANCE_BETTING, EVEN_MONEY_CHOICE,
  PLAYER_TURN, DEALER_TURN, ROUND_OVER,
}

export enum GameResult {
  NONE, PLAYER_WINS, PLAYER_BLACKJACK, DEALER_WINS, DEALER_BLACKJACK,
  PUSH, PLAYER_BUST, DEALER_BUST, SURRENDER,
}

export type LogType = 'action' | 'game' | 'state' | 'info' | 'decision' | 'payout' | 'error';

export interface LogEntry {
  timestamp: string;
  type: LogType;
  message: string;
  data?: any;
}
