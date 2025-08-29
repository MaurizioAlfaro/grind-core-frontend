
import { Card } from '../types';
import { BACCARAT_RANK_VALUES } from '../constants';

export const calculateBaccaratValue = (hand: Card[]): number => {
  if (!hand || hand.length === 0) return 0;
  
  const total = hand.reduce((sum, card) => {
    if (!card) return sum;
    return sum + BACCARAT_RANK_VALUES[card.rank];
  }, 0);

  return total % 10;
};
