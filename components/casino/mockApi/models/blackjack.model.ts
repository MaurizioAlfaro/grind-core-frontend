import { GameState, Card, GameResult, GameSettings } from '../../features/blackjack/types';
import { INITIAL_CHIPS, INITIAL_SETTINGS } from '../../features/blackjack/constants';

export interface BlackjackState {
    settings: GameSettings;
    deck: Card[];
    dealerHand: Card[];
    gameState: GameState;
    chips: number;
    playerHands: Card[][];
    bets: number[];
    activeHandIndex: number;
    gameResults: GameResult[];
    mainBet: number;
    lastBet: number;
    netRoundWinnings: number;
    insuranceBet: number;
    message: string | null;
    log: { type: any; message: string } | null;
}

export const initialBlackjackState: BlackjackState = {
    settings: INITIAL_SETTINGS,
    deck: [],
    dealerHand: [],
    gameState: GameState.BETTING,
    chips: INITIAL_CHIPS,
    playerHands: [],
    bets: [],
    activeHandIndex: 0,
    gameResults: [],
    mainBet: 0,
    lastBet: 0,
    netRoundWinnings: 0,
    insuranceBet: 0,
    message: null,
    log: null,
};
