
import type { Badge } from '../../types';

export const missionBadges: { [key: string]: Badge } = {
    completionist_1: { id: 'completionist_1', name: 'Loose Ends', description: 'Complete your first Zone.', icon: '✔️', category: 'Missions', bonus: { type: 'ADD_PERMANENT_POWER', value: 5 }, bonusDescription: '+5 Permanent Power' },
    completionist_5: { id: 'completionist_5', name: 'Tidying Up', description: 'Complete 5 Zones.', icon: '🧹', category: 'Missions', bonus: { type: 'ADD_PERMANENT_POWER', value: 10 }, bonusDescription: '+10 Permanent Power' },
    completionist_10: { id: 'completionist_10', name: 'Area Secured', description: 'Complete 10 Zones.', icon: '🗺️', category: 'Missions', bonus: { type: 'ADD_PERMANENT_POWER', value: 15 }, bonusDescription: '+15 Permanent Power' },
    completionist_20: { id: 'completionist_20', name: 'Continental Control', description: 'Complete 20 Zones.', icon: '🌐', category: 'Missions', bonus: { type: 'ADD_PERMANENT_POWER', value: 25 }, bonusDescription: '+25 Permanent Power' },
    completionist_all: { id: 'completionist_all', name: 'New World Order', description: 'Complete all Zones.', icon: '🔺', category: 'Missions', bonus: { type: 'ADD_PERMANENT_POWER', value: 50 }, bonusDescription: '+50 Permanent Power' },

    long_mission_1: { id: 'long_mission_1', name: 'Patient Agent', description: 'Complete a Long (8h) mission.', icon: '🕰️', category: 'Missions', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.002 }, bonusDescription: '+0.2% Global Loot Chance' },
    long_mission_5: { id: 'long_mission_5', name: 'Endurance Runner', description: 'Complete Long missions in 5 different zones.', icon: ' marathon ', category: 'Missions', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.003 }, bonusDescription: '+0.3% Global Loot Chance' },
    long_mission_10: { id: 'long_mission_10', name: 'Deep Cover', description: 'Complete Long missions in 10 different zones.', icon: ' sleeper ', category: 'Missions', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.005 }, bonusDescription: '+0.5% Global Loot Chance' },
    long_mission_all: { id: 'long_mission_all', name: 'Mission Master', description: 'Complete the Long mission in every zone.', icon: '🏆', category: 'Missions', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.01 }, bonusDescription: '+1% Global Loot Chance' },

    workaholic: { id: 'workaholic', name: 'Workaholic', description: 'Have 5 Reptilianz working simultaneously.', icon: '👥', category: 'Missions', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
};
