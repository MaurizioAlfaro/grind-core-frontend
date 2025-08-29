import { RouletteGameState, RouletteNumber, RouletteSettings } from '../../features/roulette/types';
import { INITIAL_CHIPS, INITIAL_ROULETTE_SETTINGS } from '../../features/roulette/constants';

export interface RouletteState {
    settings: RouletteSettings,
    gameState: RouletteGameState,
    chips: number,
    bets: Record<string, number>,
    lastBets: Record<string, number> | null,
    winningNumber: RouletteNumber | null,
    spinTargetIndex: number | null,
    netRoundWinnings: number,
    spinHistory: RouletteNumber[],
    log: {type: any, message: string} | null
}

export const initialRouletteState: RouletteState = {
    settings: INITIAL_ROULETTE_SETTINGS,
    gameState: RouletteGameState.BETTING,
    chips: INITIAL_CHIPS,
    bets: {},
    lastBets: null,
    winningNumber: null,
    spinTargetIndex: null,
    netRoundWinnings: 0,
    spinHistory: [],
    log: null,
};
