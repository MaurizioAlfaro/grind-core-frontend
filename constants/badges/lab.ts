
import type { Badge } from '../../types';

export const labBadges: { [key: string]: Badge } = {
    lab_creation_1: { id: 'lab_creation_1', name: 'Bio-Engineer', description: 'Create your first Reptilian Homunculus.', icon: '🦎', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.002 }, bonusDescription: '+0.2% Global Power' },
    lab_creation_5: { id: 'lab_creation_5', name: 'Life, Uh, Finds a Way', description: 'Create 5 Homunculi.', icon: '🐊', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.003 }, bonusDescription: '+0.3% Global Power' },
    lab_creation_10: { id: 'lab_creation_10', name: 'Progenitor', description: 'Create 10 Homunculi.', icon: '🦖', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },

    squad_3: { id: 'squad_3', name: 'Three\'s Company', description: 'Own 3 Homunculi at once.', icon: '👨‍👩‍👦', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    squad_5: { id: 'squad_5', name: 'Small Army', description: 'Own 5 Homunculi at once.', icon: '👨‍👩‍👧‍👦', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    squad_10: { id: 'squad_10', name: 'Menagerie', description: 'Own 10 Homunculi at once.', icon: '🏞️', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.015 }, bonusDescription: '+1.5% Global Power' },

    lab_level_5: { id: 'lab_level_5', name: 'Mad Scientist', description: 'Reach Lab Level 5.', icon: '🔬', category: 'Lab', bonus: { type: 'MULTIPLY_XP', value: 1.01 }, bonusDescription: '+1% Global XP' },
    lab_level_10: { id: 'lab_level_10', name: 'Master Geneticist', description: 'Reach Lab Level 10.', icon: '🧬', category: 'Lab', bonus: { type: 'MULTIPLY_XP', value: 1.02 }, bonusDescription: '+2% Global XP' },
    lab_equipment_all: { id: 'lab_equipment_all', name: 'Fully Operational', description: 'Purchase all lab equipment.', icon: '⚙️', category: 'Lab', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    
    breeder_legendary: { id: 'breeder_legendary', name: 'Apex Predator', description: 'Create a Legendary Homunculus.', icon: '🐉', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.02 }, bonusDescription: '+2% Global Power' },
    trait_max: { id: 'trait_max', name: 'Specialist', description: 'Max out a single trait on a Homunculus.', icon: '🎓', category: 'Lab', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
};
