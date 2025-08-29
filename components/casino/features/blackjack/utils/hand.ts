
import { Card, Rank } from '../types';
import { RANK_VALUES } from '../constants';

export const calculateHandValue = (hand: Card[]): { value: number; soft: boolean } => {
  if (!hand || hand.length === 0) return { value: 0, soft: false };
  let value = 0;
  let aceCount = 0;

  hand.forEach(card => {
    if (!card || card.rank === Rank.HIDDEN) return;
    value += RANK_VALUES[card.rank];
    if (card.rank === Rank.Ace) {
      aceCount++;
    }
  });

  let soft = aceCount > 0;
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  if (aceCount === 0) soft = false;

  return { value, soft };
};
