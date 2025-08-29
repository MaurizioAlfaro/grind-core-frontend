import { GameState, GameResult, Rank, Card, GameSettings, Suit } from '../../features/blackjack/types';
import { BLACKJACK_PAYOUTS } from '../../features/blackjack/constants';
import { createDeck, shuffleDeck } from '../../features/blackjack/utils/deck';
import { calculateHandValue } from '../../features/blackjack/utils/hand';
import { apiRequest, loadGameState, saveGameState } from '../database';
import { BlackjackState, initialBlackjackState } from '../models/blackjack.model';

const HOLE_CARD_PLACEHOLDER: Card = { rank: Rank.HIDDEN, suit: Suit.HIDDEN };

// --- HELPERS ---
const sanitizeStateForClient = (state: BlackjackState): BlackjackState => {
    const clientState = JSON.parse(JSON.stringify(state));
    const cardShouldBeHidden = [
        GameState.PLAYER_TURN,
        GameState.INSURANCE_BETTING,
        GameState.EVEN_MONEY_CHOICE
    ].includes(clientState.gameState);

    if (cardShouldBeHidden && clientState.dealerHand.length > 1) {
        clientState.dealerHand[0] = HOLE_CARD_PLACEHOLDER;
    }
    // Never send the full deck to the client
    clientState.deck = []; 
    return clientState;
}

const createLog = (state: BlackjackState, type: any, message: string): BlackjackState => {
    return { ...state, log: { type, message } };
};

const resetTransients = (state: BlackjackState): BlackjackState => {
    return { ...state, log: null, message: null };
}

// --- GAME LOGIC (RUNS ON SERVER) ---

const runDealerLogic = (state: BlackjackState): BlackjackState => {
    let newState = { ...state };
    let { value: dValue, soft: dIsSoft } = calculateHandValue(newState.dealerHand);
    
    while (dValue < 17 || (dValue === 17 && dIsSoft && newState.settings.hitSoft17)) {
        const card = newState.deck.pop();
        if (!card) break;
        newState.dealerHand.push(card);
        const newV = calculateHandValue(newState.dealerHand);
        dValue = newV.value;
        dIsSoft = newV.soft;
    }
    
    let totalWinnings = 0;
    newState.playerHands.forEach((hand, index) => {
        if (newState.gameResults[index] === GameResult.PLAYER_BUST) return;
        const pValue = calculateHandValue(hand).value;
        
        let result: GameResult;
        let handWinnings = 0;
        
        if (dValue > 21 || pValue > dValue) {
            result = dValue > 21 ? GameResult.DEALER_BUST : GameResult.PLAYER_WINS;
            handWinnings = newState.bets[index] * 2;
        } else if (dValue > pValue) {
            result = GameResult.DEALER_WINS;
        } else {
            result = GameResult.PUSH;
            handWinnings = newState.bets[index];
        }
        newState.gameResults[index] = result;
        totalWinnings += handWinnings;
    });

    const totalBetAmount = newState.bets.reduce((a, b) => a + b, 0);
    newState.chips += totalWinnings;
    newState.netRoundWinnings = totalWinnings - totalBetAmount;
    newState.gameState = GameState.ROUND_OVER;
    return newState;
}

const advanceToNextHandOrDealer = (state: BlackjackState): BlackjackState => {
    if (state.activeHandIndex < state.playerHands.length - 1) {
        let newState = { ...state, activeHandIndex: state.activeHandIndex + 1 };
        return createLog(newState, 'state', `Advancing to player hand ${newState.activeHandIndex + 1}.`);
    } else {
        let newState = createLog(state, 'state', "--- Dealer's Turn ---");
        newState.gameState = GameState.DEALER_TURN;
        return runDealerLogic(newState);
    }
};

// --- CONTROLLER METHODS (API ENDPOINTS) ---

export const initGame = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    if (state.deck.length < 52) { // Initialize deck if it's empty or from a fresh load
        state = { ...state, deck: shuffleDeck(createDeck(state.settings.deckCount)) };
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const updateSettings = (newSettings: GameSettings) => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = {
        ...initialBlackjackState,
        chips: state.chips, // Keep existing chips
        settings: newSettings,
        deck: shuffleDeck(createDeck(newSettings.deckCount)),
    };
    state = createLog(state, 'info', `Settings updated. Game restarted with ${newSettings.deckCount} decks.`);
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

// Betting actions are now individual API calls
const changeBet = (amount: number) => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);

    if (state.gameState !== GameState.BETTING) return apiRequest(sanitizeStateForClient(state));
    
    const newBet = state.mainBet + amount;
    if (state.chips >= amount && newBet <= state.settings.maxBet) {
        state.chips -= amount;
        state.mainBet += amount;
        state = createLog(state, 'action', `Player bets $${amount}.`);
    } else {
        state = createLog(state, 'error', 'Invalid bet amount.');
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const placeBet = (amount: number) => changeBet(amount);

export const clearBet = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    if (state.gameState === GameState.BETTING && state.mainBet > 0) {
        state.chips += state.mainBet;
        state = createLog(state, 'action', `Cleared bet of $${state.mainBet}.`);
        state.mainBet = 0;
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
};

export const repeatBet = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
     if (state.gameState === GameState.BETTING && state.lastBet > 0 && (state.chips + state.mainBet) >= state.lastBet) {
      state = createLog(state, 'action', `Repeating last bet of $${state.lastBet}.`);
      state.chips = state.chips + state.mainBet - state.lastBet;
      state.mainBet = state.lastBet;
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const maxBet = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    if (state.gameState !== GameState.BETTING) return apiRequest(sanitizeStateForClient(state));

    const amountToBet = Math.min(state.chips + state.mainBet, state.settings.maxBet);
    if (amountToBet > state.mainBet) {
        state = createLog(state, 'action', `Player bets max: $${amountToBet}.`);
        state.chips = state.chips - (amountToBet - state.mainBet);
        state.mainBet = amountToBet;
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}


export const deal = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    
    // Validation
    if (state.gameState !== GameState.BETTING || state.mainBet < state.settings.minBet) {
        state = createLog(state, 'error', `Bet must be between $${state.settings.minBet} and $${state.settings.maxBet}.`);
        return apiRequest(sanitizeStateForClient(state));
    }
    
    state.lastBet = state.mainBet;
    if (state.deck.length < 52) {
        state.deck = shuffleDeck(createDeck(state.settings.deckCount));
    }
    
    state.playerHands = [[state.deck.pop()!, state.deck.pop()!]];
    state.dealerHand = [state.deck.pop()!, state.deck.pop()!];
    state.bets = [state.mainBet];
    state.gameResults = [GameResult.NONE];
    state.netRoundWinnings = 0;
    state.insuranceBet = 0;
    state.activeHandIndex = 0;

    const pVal = calculateHandValue(state.playerHands[0]).value;
    const dVal = calculateHandValue(state.dealerHand).value;

    if (pVal === 21) {
        if (state.dealerHand[1]?.rank === Rank.Ace && state.settings.insuranceEnabled) {
            state.gameState = GameState.EVEN_MONEY_CHOICE;
        } else if (dVal === 21) {
            state.chips += state.mainBet; // Push
            state.gameResults = [GameResult.PUSH];
            state.gameState = GameState.ROUND_OVER;
        } else {
            const payout = state.mainBet * BLACKJACK_PAYOUTS[state.settings.blackjackPayout];
            state.chips += state.mainBet + payout;
            state.netRoundWinnings = payout;
            state.gameResults = [GameResult.PLAYER_BLACKJACK];
            state.gameState = GameState.ROUND_OVER;
        }
    } else if (state.dealerHand[1]?.rank === Rank.Ace && state.settings.insuranceEnabled) {
        state.gameState = GameState.INSURANCE_BETTING;
    } else if (dVal === 21) {
        state.netRoundWinnings = -state.mainBet;
        state.gameResults = [GameResult.DEALER_BLACKJACK];
        state.gameState = GameState.ROUND_OVER;
    } else {
        state.gameState = GameState.PLAYER_TURN;
    }
    state = createLog(state, 'game', `--- Starting New Round --- Bet: $${state.mainBet}`);
    state.mainBet = 0; 
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const nextRound = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    state = {
        ...state,
        gameState: GameState.BETTING,
        playerHands: [],
        dealerHand: [],
        mainBet: 0,
        bets: [],
        gameResults: [],
    };
    state = createLog(state, 'game', '--- Preparing For Next Round ---');
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const hit = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    if (state.gameState !== GameState.PLAYER_TURN) return apiRequest(sanitizeStateForClient(state));

    const newCard = state.deck.pop()!;
    state.playerHands[state.activeHandIndex].push(newCard);
    
    const { value } = calculateHandValue(state.playerHands[state.activeHandIndex]);
    state = createLog(state, 'action', `Player HITS. New value: ${value}`);

    if (value >= 21) {
        if (value > 21) {
            state.gameResults[state.activeHandIndex] = GameResult.PLAYER_BUST;
        }
        state = advanceToNextHandOrDealer(state);
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state), value >= 21 ? 700 : 200);
}

export const stand = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    if (state.gameState !== GameState.PLAYER_TURN) return apiRequest(sanitizeStateForClient(state));

    state = createLog(state, 'action', `Player STANDS on hand ${state.activeHandIndex + 1}.`);
    state = advanceToNextHandOrDealer(state);
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state), 700);
}

export const double = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    const bet = state.bets[state.activeHandIndex];

    if (state.gameState !== GameState.PLAYER_TURN || state.chips < bet) {
         state = createLog(state, 'error', 'Cannot double down.');
         return apiRequest(sanitizeStateForClient(state));
    }
    
    state.chips -= bet;
    state.bets[state.activeHandIndex] *= 2;
    const newCard = state.deck.pop()!;
    state.playerHands[state.activeHandIndex].push(newCard);
    
    if (calculateHandValue(state.playerHands[state.activeHandIndex]).value > 21) {
         state.gameResults[state.activeHandIndex] = GameResult.PLAYER_BUST;
    }
    state = createLog(state, 'action', `Player DOUBLES DOWN.`);
    state = advanceToNextHandOrDealer(state);
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state), 700);
}

export const split = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    const hand = state.playerHands[state.activeHandIndex];
    const bet = state.bets[state.activeHandIndex];

    if (state.gameState !== GameState.PLAYER_TURN || state.chips < bet || hand.length !== 2) {
        return apiRequest(sanitizeStateForClient(state));
    }
    
    state.chips -= bet;
    const hand1 = [hand[0], state.deck.pop()!];
    const hand2 = [hand[1], state.deck.pop()!];
    
    state.playerHands.splice(state.activeHandIndex, 1, hand1, hand2);
    state.bets.splice(state.activeHandIndex, 1, bet, bet);
    state.gameResults.splice(state.activeHandIndex, 1, GameResult.NONE, GameResult.NONE);
    state = createLog(state, 'action', `Player SPLITS.`);
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const surrender = () => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
     if (state.gameState !== GameState.PLAYER_TURN) return apiRequest(sanitizeStateForClient(state));

    const surrenderedBet = state.bets[0];
    const refund = surrenderedBet / 2;
    state.chips += refund;
    state.gameResults = [GameResult.SURRENDER];
    state.netRoundWinnings = -refund;
    state.gameState = GameState.ROUND_OVER;
    state = createLog(state, 'action', `Player SURRENDERS.`);
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const decideInsurance = (accepted: boolean) => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    const mainBet = state.bets.reduce((a, b) => a + b, 0);
    let cost = 0;

    if (accepted) {
        cost = mainBet / 2;
        if (state.chips < cost) {
            state = createLog(state, 'error', 'Not enough chips for insurance.');
            return apiRequest(sanitizeStateForClient(state));
        }
        state.chips -= cost;
        state.insuranceBet = cost;
    }

    if (calculateHandValue(state.dealerHand).value === 21) {
        if(cost > 0) state.chips += cost * 3;
        state.gameResults = [GameResult.DEALER_BLACKJACK];
        state.netRoundWinnings = cost * 2 - mainBet;
        state.gameState = GameState.ROUND_OVER;
    } else {
        state.message = 'Dealer does not have Blackjack';
        state.gameState = GameState.PLAYER_TURN;
    }
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}

export const decideEvenMoney = (accepted: boolean) => {
    let state = loadGameState('blackjack', initialBlackjackState);
    state = resetTransients(state);
    const mainBet = state.bets.reduce((a, b) => a + b, 0);

    if (accepted) {
        state.chips += mainBet * 2;
        state.netRoundWinnings = mainBet;
        state.gameResults = [GameResult.PLAYER_WINS];
    } else {
        if (calculateHandValue(state.dealerHand).value === 21) {
            state.chips += mainBet;
            state.gameResults = [GameResult.PUSH];
        } else {
            const payout = mainBet * BLACKJACK_PAYOUTS[state.settings.blackjackPayout];
            state.chips += mainBet + payout;
            state.netRoundWinnings = payout;
            state.gameResults = [GameResult.PLAYER_BLACKJACK];
        }
    }
    state.gameState = GameState.ROUND_OVER;
    saveGameState('blackjack', state);
    return apiRequest(sanitizeStateForClient(state));
}
