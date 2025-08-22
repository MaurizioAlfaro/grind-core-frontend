

import React from 'react';
import type { PlayerState, Homunculus, Zone, HomunculusTrait } from '../../types';
import { ZONES, TRAIT_ICONS } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';
import { DollarIcon } from '../../components/icons/DollarIcon';

interface WorkplaceModalProps {
    homunculus: Homunculus;
    player: PlayerState;
    onAssign: (homunculusId: number, zoneId: string) => void;
    onClose: () => void;
}

const Requirement: React.FC<{trait: HomunculusTrait, required: number, actual: number}> = ({ trait, required, actual }) => {
    const isMet = actual >= required;
    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isMet ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>
            <span>{TRAIT_ICONS[trait]}</span>
            <span>{trait}</span>
            <span className="font-bold">{actual}/{required}</span>
        </div>
    )
};

const JobCard: React.FC<{
    zone: Zone;
    homunculus: Homunculus;
    onAssign: (zoneId: string) => void;
    currentWorkers: number;
}> = ({ zone, homunculus, onAssign, currentWorkers }) => {
    
    const requirements = Object.entries(zone.workRequirements) as [HomunculusTrait, number][];
    const isQualified = requirements.every(([trait, required]) => (homunculus.traits[trait] || 0) >= required);
    const isCurrentlyWorkingHere = homunculus.work?.zoneId === zone.id;
    const isFull = currentWorkers >= zone.workerLimit;

    return (
        <div className={`p-3 bg-gray-900/70 rounded-lg border ${isQualified ? 'border-gray-700' : 'border-red-900/50'} ${isCurrentlyWorkingHere ? 'ring-2 ring-cyan-400' : ''}`}>
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-bold text-white">{zone.jobName}</h4>
                    <p className="text-xs text-gray-400">{zone.name}</p>
                    <div className="flex items-center gap-1 text-green-400 font-bold mt-1">
                        <DollarIcon className="w-4 h-4" />
                        <span>{zone.hourlyRate}/hr</span>
                    </div>
                </div>
                <div className="text-right">
                    <StyledButton onClick={() => onAssign(zone.id)} disabled={!isQualified || isCurrentlyWorkingHere || isFull}>
                        {isCurrentlyWorkingHere ? 'Working' : (isFull ? 'Full' : 'Assign')}
                    </StyledButton>
                    <div className="text-xs text-gray-400 mt-1">
                        👥 {currentWorkers}/{zone.workerLimit} Workers
                    </div>
                </div>
            </div>
            {requirements.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {requirements.map(([trait, required]) => (
                        <Requirement 
                            key={trait} 
                            trait={trait} 
                            required={required} 
                            actual={homunculus.traits[trait] || 0} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export const WorkplaceModal: React.FC<WorkplaceModalProps> = ({ homunculus, player, onAssign, onClose }) => {
    const unlockedZones = ZONES.filter(z => player.unlockedZoneIds.includes(z.id));

    const workersByZone = player.homunculi.reduce((acc, h) => {
        if (h.work) {
            acc[h.work.zoneId] = (acc[h.work.zoneId] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);
        
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6">
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2 text-center">Workplace Assignment</h2>
                    <p className="text-center text-gray-400 mb-4">Assign your Reptilianz to generate passive income.</p>
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto p-2 bg-gray-900 rounded-lg">
                       {unlockedZones.length > 0 ? (
                           unlockedZones.map(zone => (
                               <JobCard 
                                   key={zone.id}
                                   zone={zone}
                                   homunculus={homunculus}
                                   onAssign={() => onAssign(homunculus.id, zone.id)}
                                   currentWorkers={workersByZone[zone.id] || 0}
                               />
                           ))
                       ) : (
                           <p className="text-center text-gray-500 py-8">Unlock more zones to find jobs.</p>
                       )}
                    </div>
                    
                    <StyledButton onClick={onClose} variant="secondary" className="mt-6 w-full">
                        Close
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};