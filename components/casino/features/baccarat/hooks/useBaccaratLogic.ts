import { useCallback, useEffect, useState } from 'react';
import { useGameLogger } from './useGameLogger';
import * as baccaratApi from '../../../mockApi/routes/baccarat.routes';
import { BaccaratGameState, BaccaratBetType, BaccaratSettings, BaccaratState } from '../types';
import { useBaccaratState } from './useBaccaratState';

export const useBaccaratLogic = () => {
    const state = useBaccaratState();
    const { log, addLogEntry, clearLog } = useGameLogger();
    const [isLoading, setIsLoading] = useState(true);

    const updateStateFromApi = (apiState: BaccaratState) => {
        state.setSettings(apiState.settings);
        state.setDeck(apiState.deck);
        state.setGameState(apiState.gameState);
        state.setChips(apiState.chips);
        state.setPlayerHand(apiState.playerHand);
        state.setBankerHand(apiState.bankerHand);
        state.setBets(apiState.bets);
        state.setLastBets(apiState.lastBets);
        state.setResult(apiState.result);
        state.setNetRoundWinnings(apiState.netRoundWinnings);
        if (apiState.log) {
            addLogEntry(apiState.log.type, apiState.log.message);
        }
    };
    
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const initialState = await baccaratApi.initGame();
            updateStateFromApi(initialState);
            addLogEntry('info', `Game loaded. Shuffling ${initialState.settings.deckCount} decks.`);
            setIsLoading(false);
        }
        init();
    }, [addLogEntry]);

    const performAction = useCallback(async (action: Promise<any>) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newState = await action;
            updateStateFromApi(newState);
        } catch (error) {
            console.error("API Error:", error);
            addLogEntry('error', 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, addLogEntry]);

    const placeBet = (type: BaccaratBetType, amount: number) => performAction(baccaratApi.placeBet(type, amount));
    const clearBets = () => performAction(baccaratApi.clearBets());
    const repeatLastBet = () => performAction(baccaratApi.repeatLastBet());
    const deal = () => performAction(baccaratApi.deal());
    const nextRound = () => performAction(baccaratApi.nextRound());
    const handleSaveSettings = (newSettings: BaccaratSettings) => performAction(baccaratApi.updateSettings(newSettings));

    return {
        ...state,
        log,
        isLoading,
        actions: {
            deal,
            nextRound,
            placeBet,
            clearBets,
            repeatLastBet,
            clearLog,
            handleSaveSettings,
        }
    };
}
