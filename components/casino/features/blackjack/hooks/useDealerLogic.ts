
import { useEffect } from 'react';
import { GameState, GameResult, Card } from '../types';
import { useGameLogger } from './useGameLogger';
import { IGameState } from './useGameState';
import { calculateHandValue } from '../utils/hand';

const cardToString = (c: Card) => `${c.rank}${c.suit}`;

const evaluateOutcome = (dValue: number, pValue: number, handBet: number, index: number, log: any) => {
    if (dValue > 21) {
        log('payout', `Hand ${index+1}: Dealer BUSTS. Player WINS $${handBet}.`);
        return { result: GameResult.DEALER_BUST, winnings: handBet * 2 };
    }
    if (pValue > dValue) {
        log('payout', `Hand ${index+1} (${pValue} vs ${dValue}): Player WINS $${handBet}.`);
        return { result: GameResult.PLAYER_WINS, winnings: handBet * 2 };
    }
    if (dValue > pValue) {
        log('payout', `Hand ${index+1} (${pValue} vs ${dValue}): Dealer WINS.`);
        return { result: GameResult.DEALER_WINS, winnings: 0 };
    }
    log('payout', `Hand ${index+1} (${pValue} vs ${dValue}): PUSH.`);
    return { result: GameResult.PUSH, winnings: handBet };
};

const runDealerPlay = (state: IGameState, addLogEntry: any) => {
    let currentDealerHand = [...state.dealerHand];
    let currentDeck = [...state.deck];
    let { value: dValue, soft: dIsSoft } = calculateHandValue(currentDealerHand);
    addLogEntry('game', `Dealer reveals [${currentDealerHand.map(cardToString).join(', ')}]. Value: ${dValue}`);
    
    while (dValue < 17 || (dValue === 17 && dIsSoft && state.settings.hitSoft17)) {
        addLogEntry('decision', `Dealer has ${dValue}${dIsSoft ? ' (soft)' : ''}, must HIT.`);
        const card = currentDeck.pop();
        if (!card) break;
        currentDealerHand.push(card);
        const newV = calculateHandValue(currentDealerHand);
        dValue = newV.value;
        dIsSoft = newV.soft;
        addLogEntry('game', `Dealer draws ${cardToString(card)}. New value: ${dValue}`);
    }
    
    addLogEntry('decision', dValue > 21 ? `Dealer BUSTS with ${dValue}.` : `Dealer STANDS with ${dValue}.`);
    state.setDealerHand(currentDealerHand);
    state.setDeck(currentDeck);
    
    let totalWinnings = 0;
    const finalResults = [...state.gameResults];
    state.playerHands.forEach((hand, index) => {
        if (finalResults[index] === GameResult.PLAYER_BUST) {
            addLogEntry('payout', `Hand ${index + 1}: Player already BUSTED.`);
            return;
        }
        const pValue = calculateHandValue(hand).value;
        const outcome = evaluateOutcome(dValue, pValue, state.bets[index], index, addLogEntry);
        finalResults[index] = outcome.result;
        totalWinnings += outcome.winnings;
    });

    const totalBetAmount = state.bets.reduce((a, b) => a + b, 0);
    state.setChips(prev => prev + totalWinnings);
    state.setGameResults(finalResults);
    state.setNetRoundWinnings(totalWinnings - totalBetAmount);
    addLogEntry('state', 'Round Over.');
    state.setGameState(GameState.ROUND_OVER);
};

export const useDealerLogic = (
    state: IGameState,
    addLogEntry: ReturnType<typeof useGameLogger>['addLogEntry']
) => {
    useEffect(() => {
        if (state.gameState !== GameState.DEALER_TURN) return;

        const timer = setTimeout(() => runDealerPlay(state, addLogEntry), 1000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.gameState]);
};
