
import { useState } from 'react';
import { RouletteGameState, RouletteNumber, RouletteSettings } from '../types';
import { INITIAL_CHIPS, INITIAL_ROULETTE_SETTINGS } from '../constants';

export const useRouletteState = () => {
    const [settings, setSettings] = useState<RouletteSettings>(INITIAL_ROULETTE_SETTINGS);
    const [gameState, setGameState] = useState<RouletteGameState>(RouletteGameState.BETTING);
    const [chips, setChips] = useState<number>(INITIAL_CHIPS);

    const [bets, setBets] = useState<Record<string, number>>({});
    const [lastBets, setLastBets] = useState<Record<string, number> | null>(null);

    const [winningNumber, setWinningNumber] = useState<RouletteNumber | null>(null);
    const [spinTargetIndex, setSpinTargetIndex] = useState<number | null>(null);
    const [netRoundWinnings, setNetRoundWinnings] = useState<number>(0);
    const [spinHistory, setSpinHistory] = useState<RouletteNumber[]>([]);

    return {
        settings, setSettings,
        gameState, setGameState,
        chips, setChips,
        bets, setBets,
        lastBets, setLastBets,
        winningNumber, setWinningNumber,
        spinTargetIndex, setSpinTargetIndex,
        netRoundWinnings, setNetRoundWinnings,
        spinHistory, setSpinHistory,
    };
};

export type IRouletteState = ReturnType<typeof useRouletteState>;
