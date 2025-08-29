import { BaccaratGameState, Card, BaccaratResult, BaccaratSettings, BaccaratBetType, BaccaratState, LogType } from '../../features/baccarat/types';
import { BACCARAT_RANK_VALUES } from '../../features/baccarat/constants';
import { createDeck, shuffleDeck } from '../../features/baccarat/utils/deck';
import { calculateBaccaratValue } from '../../features/baccarat/utils/hand';
import { apiRequest, loadGameState, saveGameState } from '../database';
import { initialBaccaratState } from '../models/baccarat.model';

// --- HELPERS ---
const sanitizeStateForClient = (state: BaccaratState): BaccaratState => {
    const clientState = JSON.parse(JSON.stringify(state));
    // Never send the full deck to the client
    clientState.deck = []; 
    return clientState;
}

const createLog = (state: BaccaratState, type: LogType, message: string): BaccaratState => {
    return { ...state, log: { type, message } };
};

const resetLog = (state: BaccaratState): BaccaratState => {
    return { ...state, log: null };
}

// --- GAME LOGIC (RUNS ON SERVER) ---
const calculatePayouts = (state: BaccaratState): BaccaratState => {
    let newState = {...state};
    const { winner } = newState.result!;
    let winnings = 0;
    const totalBet = Object.values(newState.bets).reduce((a, b) => a + b, 0);

    if (winner === 'Tie') {
        winnings += newState.bets.tie * (newState.settings.tiePayout + 1);
        winnings += newState.bets.player;
        winnings += newState.bets.banker;
    } else {
        if (winner === 'Player') {
            winnings += newState.bets.player * 2;
        } else if (winner === 'Banker') {
            const commission = newState.bets.banker * newState.settings.bankerCommission;
            winnings += newState.bets.banker * 2 - commission;
        }
    }

    const pPair = newState.playerHand.length === 2 && BACCARAT_RANK_VALUES[newState.playerHand[0].rank] === BACCARAT_RANK_VALUES[newState.playerHand[1].rank];
    const bPair = newState.bankerHand.length === 2 && BACCARAT_RANK_VALUES[newState.bankerHand[0].rank] === BACCARAT_RANK_VALUES[newState.bankerHand[1].rank];

    if (pPair) winnings += newState.bets.playerPair * (newState.settings.pairPayout + 1);
    if (bPair) winnings += newState.bets.bankerPair * (newState.settings.pairPayout + 1);

    newState.chips += winnings;
    newState.netRoundWinnings = winnings - totalBet;
    newState.gameState = BaccaratGameState.ROUND_OVER;
    return newState;
}

const runThirdCardLogic = (state: BaccaratState): BaccaratState => {
    let newState = {...state};
    let pHand = [...newState.playerHand];
    let bHand = [...newState.bankerHand];
    const pValue = calculateBaccaratValue(pHand);
    let playerDrew = false;
    let playerThirdCard: Card | null = null;
    
    if (pValue <= 5) {
        playerDrew = true;
        playerThirdCard = newState.deck.pop()!;
        pHand.push(playerThirdCard);
    }
    newState.playerHand = pHand;

    const bValue = calculateBaccaratValue(bHand);
    let bankerDraws = false;
    if (playerDrew) {
        const pThirdCardValue = BACCARAT_RANK_VALUES[playerThirdCard!.rank];
        if (bValue <= 2) bankerDraws = true;
        else if (bValue === 3 && pThirdCardValue !== 8) bankerDraws = true;
        else if (bValue === 4 && [2,3,4,5,6,7].includes(pThirdCardValue)) bankerDraws = true;
        else if (bValue === 5 && [4,5,6,7].includes(pThirdCardValue)) bankerDraws = true;
        else if (bValue === 6 && [6,7].includes(pThirdCardValue)) bankerDraws = true;
    } else {
        if (bValue <= 5) bankerDraws = true;
    }

    if (bankerDraws) {
        bHand.push(newState.deck.pop()!);
    }
    newState.bankerHand = bHand;
    
    const finalPlayerScore = calculateBaccaratValue(pHand);
    const finalBankerScore = calculateBaccaratValue(bHand);
    let winner: BaccaratResult = finalPlayerScore > finalBankerScore ? 'Player' : finalBankerScore > finalPlayerScore ? 'Banker' : 'Tie';
    
    newState.result = { winner, playerScore: finalPlayerScore, bankerScore: finalBankerScore };
    return calculatePayouts(newState);
}

// --- CONTROLLER METHODS (API ENDPOINTS) ---
export const initGame = () => {
    let state = loadGameState('baccarat', initialBaccaratState);
    if (state.deck.length < 52) {
        state = {...state, deck: shuffleDeck(createDeck(state.settings.deckCount)) };
    }
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const updateSettings = (newSettings: BaccaratSettings) => {
    let state = loadGameState('baccarat', initialBaccaratState);
    state = {
        ...initialBaccaratState,
        chips: state.chips, // Keep chips
        settings: newSettings,
        deck: shuffleDeck(createDeck(newSettings.deckCount)),
    };
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const placeBet = (betType: BaccaratBetType, amount: number) => {
    let state = loadGameState('baccarat', initialBaccaratState);
    state = resetLog(state);
    if (state.gameState !== BaccaratGameState.BETTING) return apiRequest(sanitizeStateForClient(state));

    if (state.chips >= amount) {
        state.chips -= amount;
        state.bets[betType] = (state.bets[betType] || 0) + amount;
        state = createLog(state, 'action', `Bet $${amount} on ${betType}.`);
    } else {
        state = createLog(state, 'error', `Not enough chips.`);
    }
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const clearBets = () => {
    let state = loadGameState('baccarat', initialBaccaratState);
    state = resetLog(state);
    if (state.gameState !== BaccaratGameState.BETTING) return apiRequest(sanitizeStateForClient(state));

    const totalBet = Object.values(state.bets).reduce((a, b) => a + b, 0);
    if (totalBet > 0) {
        state.chips += totalBet;
        state.bets = { player: 0, banker: 0, tie: 0, playerPair: 0, bankerPair: 0 };
        state = createLog(state, 'action', 'Bets cleared.');
    }
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const repeatLastBet = () => {
    let state = loadGameState('baccarat', initialBaccaratState);
    state = resetLog(state);
    if (state.gameState !== BaccaratGameState.BETTING || !state.lastBets) return apiRequest(sanitizeStateForClient(state));

    const totalCurrentBet = Object.values(state.bets).reduce((a, b) => a + b, 0);
    const totalLastBet = Object.values(state.lastBets).reduce((a, b) => a + b, 0);

    if ((state.chips + totalCurrentBet) >= totalLastBet) {
        state = createLog(state, 'action', 'Repeating last bet.');
        state.chips = state.chips + totalCurrentBet - totalLastBet;
        state.bets = { ...state.lastBets };
    } else {
        state = createLog(state, 'error', 'Not enough chips to repeat last bet.');
    }
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state));
};


export const deal = () => {
    let state = loadGameState('baccarat', initialBaccaratState);
    state = resetLog(state);
    
    const totalBet = Object.values(state.bets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) {
        return apiRequest(sanitizeStateForClient(state));
    }
    
    state.lastBets = { ...state.bets };
    state.gameState = BaccaratGameState.DEALING;

    if (state.deck.length < 30) {
        state.deck = shuffleDeck(createDeck(state.settings.deckCount));
    }

    state.playerHand = [state.deck.pop()!, state.deck.pop()!];
    state.bankerHand = [state.deck.pop()!, state.deck.pop()!];

    const pValue = calculateBaccaratValue(state.playerHand);
    const bValue = calculateBaccaratValue(state.bankerHand);

    if (pValue >= 8 || bValue >= 8) { // Natural
        let winner: BaccaratResult = pValue > bValue ? 'Player' : bValue > pValue ? 'Banker' : 'Tie';
        state.result = { winner, playerScore: pValue, bankerScore: bValue };
        state = calculatePayouts(state);
    } else {
        state = runThirdCardLogic(state);
    }
    
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state), 100); 
}

export const nextRound = () => {
    let state = loadGameState('baccarat', initialBaccaratState);
    state = resetLog(state);
    state = {
        ...state,
        gameState: BaccaratGameState.BETTING,
        playerHand: [],
        bankerHand: [],
        bets: { player: 0, banker: 0, tie: 0, playerPair: 0, bankerPair: 0 },
        result: null,
        netRoundWinnings: 0,
    };
    state = createLog(state, 'game', '--- Preparing For Next Round ---');
    saveGameState('baccarat', state);
    return apiRequest(sanitizeStateForClient(state));
}
