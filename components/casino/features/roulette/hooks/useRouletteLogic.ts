import { useRouletteState } from './useRouletteState';
import { useGameLogger } from './useGameLogger';
import { RouletteSettings } from '../types';
import * as rouletteApi from '../../../mockApi/routes/roulette.routes';
import { useCallback, useEffect, useState } from 'react';

export const useRouletteLogic = () => {
    const state = useRouletteState();
    const { log, addLogEntry, clearLog } = useGameLogger();
    const [isLoading, setIsLoading] = useState(true);

    const updateStateFromApi = (apiState: any) => {
        state.setSettings(apiState.settings);
        state.setGameState(apiState.gameState);
        state.setChips(apiState.chips);
        state.setBets(apiState.bets);
        state.setLastBets(apiState.lastBets);
        state.setWinningNumber(apiState.winningNumber);
        state.setSpinTargetIndex(apiState.spinTargetIndex);
        state.setNetRoundWinnings(apiState.netRoundWinnings);
        state.setSpinHistory(apiState.spinHistory);
        if (apiState.log) {
            addLogEntry(apiState.log.type, apiState.log.message);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const initialState = await rouletteApi.initGame();
            updateStateFromApi(initialState);
            addLogEntry('info', 'Roulette game loaded.');
            setIsLoading(false);
        }
        init();
    }, [addLogEntry]);

    const performAction = useCallback(async (action: Promise<any>, isSpin: boolean = false) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newState = await action;
            updateStateFromApi(newState);
             if (isSpin) {
                // Keep loading true during spin animation, then call for payouts
                setTimeout(() => {
                    performAction(rouletteApi.calculatePayouts());
                }, 8300);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("API Error:", error);
            addLogEntry('error', 'An error occurred.');
            setIsLoading(false);
        }
    }, [isLoading, addLogEntry]);

    const placeBet = (betType: string, amount: number) => performAction(rouletteApi.placeBet(betType, amount));
    const clearBets = () => performAction(rouletteApi.clearBets());
    const repeatLastBet = () => performAction(rouletteApi.repeatLastBet());
    const spin = () => {
        if (Object.keys(state.bets).length === 0) {
            addLogEntry('error', 'Please place a bet before spinning.');
            return;
        };
        performAction(rouletteApi.spin(), true);
    };
    const nextRound = () => performAction(rouletteApi.nextRound());
    const handleSaveSettings = (newSettings: RouletteSettings) => performAction(rouletteApi.updateSettings(newSettings));

    return {
        ...state,
        log,
        isLoading,
        actions: {
            placeBet,
            clearBets,
            repeatLastBet,
            spin,
            nextRound,
            handleSaveSettings,
            clearLog,
        }
    };
};
