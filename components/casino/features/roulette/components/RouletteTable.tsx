import React from 'react';
import Chip from './Chip';
import { getNumberProperties } from '../utils/helpers';
import { TABLE_LAYOUT_NUMBERS } from '../constants';
import { RouletteGameState, RouletteNumber } from '../types';

// Helper to get chip positions for a stack
const getChipsForBet = (bet: number): number[] => {
    if (!bet || bet <= 0) return [];
    // This is a simplified display logic for stacks, not exact change
    const denominations = [100, 25, 10, 5, 1].filter(d => d <= bet);
    const chips: number[] = [];
    let tempBet = bet;
    let limit = 0;
    while(tempBet > 0 && limit < 10) {
        let chipToAdd = denominations.find(d => d <= tempBet) || 1;
        chips.push(chipToAdd);
        tempBet -= chipToAdd;
        limit++;
    }
    return chips;
}

interface BetSpotProps {
    label: string;
    betKey: string;
    betAmount: number;
    onClick: (key: string) => void;
    className?: string;
    isWinner: boolean;
    textClass: string;
}

const BetSpot: React.FC<BetSpotProps> = ({ label, betKey, betAmount, onClick, className, isWinner, textClass }) => {
    const chips = getChipsForBet(betAmount);
    return (
        <div
            className={`relative flex items-center justify-center rounded-md border-2 border-yellow-800/50 cursor-pointer text-white font-bold transition-all duration-300 hover:bg-white/20 ${isWinner ? 'bg-yellow-400/50 scale-110 z-10' : 'bg-black/20'} ${className} ${textClass}`}
            onClick={() => onClick(betKey)}
        >
            {label}
            {chips.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {chips.map((chipValue, i) => (
                        <div key={i} className="absolute" style={{ transform: `translateY(-${i*4}px)`}}>
                            <Chip value={chipValue} onClick={() => {}} size="small" disabled={true} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface RouletteTableProps {
    bets: Record<string, number>;
    onBet: (betType: string) => void;
    gameState: RouletteGameState;
    winningNumber: RouletteNumber | null;
}

interface LayoutConfig {
  grid: string;
  numberSpot: string;
  outsideSpot: string;
}

const layoutStyles: Record<string, LayoutConfig> = {
  large: { // for wide screens > 800px
    grid: 'grid-cols-[50px_repeat(12,50px)_60px] grid-rows-[repeat(3,50px)_45px_40px] gap-1',
    numberSpot: 'text-xl',
    outsideSpot: 'text-base',
  },
  medium: { // for tablets / small desktops > 550px
    grid: 'grid-cols-[35px_repeat(12,35px)_45px] grid-rows-[repeat(3,35px)_35px_30px] gap-1',
    numberSpot: 'text-sm',
    outsideSpot: 'text-xs',
  },
  small: { // for mobile landscape > 420px
    grid: 'grid-cols-[30px_repeat(12,30px)_40px] grid-rows-[repeat(3,30px)_30px_25px] gap-px',
    numberSpot: 'text-xs',
    outsideSpot: 'text-[10px]',
  },
  tiny: { // for very small screens <= 420px
    grid: 'grid-cols-[24px_repeat(12,24px)_30px] grid-rows-[repeat(3,24px)_24px_20px] gap-px',
    numberSpot: 'text-[10px]',
    outsideSpot: 'text-[8px] leading-tight',
  },
};


const RouletteTable: React.FC<RouletteTableProps> = ({ bets, onBet, winningNumber }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [layout, setLayout] = React.useState<keyof typeof layoutStyles>('medium');

    React.useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width } = entries[0].contentRect;
            
            if (width > 800) setLayout('large');
            else if (width > 550) setLayout('medium');
            else if (width > 420) setLayout('small');
            else setLayout('tiny');
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const currentLayout = layoutStyles[layout];
    
    const isSpotWinner = (betKey: string): boolean => {
        if (!winningNumber) return false;
        const [type, ...args] = betKey.split('_');

        switch(type) {
            case 'straight': return winningNumber.value === args[0];
            case 'split': return args[0].split('-').includes(winningNumber.value);
            case 'street': return args[0].split('-').includes(winningNumber.value);
            case 'corner': return args[0].split('-').includes(winningNumber.value);
            case 'sixLine': return args[0].split('-').includes(winningNumber.value);
            case 'column': return winningNumber.column === parseInt(args[0]);
            case 'dozen': return winningNumber.dozen === parseInt(args[0]);
            case 'red': return winningNumber.color === 'red';
            case 'black': return winningNumber.color === 'black';
            case 'even': return winningNumber.isEven === true;
            case 'odd': return winningNumber.isEven === false;
            case 'low': return winningNumber.dozen !== null && winningNumber.dozen < 2;
            case 'high': return winningNumber.dozen !== null && winningNumber.dozen > 1.5;
            default: return false;
        }
    }

    return (
        <div ref={containerRef} className="w-full overflow-x-auto pb-2 -mx-1 flex justify-center">
            <div className="p-2 bg-green-800 rounded-lg select-none inline-block">
                <div className={`grid ${currentLayout.grid}`}>
                    {/* 0 and 00 */}
                    <BetSpot label="0" betKey="straight_0" betAmount={bets['straight_0'] || 0} onClick={onBet} className="col-start-1 row-start-1 row-span-2 bg-roulette-green" isWinner={isSpotWinner('straight_0')} textClass={currentLayout.numberSpot} />
                    <BetSpot label="00" betKey="straight_00" betAmount={bets['straight_00'] || 0} onClick={onBet} className="col-start-1 row-start-3 row-span-2 bg-roulette-green" isWinner={isSpotWinner('straight_00')} textClass={currentLayout.numberSpot} />

                    {/* Numbers grid */}
                    {TABLE_LAYOUT_NUMBERS.flatMap((row, rowIndex) => 
                        row.map((num, colIndex) => {
                            const props = getNumberProperties(num);
                            const betKey = `straight_${num}`;
                            return <BetSpot key={num} label={num} betKey={betKey} betAmount={bets[betKey] || 0} onClick={onBet} className={`col-start-${colIndex+2} row-start-${3-rowIndex} bg-roulette-${props.color}`} isWinner={isSpotWinner(betKey)} textClass={currentLayout.numberSpot} />;
                        })
                    )}
                    
                    {/* Column Bets */}
                    {[...Array(3)].map((_, i) => (
                        <BetSpot key={`col-${i}`} label="2-1" betKey={`column_${3-i}`} betAmount={bets[`column_${3-i}`] || 0} onClick={onBet} className={`col-start-14 row-start-${i+1}`} isWinner={isSpotWinner(`column_${3-i}`)} textClass={currentLayout.numberSpot} />
                    ))}

                    {/* Dozen Bets */}
                    {[...Array(3)].map((_, i) => (
                        <BetSpot key={`dozen-${i}`} label={`D${i+1}`} betKey={`dozen_${i+1}`} betAmount={bets[`dozen_${i+1}`] || 0} onClick={onBet} className={`col-start-${2+i*4} col-span-4 row-start-4`} isWinner={isSpotWinner(`dozen_${i+1}`)} textClass={currentLayout.outsideSpot} />
                    ))}

                    {/* Outside Bets */}
                    <BetSpot label="1-18" betKey="low" betAmount={bets['low'] || 0} onClick={onBet} className="col-start-2 col-span-2 row-start-5" isWinner={isSpotWinner('low')} textClass={currentLayout.outsideSpot} />
                    <BetSpot label="Even" betKey="even" betAmount={bets['even'] || 0} onClick={onBet} className="col-start-4 col-span-2 row-start-5" isWinner={isSpotWinner('even')} textClass={currentLayout.outsideSpot} />
                    <BetSpot label="Red" betKey="red" betAmount={bets['red'] || 0} onClick={onBet} className="col-start-6 col-span-2 row-start-5 bg-roulette-red" isWinner={isSpotWinner('red')} textClass={currentLayout.outsideSpot} />
                    <BetSpot label="Black" betKey="black" betAmount={bets['black'] || 0} onClick={onBet} className="col-start-8 col-span-2 row-start-5 bg-roulette-black" isWinner={isSpotWinner('black')} textClass={currentLayout.outsideSpot} />
                    <BetSpot label="Odd" betKey="odd" betAmount={bets['odd'] || 0} onClick={onBet} className="col-start-10 col-span-2 row-start-5" isWinner={isSpotWinner('odd')} textClass={currentLayout.outsideSpot} />
                    <BetSpot label="19-36" betKey="high" betAmount={bets['high'] || 0} onClick={onBet} className="col-start-12 col-span-2 row-start-5" isWinner={isSpotWinner('high')} textClass={currentLayout.outsideSpot} />
                </div>
            </div>
        </div>
    );
};

export default RouletteTable;