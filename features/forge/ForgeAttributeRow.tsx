import React from 'react';
import type { ForgeAttribute } from '../../types';

interface ForgeAttributeRowProps {
    attribute: ForgeAttribute;
    milestoneLevel: number;
    isUnlocked: boolean;
    isPermanent: boolean;
    isNewlyUnlocked: boolean;
}

export const ForgeAttributeRow: React.FC<ForgeAttributeRowProps> = ({ attribute, milestoneLevel, isUnlocked, isPermanent, isNewlyUnlocked }) => {
    const unlockedClasses = 'bg-cyan-900/50 text-cyan-300';
    const lockedClasses = 'bg-gray-800/50 text-gray-500';
    const animationClass = isNewlyUnlocked ? 'animate-attribute-unlock' : '';

    return (
        <div className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isUnlocked ? unlockedClasses : lockedClasses} ${animationClass}`}>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xl ${isUnlocked ? 'bg-cyan-800' : 'bg-gray-700'}`}>
                {attribute.icon}
            </div>
            <div className="flex-1">
                <p className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {attribute.name}
                    {isPermanent && isUnlocked && <span className="ml-2 text-xs font-semibold bg-yellow-500 text-black px-2 py-0.5 rounded-full">PERMANENT</span>}
                </p>
                <p className="text-xs">{attribute.description}</p>
            </div>
            <div className="text-right">
                <p className="text-xs">{isUnlocked ? 'UNLOCKED' : `AT +${milestoneLevel}`}</p>
            </div>
        </div>
    );
};
