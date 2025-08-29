import React, { useState, useEffect } from 'react';
import { RouletteNumber } from '../types';
import { WHEEL_NUMBERS } from '../constants';
import { usePrevious } from '../hooks/usePrevious';

interface RouletteWheelProps {
    winningIndex: number | null;
    isSpinning: boolean;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ winningIndex, isSpinning }) => {
    const [wheelRotation, setWheelRotation] = useState(0);
    const [ballRotation, setBallRotation] = useState(0);
    const prevIsSpinning = usePrevious(isSpinning);

    useEffect(() => {
        // This effect should only run when a spin *starts*.
        if (isSpinning && !prevIsSpinning && winningIndex !== null) {
            const anglePerSlice = 360 / WHEEL_NUMBERS.length;
            
            // The starting angle of the winning pocket on the wheel, with an offset to center it.
            const winningPocketStartAngle = (winningIndex * anglePerSlice) + (anglePerSlice / 2);

            // The final resting angle for the ball. Instead of always landing at the top, pick a random spot.
            const randomFinalAngle = Math.random() * 360;

            // Add a small random jitter within the pocket to make it look less robotic.
            const randomJitter = (Math.random() - 0.5) * (anglePerSlice * 0.4);
            
            const finalRestingAngle = randomFinalAngle + randomJitter;
            
            // Calculate final rotation for the WHEEL
            setWheelRotation(prev => {
                const prevRevolutions = prev - (prev % 360);
                const newRevolutions = 360 * 10; // 10 full spins
                // To make winningPocketStartAngle end up at finalRestingAngle,
                // the wheel must rotate by (finalRestingAngle - winningPocketStartAngle).
                return prevRevolutions + newRevolutions + finalRestingAngle - winningPocketStartAngle;
            });

            // Calculate final rotation for the BALL
            setBallRotation(prev => {
                const prevRevolutions = prev - (prev % 360);
                // Ball spins opposite direction, and more times for effect.
                const newRevolutions = -360 * 15; 
                // The ball just needs to land at the final resting angle.
                return prevRevolutions + newRevolutions + finalRestingAngle;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpinning, winningIndex]);
    
    const wheelStyle: React.CSSProperties = { transform: `rotate(${wheelRotation}deg)` };
    const ballStyle: React.CSSProperties = { transform: `rotate(${ballRotation}deg)` };

    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80">
            {/* Outer Rim */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-900 shadow-2xl"></div>
            {/* Inner track */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-700 to-gray-900"></div>

            {/* Wheel itself */}
            <div
                className="absolute inset-6 rounded-full bg-gray-800 flex items-center justify-center roulette-wheel-spin"
                style={wheelStyle}
            >
                {WHEEL_NUMBERS.map((num, i) => {
                    const angle = (360 / WHEEL_NUMBERS.length) * i;
                    const pocketColorClass = `bg-roulette-${num.color}`;
                    return (
                        <div key={num.value} className="absolute w-full h-full" style={{ transform: `rotate(${angle}deg)` }}>
                            <div className={`absolute top-0 left-1/2 -ml-3 w-6 h-1/2 ${pocketColorClass} flex items-start justify-center pt-1 text-white text-xs font-bold origin-bottom`}
                                 style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}>
                                <span style={{ transform: 'rotate(180deg)' }}>{num.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
             {/* Ball track & Ball */}
            <div
                className="absolute inset-6 rounded-full roulette-ball-spin"
                 style={ballStyle}
            >
                <div className="absolute top-1 left-1/2 -ml-2 w-4 h-4 rounded-full bg-white shadow-lg"></div>
            </div>

            {/* Center spinner */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-inner"></div>
        </div>
    );
};

export default RouletteWheel;