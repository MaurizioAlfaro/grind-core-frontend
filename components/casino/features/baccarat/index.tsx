import React, { useState, useMemo, useEffect } from 'react';
import { BaccaratGameState, BaccaratBetType, Card } from './types';
import { useBaccaratLogic } from './hooks/useBaccaratLogic';
import { TableUI } from './components/TableUI';
import { ResultDisplay } from './components/ResultDisplay';
import BettingSpots from './components/BettingSpots';
import BaccaratSettingsModal from './components/BaccaratSettingsModal';
import BaccaratDebugModal from './components/BaccaratDebugModal';
import Chip from './components/Chip';
import { CHIP_DENOMINATIONS } from './constants';
import { usePrevious } from '../../hooks/usePrevious';


const BaccaratGame: React.FC = () => {
    const game = useBaccaratLogic();
    const { gameState, chips, log, settings, actions, bets, result, netRoundWinnings, isLoading } = game;
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isDebugOpen, setDebugOpen] = useState(false);
    const [selectedChip, setSelectedChip] = useState<number>(5);
    
    // Animation control states
    const [displayedPlayerHand, setDisplayedPlayerHand] = useState<Card[]>([]);
    const [displayedBankerHand, setDisplayedBankerHand] = useState<Card[]>([]);
    const [revealed, setRevealed] = useState<{ player: boolean[], banker: boolean[] }>({ player: [], banker: [] });
    const [isRevealComplete, setIsRevealComplete] = useState(false);

    const prevGameState = usePrevious(gameState);
    const totalBet = useMemo(() => Object.values(bets).reduce((a, b) => a + b, 0), [bets]);

    // Reset animation states for a new round
    useEffect(() => {
        if (gameState === BaccaratGameState.BETTING && prevGameState === BaccaratGameState.ROUND_OVER) {
            setIsRevealComplete(false);
            setRevealed({ player: [], banker: [] });
            setDisplayedPlayerHand([]);
            setDisplayedBankerHand([]);
        }
    }, [gameState, prevGameState]);

    // Main animation orchestrator
    useEffect(() => {
        if (gameState === BaccaratGameState.ROUND_OVER && prevGameState !== BaccaratGameState.ROUND_OVER) {
            setIsRevealComplete(false);
            const finalPlayerHand = game.playerHand;
            const finalBankerHand = game.bankerHand;

            const steps: { fn: () => void; delay: number }[] = [];

            // 1. Deal first two cards for each hand (visually)
            steps.push({
                fn: () => {
                    setRevealed({ player: Array(3).fill(false), banker: Array(3).fill(false) });
                    setDisplayedPlayerHand(finalPlayerHand.slice(0, 2));
                    setDisplayedBankerHand(finalBankerHand.slice(0, 2));
                },
                delay: 200,
            });

            const createRevealStep = (hand: 'player' | 'banker', index: number) => () => {
                setRevealed(prev => {
                    const newHandReveal = [...prev[hand]];
                    if (index < newHandReveal.length) newHandReveal[index] = true;
                    return { ...prev, [hand]: newHandReveal };
                });
            };

            // 2. Reveal the first 4 cards sequentially
            steps.push({ fn: createRevealStep('player', 0), delay: 750 });
            steps.push({ fn: createRevealStep('banker', 0), delay: 750 });
            steps.push({ fn: createRevealStep('player', 1), delay: 750 });
            steps.push({ fn: createRevealStep('banker', 1), delay: 750 });

            const playerNeedsThird = finalPlayerHand.length === 3;
            const bankerNeedsThird = finalBankerHand.length === 3;

            if (playerNeedsThird || bankerNeedsThird) {
                steps.push({ fn: () => {}, delay: 1000 }); // Pause for suspense
            }

            // 3. Deal and reveal player's third card
            if (playerNeedsThird) {
                steps.push({ fn: () => setDisplayedPlayerHand(finalPlayerHand), delay: 200 });
                steps.push({ fn: createRevealStep('player', 2), delay: 750 });
            }

            // 4. Deal and reveal banker's third card
            if (bankerNeedsThird) {
                steps.push({ fn: () => setDisplayedBankerHand(finalBankerHand), delay: 200 });
                steps.push({ fn: createRevealStep('banker', 2), delay: 750 });
            }
            
            // 5. Mark animation as complete to show results
            steps.push({ fn: () => setIsRevealComplete(true), delay: 1000 });
            
            let cumulativeDelay = 0;
            steps.forEach(step => {
                cumulativeDelay += step.delay;
                setTimeout(step.fn, cumulativeDelay);
            });
        }
    }, [gameState, prevGameState, game.playerHand, game.bankerHand]);

    const handleBetSpotClick = (type: BaccaratBetType) => {
        if (gameState !== BaccaratGameState.BETTING || isLoading) return;
        actions.placeBet(type, selectedChip);
    };

    const GameArea: React.FC = () => {
        switch (gameState) {
            case BaccaratGameState.BETTING:
                return (
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <BettingSpots bets={bets} onBet={handleBetSpotClick} />
                    </div>
                );
            case BaccaratGameState.DEALING:
            case BaccaratGameState.ROUND_OVER:
                 if (result && isRevealComplete) {
                    return (
                        <div className="flex-grow flex flex-col justify-center items-center">
                            <ResultDisplay result={result} netWinnings={netRoundWinnings} />
                        </div>
                    );
                }
                return <div className="flex-grow" />;
        }
    };
    
    const Controls: React.FC = () => {
        switch (gameState) {
            case BaccaratGameState.BETTING:
                return (
                    <div className="flex flex-col items-center space-y-2 p-1">
                        <div className="text-center">
                            <h3 className="text-sm sm:text-lg font-bold text-white">Select a Chip & Click to Bet</h3>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2">
                            {CHIP_DENOMINATIONS.map(value => (
                                <div key={value} className={`rounded-full p-0.5 transition-all ${selectedChip === value ? 'bg-yellow-400' : 'bg-transparent'}`}>
                                    <Chip value={value} onClick={() => setSelectedChip(value)} disabled={isLoading || chips < value} />
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-2 sm:space-x-4 mt-1">
                            <button onClick={actions.deal} disabled={isLoading || totalBet === 0} className="px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500">Deal</button>
                            <button onClick={actions.clearBets} disabled={isLoading || totalBet === 0} className="px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-red-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500">Clear</button>
                            <button onClick={actions.repeatLastBet} disabled={isLoading || !game.lastBets} className="px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500">Repeat</button>
                        </div>
                    </div>
                )
            case BaccaratGameState.ROUND_OVER:
                 if (isRevealComplete) {
                    return <button onClick={actions.nextRound} disabled={isLoading} className="px-8 py-3 sm:px-10 sm:py-4 bg-yellow-500 text-gray-900 font-bold text-lg sm:text-xl rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-500">Next Round</button>;
                 }
                 return <div className="h-[76px]"/>;
            default:
                return <div className="h-[148px] sm:h-[164px]"/>;
        }
    }

  return (
    <div className="w-full h-full bg-dark-felt rounded-b-3xl rounded-tr-3xl shadow-2xl p-2 sm:p-4 border-4 sm:border-8 border-black/20 flex flex-col">
        <div className="flex-grow flex flex-col justify-around">
            <TableUI 
                playerHand={displayedPlayerHand}
                bankerHand={displayedBankerHand}
                isDealing={gameState === BaccaratGameState.DEALING}
                winner={isRevealComplete ? (result?.winner || null) : null}
                playerRevealed={revealed.player}
                bankerRevealed={revealed.banker}
            />
        
            <GameArea />
        </div>


        <div className="flex-shrink-0 pt-2 border-t-2 sm:border-t-4 border-black/20">
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="min-h-[8rem] sm:min-h-[9.5rem] flex items-center justify-center">
                    <Controls />
                </div>
                <div className="w-full flex justify-between items-center text-white p-1">
                    <div className="flex space-x-2">
                        <button onClick={() => setSettingsOpen(true)} className="px-3 py-1 bg-gray-700/80 rounded-md text-xs sm:text-sm hover:bg-gray-600">Settings</button>
                        <button onClick={() => setDebugOpen(true)} className="px-3 py-1 bg-gray-700/80 rounded-md text-xs sm:text-sm hover:bg-gray-600">Debug</button>
                    </div>
                    <div className="text-base sm:text-xl font-bold bg-black/50 px-3 py-1 rounded-lg">
                        Chips: <span className="text-yellow-300">${chips}</span>
                    </div>
                </div>
            </div>
        </div>

      <BaccaratDebugModal isOpen={isDebugOpen} onClose={() => setDebugOpen(false)} deck={game.deck} settings={settings} log={log} onClearLog={actions.clearLog} />
      <BaccaratSettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} onSave={actions.handleSaveSettings} currentSettings={settings} />
    </div>
  );
};

export default BaccaratGame;
