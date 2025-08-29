
import { useCallback, useEffect } from 'react';
import { IBaccaratState } from './useBaccaratState';
import { BaccaratGameState, Card, BaccaratResult } from '../types';
import { createDeck, shuffleDeck } from '../utils/deck';
import { calculateBaccaratValue } from '../utils/hand';
import { BACCARAT_RANK_VALUES } from '../constants';

const cardToString = (c: Card) => `${c.rank}${c.suit}`;

export const useRoundManager = (
  state: IBaccaratState,
  addLogEntry: (type: any, message: string) => void
) => {
    const { 
        settings, deck, setDeck, bets, setPlayerHand, setBankerHand,
        playerHand, bankerHand, setGameState, setResult, setChips, setNetRoundWinnings
    } = state;

    const runThirdCardLogic = useCallback(() => {
        let currentDeck = [...deck];
        let pHand = [...playerHand];
        let bHand = [...bankerHand];
        const pValue = calculateBaccaratValue(pHand);

        let playerDrew = false;
        let playerThirdCard: Card | null = null;
        
        // Player's Rule
        if (pValue <= 5) {
            playerDrew = true;
            playerThirdCard = currentDeck.pop()!;
            pHand.push(playerThirdCard);
            addLogEntry('game', `Player has ${pValue}, draws a ${cardToString(playerThirdCard)}.`);
        } else {
            addLogEntry('game', `Player has ${pValue}, stands.`);
        }
        setPlayerHand(pHand);

        const bValue = calculateBaccaratValue(bHand);
        let bankerDraws = false;

        // Banker's Rule
        if (playerDrew) {
            const pThirdCardValue = BACCARAT_RANK_VALUES[playerThirdCard!.rank];
            if (bValue <= 2) bankerDraws = true;
            else if (bValue === 3 && pThirdCardValue !== 8) bankerDraws = true;
            else if (bValue === 4 && [2,3,4,5,6,7].includes(pThirdCardValue)) bankerDraws = true;
            else if (bValue === 5 && [4,5,6,7].includes(pThirdCardValue)) bankerDraws = true;
            else if (bValue === 6 && [6,7].includes(pThirdCardValue)) bankerDraws = true;
        } else { // Player stood pat
            if (bValue <= 5) bankerDraws = true;
        }

        if (bankerDraws) {
            const bankerThirdCard = currentDeck.pop()!;
            bHand.push(bankerThirdCard);
            addLogEntry('game', `Banker has ${bValue}, draws a ${cardToString(bankerThirdCard)}.`);
        } else {
             addLogEntry('game', `Banker has ${bValue}, stands.`);
        }
        
        setBankerHand(bHand);
        setDeck(currentDeck);

        // All drawing logic finished, move to payout
        setTimeout(() => {
            const finalPlayerScore = calculateBaccaratValue(pHand);
            const finalBankerScore = calculateBaccaratValue(bHand);
            let winner: BaccaratResult;
            if (finalPlayerScore > finalBankerScore) winner = 'Player';
            else if (finalBankerScore > finalPlayerScore) winner = 'Banker';
            else winner = 'Tie';

            addLogEntry('payout', `Final Score -> Player: ${finalPlayerScore}, Banker: ${finalBankerScore}. Winner: ${winner}`);
            setResult({ winner, playerScore: finalPlayerScore, bankerScore: finalBankerScore });
        }, 1500);

    }, [deck, playerHand, bankerHand, setPlayerHand, setBankerHand, setDeck, setResult, addLogEntry]);


    const deal = useCallback(() => {
        addLogEntry('game', '--- Starting New Round ---');
        const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
        if (totalBet < settings.minBet) {
             addLogEntry('error', `Bet must be at least $${settings.minBet}`);
             return;
        }
        state.setLastBets(bets);
        setGameState(BaccaratGameState.DEALING);

        let currentDeck = deck.length < 30 ? shuffleDeck(createDeck(settings.deckCount)) : [...deck];

        const pHand = [currentDeck.pop()!, currentDeck.pop()!];
        const bHand = [currentDeck.pop()!, currentDeck.pop()!];
        
        setTimeout(() => {
            addLogEntry('game', `Player dealt: [${pHand.map(cardToString).join(', ')}]`);
            setPlayerHand(pHand);
        }, 500);
        setTimeout(() => {
            addLogEntry('game', `Banker dealt: [${bHand.map(cardToString).join(', ')}]`);
            setBankerHand(bHand);
        }, 1000);
        
        setDeck(currentDeck);

        setTimeout(() => {
            const pValue = calculateBaccaratValue(pHand);
            const bValue = calculateBaccaratValue(bHand);
            
            // Check for naturals
            if (pValue >= 8 || bValue >= 8) {
                addLogEntry('game', `Natural found. Player: ${pValue}, Banker: ${bValue}.`);
                let winner: BaccaratResult;
                if (pValue > bValue) winner = 'Player';
                else if (bValue > pValue) winner = 'Banker';
                else winner = 'Tie';
                setResult({ winner, playerScore: pValue, bankerScore: bValue });
            } else {
                runThirdCardLogic();
            }
        }, 1500);

    }, [bets, settings.minBet, settings.deckCount, deck, setDeck, setGameState, setPlayerHand, setBankerHand, addLogEntry, runThirdCardLogic, state]);


    useEffect(() => {
        if (!state.result) return;
        
        const { winner } = state.result;
        let winnings = 0;
        const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

        if (winner === 'Tie') {
            winnings += bets.tie * (settings.tiePayout + 1); // Payout + original bet
            winnings += bets.player; // Push
            winnings += bets.banker; // Push
            addLogEntry('payout', `Tie! Tie bet pays ${settings.tiePayout} to 1. Player/Banker bets push.`);
        } else {
            if (winner === 'Player') {
                winnings += bets.player * 2; // 1 to 1 payout + original
                addLogEntry('payout', 'Player wins! Player bet pays 1 to 1.');
            } else if (winner === 'Banker') {
                const commission = bets.banker * settings.bankerCommission;
                winnings += bets.banker * 2 - commission; // 1 to 1, less commission
                addLogEntry('payout', `Banker wins! Banker bet pays 1 to 1 with a $${commission.toFixed(2)} commission.`);
            }
        }

        // Side bets
        const pPair = playerHand.length === 2 && BACCARAT_RANK_VALUES[playerHand[0].rank] === BACCARAT_RANK_VALUES[playerHand[1].rank];
        const bPair = bankerHand.length === 2 && BACCARAT_RANK_VALUES[bankerHand[0].rank] === BACCARAT_RANK_VALUES[bankerHand[1].rank];

        if (pPair) {
            winnings += bets.playerPair * (settings.pairPayout + 1);
            addLogEntry('payout', `Player Pair! Side bet pays ${settings.pairPayout} to 1.`);
        }
        if (bPair) {
            winnings += bets.bankerPair * (settings.pairPayout + 1);
            addLogEntry('payout', `Banker Pair! Side bet pays ${settings.pairPayout} to 1.`);
        }

        setChips(c => c + winnings);
        setNetRoundWinnings(winnings - totalBet);
        setGameState(BaccaratGameState.ROUND_OVER);

    }, [state.result]);


    const nextRound = useCallback(() => {
        addLogEntry('game', '--- Preparing For Next Round ---');
        setGameState(BaccaratGameState.BETTING);
        setPlayerHand([]);
        setBankerHand([]);
        state.setBets({ player: 0, banker: 0, tie: 0, playerPair: 0, bankerPair: 0 });
        setResult(null);
        setNetRoundWinnings(0);
    }, [addLogEntry, setGameState, setPlayerHand, setBankerHand, state.setBets, setResult, setNetRoundWinnings]);

    return { deal, nextRound };
};
