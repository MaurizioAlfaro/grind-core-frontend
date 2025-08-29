import { RouletteGameState, RouletteNumber, RouletteSettings } from '../../features/roulette/types';
import { WHEEL_NUMBERS, PAYOUTS } from '../../features/roulette/constants';
import { isWinningBet } from '../../features/roulette/utils/helpers';
import { apiRequest, loadGameState, saveGameState } from '../database';
import { RouletteState, initialRouletteState } from '../models/roulette.model';

// --- HELPERS ---
const sanitizeStateForClient = (state: RouletteState): RouletteState => {
    return JSON.parse(JSON.stringify(state));
};

const createLog = (state: RouletteState, type: any, message: string): RouletteState => {
    return { ...state, log: { type, message } };
};

const resetLog = (state: RouletteState): RouletteState => {
    return { ...state, log: null };
};

// --- CONTROLLER METHODS (API ENDPOINTS) ---
export const initGame = () => {
    let state = loadGameState('roulette', initialRouletteState);
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const updateSettings = (newSettings: RouletteSettings) => {
    let state = loadGameState('roulette', initialRouletteState);
    state = {
        ...initialRouletteState,
        chips: state.chips, // Keep chips
        settings: newSettings,
    };
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const placeBet = (betType: string, amount: number) => {
    let state = loadGameState('roulette', initialRouletteState);
    state = resetLog(state);
    if (state.gameState !== RouletteGameState.BETTING) return apiRequest(sanitizeStateForClient(state));

    if (state.chips >= amount) {
        state.chips -= amount;
        state.bets[betType] = (state.bets[betType] || 0) + amount;
        state = createLog(state, 'action', `Bet $${amount} on ${betType}.`);
    } else {
        state = createLog(state, 'error', `Not enough chips.`);
    }
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const clearBets = () => {
    let state = loadGameState('roulette', initialRouletteState);
    state = resetLog(state);
    if (state.gameState !== RouletteGameState.BETTING) return apiRequest(sanitizeStateForClient(state));

    const totalBet = Object.values(state.bets).reduce((a, b) => a + b, 0);
    if (totalBet > 0) {
        state.chips += totalBet;
        state.bets = {};
        state = createLog(state, 'action', 'All bets cleared.');
    }
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const repeatLastBet = () => {
    let state = loadGameState('roulette', initialRouletteState);
    state = resetLog(state);
    if (state.gameState !== RouletteGameState.BETTING || !state.lastBets) return apiRequest(sanitizeStateForClient(state));

    const totalCurrentBet = Object.values(state.bets).reduce((a, b) => a + b, 0);
    const totalLastBet = Object.values(state.lastBets).reduce((a, b) => a + b, 0);

    if ((state.chips + totalCurrentBet) >= totalLastBet) {
        state = createLog(state, 'action', 'Repeating last bet.');
        state.chips = state.chips + totalCurrentBet - totalLastBet;
        state.bets = { ...state.lastBets };
    } else {
        state = createLog(state, 'error', 'Not enough chips to repeat last bet.');
    }
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const spin = () => {
    let state = loadGameState('roulette', initialRouletteState);
    state = resetLog(state);
    if (Object.keys(state.bets).length === 0) {
        return apiRequest(sanitizeStateForClient(state));
    }
    
    state.lastBets = { ...state.bets };
    state.gameState = RouletteGameState.SPINNING;
    
    const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
    state.winningNumber = WHEEL_NUMBERS[randomIndex];
    state.spinTargetIndex = randomIndex;
    
    state = createLog(state, 'game', '--- Spinning the wheel... ---');
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state), 100);
};

export const calculatePayouts = () => {
    let state = loadGameState('roulette', initialRouletteState);
    state = resetLog(state);

    if (!state.winningNumber) {
        state.gameState = RouletteGameState.BETTING;
        saveGameState('roulette', state);
        return apiRequest(sanitizeStateForClient(state));
    }

    const winner = state.winningNumber;
    let roundWinnings = 0;
    const totalBet = Object.values(state.bets).reduce((a, b) => a + b, 0);

    for (const betType in state.bets) {
        if (isWinningBet(betType, winner)) {
            const betAmount = state.bets[betType];
            const payoutKey = betType.split('_')[0];
            const payoutRate = PAYOUTS[payoutKey] || 0;
            const winAmount = betAmount * payoutRate;
            roundWinnings += winAmount + betAmount;
        }
    }
    
    state.chips += roundWinnings;
    state.netRoundWinnings = roundWinnings - totalBet;
    state.gameState = RouletteGameState.PAYOUT;
    state.spinHistory = [winner, ...state.spinHistory].slice(0, 14);
    state = createLog(state, 'game', `The winning number is ${winner.value} ${winner.color}!`);
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const nextRound = () => {
    let state = loadGameState('roulette', initialRouletteState);
    state = resetLog(state);
    state = {
        ...state,
        gameState: RouletteGameState.BETTING,
        bets: {},
        winningNumber: null,
        spinTargetIndex: null,
        netRoundWinnings: 0,
    };
    state = createLog(state, 'game', '--- New Round ---');
    saveGameState('roulette', state);
    return apiRequest(sanitizeStateForClient(state));
};
