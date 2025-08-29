
import { Rank, BaccaratSettings, Suit } from './types';

export const SUITS: Suit[] = [Suit.Spades, Suit.Clubs, Suit.Hearts, Suit.Diamonds];
export const RANKS: Rank[] = [
  Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven,
  Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
];

export const BACCARAT_RANK_VALUES: { [key in Rank]: number } = {
  [Rank.Two]: 2, [Rank.Three]: 3, [Rank.Four]: 4, [Rank.Five]: 5, [Rank.Six]: 6,
  [Rank.Seven]: 7, [Rank.Eight]: 8, [Rank.Nine]: 9, [Rank.Ten]: 0,
  [Rank.Jack]: 0, [Rank.Queen]: 0, [Rank.King]: 0, [Rank.Ace]: 1,
};

export const INITIAL_BACCARAT_SETTINGS: BaccaratSettings = {
  deckCount: 8,
  minBet: 5,
  maxBet: 500,
  tiePayout: 8, // 8 to 1
  pairPayout: 11, // 11 to 1
  bankerCommission: 0.05,
};

export const INITIAL_CHIPS = 1000;
export const CHIP_DENOMINATIONS = [5, 10, 25, 100, 500];