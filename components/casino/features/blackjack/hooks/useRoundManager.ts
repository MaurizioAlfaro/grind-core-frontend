
import { useCallback } from 'react';
import { GameState, GameResult, Rank, Card } from '../types';
import { useGameLogger } from './useGameLogger';
import { IGameState } from './useGameState';
import { calculateHandValue } from '../utils/hand';
import { createDeck, shuffleDeck } from '../utils/deck';
import { BLACKJACK_PAYOUTS } from '../constants';

const cardToString = (c: Card) => `${c.rank}${c.suit}`;

const endRoundWithBlackjack = (state: IGameState, log: any, payout: number, result: GameResult) => {
    log('payout', `Player has Blackjack! Payout: $${payout}`);
    state.setChips(prev => prev + state.mainBet + payout);
    state.setNetRoundWinnings(payout);
    state.setGameResults([result]);
    state.setGameState(GameState.ROUND_OVER);
};

export const useRoundManager = (
  state: IGameState,
  addLogEntry: ReturnType<typeof useGameLogger>['addLogEntry']
) => {
    const { gameState, setGameState, deck, setDeck, setPlayerHands, setDealerHand, setBets, setGameResults, setNetRoundWinnings, setInsuranceBet, setActiveHandIndex, mainBet, setLastBet, settings, dealerHand, setChips } = state;

    const deal = () => {
        if (gameState !== GameState.BETTING || mainBet < settings.minBet) return;
        addLogEntry('game', `--- Starting New Round --- Bet: $${mainBet}`);
        setLastBet(mainBet);
        let currentDeck = deck.length < 52 ? shuffleDeck(createDeck(settings.deckCount)) : [...deck];
        
        const pHand = [currentDeck.pop()!, currentDeck.pop()!];
        const dHand = [currentDeck.pop()!, currentDeck.pop()!];
        addLogEntry('game', `Player dealt: [${pHand.map(cardToString).join(', ')}]`);
        addLogEntry('game', `Dealer dealt: [Face Down, ${cardToString(dHand[1])}]`);
        
        setPlayerHands([pHand]);
        setDealerHand(dHand);
        setDeck(currentDeck);
        setBets([mainBet]);
        setGameResults([GameResult.NONE]);
        setNetRoundWinnings(0);
        setInsuranceBet(0);
        setActiveHandIndex(0);
        
        const pVal = calculateHandValue(pHand).value;
        const dVal = calculateHandValue(dHand).value;

        if (pVal === 21) {
            if (dHand[1]?.rank === Rank.Ace && settings.insuranceEnabled) {
                setGameState(GameState.EVEN_MONEY_CHOICE);
            } else if (dVal === 21) {
                setChips(prev => prev + mainBet);
                setGameResults([GameResult.PUSH]);
                setGameState(GameState.ROUND_OVER);
            } else {
                const payout = mainBet * BLACKJACK_PAYOUTS[settings.blackjackPayout];
                endRoundWithBlackjack(state, addLogEntry, payout, GameResult.PLAYER_BLACKJACK);
            }
        } else if (dHand[1]?.rank === Rank.Ace && settings.insuranceEnabled) {
            setGameState(GameState.INSURANCE_BETTING);
        } else if (dVal === 21) {
            setGameResults([GameResult.DEALER_BLACKJACK]);
            setNetRoundWinnings(-mainBet);
            setGameState(GameState.ROUND_OVER);
        } else {
            setGameState(GameState.PLAYER_TURN);
        }
    };
  
  const decideInsurance = (accepted: boolean) => {
      let cost = 0;
      if (accepted) {
          cost = mainBet / 2;
          setChips(prev => prev - cost);
          setInsuranceBet(cost);
          addLogEntry('action', `Insurance bet of $${cost} placed.`);
      }

      if (calculateHandValue(dealerHand).value === 21) {
          addLogEntry('game', 'Dealer has Blackjack.');
          if(cost > 0) setChips(prev => prev + cost * 3); // Payout + original bet
          setGameResults([GameResult.DEALER_BLACKJACK]);
          setNetRoundWinnings(cost * 2 - mainBet);
          setGameState(GameState.ROUND_OVER);
      } else {
          addLogEntry('game', 'Dealer does not have Blackjack. Insurance lost.');
          setGameState(GameState.PLAYER_TURN);
      }
  };

  const decideEvenMoney = (accepted: boolean) => {
    if (accepted) {
        addLogEntry('payout', `Even Money accepted. Player wins $${mainBet}.`);
        endRoundWithBlackjack(state, addLogEntry, mainBet, GameResult.PLAYER_WINS);
    } else {
        addLogEntry('decision', `Player risks it against dealer's Ace.`);
        if (calculateHandValue(dealerHand).value === 21) {
            addLogEntry('payout', 'Both have Blackjack. PUSH.');
            setChips(prev => prev + mainBet);
            setGameResults([GameResult.PUSH]);
        } else {
            const payout = mainBet * BLACKJACK_PAYOUTS[settings.blackjackPayout];
            endRoundWithBlackjack(state, addLogEntry, payout, GameResult.PLAYER_BLACKJACK);
        }
        setGameState(GameState.ROUND_OVER);
    }
  };

  const nextRound = () => {
    addLogEntry('game', '--- Preparing For Next Round ---');
    setGameState(GameState.BETTING);
    setPlayerHands([]);
    setDealerHand([]);
    state.setMainBet(0);
    setBets([]);
    setInsuranceBet(0);
    setGameResults([]);
  };

  return { deal, decideInsurance, decideEvenMoney, nextRound };
};
