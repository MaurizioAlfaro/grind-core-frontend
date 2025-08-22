

import React, { useState } from 'react';
import type { MissionDurationKey } from '../../types';
import { ZONES } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';
import { PowerIcon } from '../player/icons/PowerIcon';
import { InfoIcon } from '../../components/common/icons/InfoIcon';
import { BookIcon } from '../../components/common/icons/BookIcon';

const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${seconds / 60}m`;
    return `${seconds / 3600}h`;
}

interface ZoneCardProps {
    zoneId: string;
    playerPower: number;
    onStartMission: (zoneId: string, durationKey: MissionDurationKey) => void;
    onShowRewards: (zoneId: string) => void;
    onShowLore: (zoneId: string) => void;
    onRequestUnlock: (zoneId: string) => void;
    isMissionActive: boolean;
    isUnlocked: boolean;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zoneId, playerPower, onStartMission, onShowRewards, onShowLore, onRequestUnlock, isMissionActive, isUnlocked }) => {
    const [imageError, setImageError] = useState(false);
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return null;

    const canAffordUnlock = playerPower >= zone.requiredPower;
    
    const handleImageError = () => {
        setImageError(true);
    };

    const showImage = zone.image && !imageError;

    let borderColor = 'border-gray-700';
    if (!isUnlocked && canAffordUnlock) borderColor = 'border-green-500 shadow-lg shadow-green-500/20';
    if (!isUnlocked && !canAffordUnlock) borderColor = 'border-red-800';
    
    const renderActionArea = () => {
        if (isUnlocked) {
            return (
                 <div className="flex gap-2">
                    {Object.entries(zone.missionDurations).map(([key, duration]) => (
                        <StyledButton
                            id={`mission-btn-${key.toLowerCase()}-${zone.id}`}
                            key={key}
                            onClick={() => onStartMission(zone.id, key as MissionDurationKey)}
                            disabled={isMissionActive}
                            className="flex-1 text-sm"
                        >
                            {formatDuration(duration.seconds)}
                        </StyledButton>
                    ))}
                </div>
            );
        }
        if (canAffordUnlock) {
            return (
                <StyledButton id={`unlock-btn-${zone.id}`} variant="success" onClick={() => onRequestUnlock(zone.id)} className="w-full animate-pulse">
                    Unlock
                </StyledButton>
            );
        }
        return null; // Power requirement is shown in the header
    };

    return (
        <div className={`relative rounded-xl border ${borderColor} ${isMissionActive && isUnlocked ? 'opacity-60 grayscale' : ''} ${!isUnlocked ? 'opacity-80' : ''} transition-all overflow-hidden bg-gray-900 shadow-lg h-[250px]`}>
            {showImage && (
                <>
                    <img
                        src={zone.image}
                        alt={zone.name}
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                        onError={handleImageError}
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0"></div>
                </>
            )}
            <div className="relative z-10 p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-orbitron font-bold text-white">{zone.name}</h3>
                            <button id={`lore-btn-${zone.id}`} onClick={() => onShowLore(zone.id)} className="text-gray-400 hover:text-cyan-400 transition-colors">
                                <BookIcon className="w-5 h-5" />
                            </button>
                        </div>
                         <div id={`power-req-${zone.id}`} className={`flex items-center gap-2 text-sm ${canAffordUnlock || isUnlocked ? 'text-gray-300' : 'text-red-400 font-bold'}`}>
                            <PowerIcon className="w-5 h-5" />
                            <span>Required: {zone.requiredPower}</span>
                        </div>
                    </div>
                    <button id={`rewards-info-btn-${zone.id}`} onClick={() => onShowRewards(zone.id)} className="text-gray-400 hover:text-cyan-400 transition-colors p-1 bg-black/30 rounded-full">
                        <InfoIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="mt-auto pt-4">
                    {renderActionArea()}
                </div>
            </div>
        </div>
    );
};