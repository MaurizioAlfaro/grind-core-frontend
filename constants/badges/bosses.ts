
import type { Badge } from '../../types';
import { BOSSES } from '../bosses';

const allVisibleBosses = Object.values(BOSSES);

export const bossBadges: { [key: string]: Badge } = {
    ...allVisibleBosses.reduce((acc, boss) => {
        acc[`boss_${boss.id}`] = { id: boss.firstVictoryBadgeId, name: boss.name, description: `Defeat ${boss.name}.`, icon: '💀', category: 'Bosses', bonus: { type: 'ADD_PERMANENT_POWER', value: 2 }, bonusDescription: `+2 Permanent Power` };
        return acc;
    }, {} as { [key: string]: Badge }),
    
    boss_slayer_1: { id: 'boss_slayer_1', name: 'Bounty Hunter', description: 'Defeat your first boss.', icon: '🎯', category: 'Bosses', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    boss_slayer_5: { id: 'boss_slayer_5', name: 'Threat Neutralizer', description: 'Defeat 5 unique bosses.', icon: '☠️', category: 'Bosses', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    boss_slayer_10: { id: 'boss_slayer_10', name: 'King Slayer', description: 'Defeat 10 unique bosses.', icon: '⚔️', category: 'Bosses', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    boss_slayer_20: { id: 'boss_slayer_20', name: 'Executioner', description: 'Defeat 20 unique bosses.', icon: '🪓', category: 'Bosses', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    boss_slayer_all: { id: 'boss_slayer_all', name: 'Pantheon Toppler', description: 'Defeat all unique bosses.', icon: '☠️', category: 'Bosses', bonus: { type: 'MULTIPLY_POWER', value: 1.02 }, bonusDescription: '+2% Global Power' },
};
