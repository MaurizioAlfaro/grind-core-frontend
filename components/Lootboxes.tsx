import React from 'react';
import type { PlayerState, Lootbox } from '../types';
import { CACHES } from '../constants/index';
import { GoldIcon } from './icons/GoldIcon';
import { StyledButton } from './StyledButton';

interface LootboxesProps {
  player: PlayerState;
  onOpenLootbox: (lootboxId: string) => void;
}

export const Lootboxes: React.FC<LootboxesProps> = ({ player, onOpenLootbox }) => {
    // In a more complex game, you'd filter lootboxes based on player progress.
    const availableLootboxes: Lootbox[] = Object.values(CACHES); 

    return (
        <div className="space-y-4">
             <h3 className="text-lg font-orbitron text-cyan-400">Available Caches</h3>
             {availableLootboxes.map(lootbox => {
                const canAfford = lootbox.cost.type === 'gold' && player.gold >= lootbox.cost.amount;

                return (
                    <div key={lootbox.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-white">{lootbox.label}</h4>
                            <p className="text-sm text-gray-400">{lootbox.description}</p>
                            <div className="flex items-center gap-1 text-yellow-400 font-bold mt-2">
                                <GoldIcon className="w-5 h-5" />
                                <span>{lootbox.cost.amount.toLocaleString()}</span>
                            </div>
                        </div>
                        <StyledButton onClick={() => onOpenLootbox(lootbox.id)} disabled={!canAfford}>
                            Open
                        </StyledButton>
                    </div>
                );
             })}
        </div>
    );
};