
import { Rank, Suit, GameSettings } from './types';

export const SUITS: Suit[] = [Suit.Spades, Suit.Clubs, Suit.Hearts, Suit.Diamonds];
export const RANKS: Rank[] = [
  Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven,
  Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
];

export const RANK_VALUES: { [key in Rank]: number } = {
  [Rank.Two]: 2, [Rank.Three]: 3, [Rank.Four]: 4, [Rank.Five]: 5, [Rank.Six]: 6,
  [Rank.Seven]: 7, [Rank.Eight]: 8, [Rank.Nine]: 9, [Rank.Ten]: 10,
  [Rank.Jack]: 10, [Rank.Queen]: 10, [Rank.King]: 10, [Rank.Ace]: 11,
  [Rank.HIDDEN]: 0,
};

export const INITIAL_SETTINGS: GameSettings = {
  deckCount: 6,
  minBet: 10,
  maxBet: 500,
  hitSoft17: true,
  doubleDownRule: 'any',
  doubleAfterSplit: true,
  surrenderEnabled: true,
  blackjackPayout: '3_2',
  insuranceEnabled: true,
  showDealerCard: false,
  splitAcesRule: 'one_card',
  maxResplits: 3,
  fiveCardCharlieWins: false,
  perfectPairsBonus: false,
  twentyOnePlusThreeBonus: false,
};

export const INITIAL_CHIPS = 1000;
export const CHIP_DENOMINATIONS = [5, 10, 25, 100, 500];

export const BLACKJACK_PAYOUTS = {
    '3_2': 1.5,
    '6_5': 1.2,
};