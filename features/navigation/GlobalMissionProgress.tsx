

import React from 'react';
import type { ActiveMission } from '../../types';
import { ZONES } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';

interface GlobalMissionProgressProps {
    activeMission: ActiveMission | null;
    timeLeft: number;
    onClaim: () => void;
}

const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export const GlobalMissionProgress: React.FC<GlobalMissionProgressProps> = ({ activeMission, timeLeft, onClaim }) => {
    if (!activeMission) return null;

    const zone = ZONES.find(z => z.id === activeMission.zoneId);
    if (!zone) return null;

    const missionDuration = (activeMission.endTime - activeMission.startTime) / 1000;
    const progressPercentage = missionDuration > 0 ? Math.min(100, ((missionDuration - timeLeft) / missionDuration) * 100) : 100;

    const isComplete = timeLeft <= 0;

    return (
        <div className="fixed bottom-[88px] left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-xl mx-auto px-4">
                <div id="global-mission-progress" className="bg-gray-800/90 backdrop-blur-sm border-t border-b border-cyan-500/50 rounded-lg p-3 shadow-lg flex items-center justify-between gap-4 pointer-events-auto">
                    <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-1">
                            <p className="text-sm font-bold text-white truncate">{zone.name}</p>
                            <p className="text-lg font-orbitron text-cyan-400">{formatTime(timeLeft)}</p>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-1000 linear" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    {isComplete ? (
                        <StyledButton id="global-claim-btn" onClick={onClaim} className="!py-2 !px-4 text-sm animate-pulse">
                            Claim
                        </StyledButton>
                    ) : (
                        <div className="w-28 text-center">
                             <span className="text-sm text-gray-400">In Progress</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};