
import type { Badge } from '../../types';

export const secretBadges: { [key: string]: Badge } = {
    secret_commoner: { id: 'secret_commoner', name: 'Man of the People', description: 'Equip a full set of Common quality items.', icon: '🧑‍🌾', category: 'Secret', isHidden: true, bonus: { type: 'MULTIPLY_GOLD', value: 1.02 }, bonusDescription: '+2% Global Gold' },
    secret_rare: { id: 'secret_rare', name: 'Well-Equipped', description: 'Equip a full set of Rare quality items.', icon: '⚔️', category: 'Secret', isHidden: true, bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    secret_epic: { id: 'secret_epic', name: 'Epic Hero', description: 'Equip a full set of Epic quality items.', icon: '🦸', category: 'Secret', isHidden: true, bonus: { type: 'MULTIPLY_POWER', value: 1.015 }, bonusDescription: '+1.5% Global Power' },
    secret_legend: { id: 'secret_legend', name: 'Living Legend', description: 'Equip a full set of Legendary quality items.', icon: '🌟', category: 'Secret', isHidden: true, bonus: { type: 'MULTIPLY_POWER', value: 1.025 }, bonusDescription: '+2.5% Global Power' },
    secret_perfectionist: { id: 'secret_perfectionist', name: 'Perfectionist', description: 'Create a homunculus with all traits maxed out.', icon: '💯', category: 'Secret', isHidden: true, bonus: { type: 'MULTIPLY_POWER', value: 1.05 }, bonusDescription: '+5% Global Power' },
};
