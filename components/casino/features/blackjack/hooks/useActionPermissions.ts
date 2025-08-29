
import { useMemo } from 'react';
import { calculateHandValue } from '../utils/hand';
import { RANK_VALUES } from '../constants';
import { GameState, Card, GameSettings } from '../types';

type PermissionsProps = {
  playerHands: Card[][];
  activeHandIndex: number;
  chips: number;
  bets: number[];
  settings: GameSettings;
  gameState: GameState;
};

export const useActionPermissions = (props: PermissionsProps) => {
  const { playerHands, activeHandIndex, chips, bets, settings, gameState } = props;
  const currentHand = playerHands[activeHandIndex];
  const currentBet = bets[activeHandIndex] || 0;

  const canDouble = useMemo(() => {
    if (!currentHand || currentHand.length !== 2 || chips < currentBet) return false;
    if (playerHands.length > 1 && !settings.doubleAfterSplit) return false;
    const { value } = calculateHandValue(currentHand);
    if (settings.doubleDownRule === 'any') return true;
    return settings.doubleDownRule === '9_10_11' && [9, 10, 11].includes(value);
  }, [currentHand, chips, currentBet, playerHands.length, settings]);

  const canSplit = useMemo(() => {
    if (!currentHand || currentHand.length !== 2 || chips < currentBet) return false;
    return RANK_VALUES[currentHand[0].rank] === RANK_VALUES[currentHand[1].rank];
  }, [currentHand, chips, currentBet]);

  const canSurrender = useMemo(() => {
    return settings.surrenderEnabled && playerHands.length === 1 && playerHands[0]?.length === 2;
  }, [settings.surrenderEnabled, playerHands]);

  return { canDouble, canSplit, canSurrender };
};
