

import type { Equipment } from '../types';

export interface LeaderboardEntry {
    rank: number;
    name: string;
    level: number;
    power: number;
    isPlayer?: boolean;
    equipment: Equipment;
    unlockedBadgeIds: string[];
}


export const LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 0, name: 'Architect-Prime', level: 999, power: 999999, equipment: { Weapon: 'boss_illudium_q-36', Armor: 'boss_junk-forged_exosuit', Ring: 'boss_the_cosmic_snooze_button', Amulet: 'boss_grandfathers_pocketwatch', Misc: 'boss_the_elders_skull' }, unlockedBadgeIds: ['level_50', 'power_50k', 'gold_1m', 'forge_15', 'completionist_all', 'collector_legendary'] },
    { rank: 0, name: 'Void-Walker', level: 850, power: 750000, equipment: { Weapon: 'boss_the_tranq_gun', Armor: 'boss_silver-lined_oxygen_tank', Ring: 'boss_scales_of_work-life_balance', Amulet: 'boss_the_fragmented_crown' }, unlockedBadgeIds: ['level_50', 'power_50k', 'gold_1m'] },
    { rank: 0, name: 'Chronomancer', level: 845, power: 742000, equipment: { Weapon: 'boss_the_royal_plunger', Armor: 'boss_sash_of_supreme_authority', Misc: 'boss_steves_clipboard' }, unlockedBadgeIds: ['level_50', 'power_50k', 'gold_500k'] },
    { rank: 0, name: 'Agent Smith', level: 512, power: 450123, equipment: { Weapon: 'boss_the_alien_probe', Armor: 'boss_the_perfect_copy' }, unlockedBadgeIds: ['level_40', 'power_10k', 'gold_250k'] },
    { rank: 0, name: 'The Janitor', level: 480, power: 410500, equipment: { Weapon: 'boss_the_unfastened_seatbelt', Armor: 'boss_sentient_mops_bucket' }, unlockedBadgeIds: ['level_40', 'power_10k', 'gold_250k', 'mission_master_long'] },
    { rank: 0, name: 'Glitch', level: 475, power: 405000, equipment: {}, unlockedBadgeIds: ['level_30', 'power_5k'] },
    { rank: 0, name: 'Code-Breaker', level: 450, power: 380000, equipment: { Weapon: 'office_keyboard', Ring: 'post_office_signet_ring' }, unlockedBadgeIds: ['level_30', 'power_5k', 'gold_100k'] },
    { rank: 0, name: 'Shadow-Op', level: 421, power: 355000, equipment: { Misc: 'office_badge' }, unlockedBadgeIds: ['level_30', 'power_5k', 'gold_100k'] },
    { rank: 0, name: 'Data-Miner', level: 400, power: 330000, equipment: { Weapon: 'office_keyboard', Amulet: 'office_locket' }, unlockedBadgeIds: ['level_30', 'power_5k', 'gold_100k', 'collector_50'] },
    { rank: 0, name: 'System-Shock', level: 380, power: 310000, equipment: { Weapon: 'crash_site_blaster' }, unlockedBadgeIds: ['level_30', 'power_1k', 'gold_50k'] },
    { rank: 0, name: 'Bob from Accounting', level: 350, power: 280000, equipment: { Weapon: 'office_keyboard', Armor: 'supermarket_vest' }, unlockedBadgeIds: ['level_25', 'power_1k', 'gold_50k'] },
    { rank: 0, name: 'Rogue_AI_7', level: 320, power: 250000, equipment: {}, unlockedBadgeIds: ['level_25', 'power_1k', 'gold_50k'] },
    { rank: 0, name: 'Vector', level: 300, power: 230000, equipment: {}, unlockedBadgeIds: ['level_25', 'power_1k', 'gold_50k'] },
    { rank: 0, name: 'Proxy', level: 280, power: 210000, equipment: {}, unlockedBadgeIds: ['level_25', 'power_1k', 'gold_10k'] },
    { rank: 0, name: 'Firewall', level: 250, power: 180000, equipment: { Armor: 'crash_site_plating' }, unlockedBadgeIds: ['level_20', 'power_1k', 'gold_10k'] },
    { rank: 0, name: 'You', isPlayer: true, level: 1, power: 1, equipment: {}, unlockedBadgeIds: [] }, // Placeholder for player
    { rank: 0, name: 'Script_Kiddie', level: 220, power: 150000, equipment: { Weapon: 'office_keyboard' }, unlockedBadgeIds: ['level_20', 'power_500', 'gold_10k'] },
    { rank: 0, name: 'Dial-Up', level: 200, power: 120000, equipment: {}, unlockedBadgeIds: ['level_20', 'power_500', 'gold_10k'] },
    { rank: 0, name: 'Spam-Bot', level: 180, power: 100000, equipment: {}, unlockedBadgeIds: ['level_15', 'power_500', 'gold_1k'] },
    { rank: 0, name: 'Buffer_Overflow', level: 150, power: 80000, equipment: {}, unlockedBadgeIds: ['level_15', 'power_250', 'gold_1k'] },
    { rank: 0, name: 'Null_Pointer', level: 120, power: 60000, equipment: {}, unlockedBadgeIds: ['level_10', 'power_100', 'gold_1k'] },
];