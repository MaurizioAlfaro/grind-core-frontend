import { HomunculusTrait, ItemRarity } from "../types";

export const CORE_COMPONENT_ID = 'shapeshifters_gene';

export const MAX_TRAIT_LEVEL = 10;

export const ALL_REPTILIAN_PARTS: string[] = [
    'reptilian_scale',
    'cybernetic_eye',
    'biomesh_plating',
    'neuro-link_cable',
    'plasma_inducer',
    'adamantium_claw',
    'elders_sigil',
    'shapeshifters_gene',
];

export const POWER_PER_TRAIT_POINT = 0.5;

export const HOMUNCULUS_RARITY_POWER_MULTIPLIER: { [key in ItemRarity]: number } = {
    [ItemRarity.Common]: 1,
    [ItemRarity.Rare]: 1.2,
    [ItemRarity.Epic]: 1.5,
    [ItemRarity.Legendary]: 2.0,
};


export const TRAIT_ICONS: { [key in HomunculusTrait]: string } = {
    [HomunculusTrait.Intelligence]: '🧠',
    [HomunculusTrait.Speed]: '⚡',
    [HomunculusTrait.Charisma]: '✨',
    [HomunculusTrait.Diplomacy]: '🤝',
    [HomunculusTrait.Strength]: '💪',
    [HomunculusTrait.Stealth]: '👻',
    [HomunculusTrait.Luck]: '🍀',
    [HomunculusTrait.Cunning]: '🦊',
    [HomunculusTrait.Tech]: '🤖',
    [HomunculusTrait.Psionics]: '🌀',
};