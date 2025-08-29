import { BaccaratGameState, BaccaratState } from '../../features/baccarat/types';
import { INITIAL_CHIPS, INITIAL_BACCARAT_SETTINGS } from '../../features/baccarat/constants';

export const initialBaccaratState: BaccaratState = {
    settings: INITIAL_BACCARAT_SETTINGS,
    deck: [],
    gameState: BaccaratGameState.BETTING,
    chips: INITIAL_CHIPS,
    playerHand: [],
    bankerHand: [],
    bets: { player: 0, banker: 0, tie: 0, playerPair: 0, bankerPair: 0 },
    lastBets: null,
    result: null,
    netRoundWinnings: 0,
    log: null,
};
