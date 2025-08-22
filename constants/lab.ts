import type { LabEquipment } from '../types';
import { CORE_COMPONENT_ID } from './homunculus';

export const MAX_LAB_LEVEL = 10;

export const LAB_XP_REQUIREMENTS: number[] = [
    0, // Level 1 is base
    100000,
    500000,
    2000000,
    10000000,
    50000000,
    250000000,
    1000000000,
    5000000000,
    20000000000,
]; // XP to reach level 2, 3, 4, etc.

export const LAB_LEVEL_PERKS: { [level: number]: { saveChance: number, powerBonus: number, description: string } } = {
    1: { saveChance: 0, powerBonus: 0, description: "Base functionality" },
    2: { saveChance: 0.05, powerBonus: 0, description: "5% chance to save parts" },
    3: { saveChance: 0.05, powerBonus: 0.05, description: "+5% Homunculus power" },
    4: { saveChance: 0.10, powerBonus: 0.05, description: "10% chance to save parts" },
    5: { saveChance: 0.10, powerBonus: 0.10, description: "+10% Homunculus power" },
    6: { saveChance: 0.15, powerBonus: 0.10, description: "15% chance to save parts" },
    7: { saveChance: 0.15, powerBonus: 0.15, description: "+15% Homunculus power" },
    8: { saveChance: 0.20, powerBonus: 0.15, description: "20% chance to save parts" },
    9: { saveChance: 0.20, powerBonus: 0.20, description: "+20% Homunculus power" },
    10: { saveChance: 0.25, powerBonus: 0.25, description: "25% chance to save parts & +25% Power" },
};

export const LAB_EQUIPMENT: { [id: string]: LabEquipment } = {
    'auto_loader': {
        id: 'auto_loader',
        name: 'Auto-Loader',
        description: 'Quality of life upgrade that automatically fills crafting slots with available parts.',
        icon: '🦾',
        cost: 50000,
    },
    'catalytic_converter': {
        id: 'catalytic_converter',
        name: 'Catalytic Converter',
        description: 'Increases the chance to save parts during creation by an additional 5%.',
        icon: '⚗️',
        cost: 150000,
    },
    'resonance_chamber': {
        id: 'resonance_chamber',
        name: 'Resonance Chamber',
        description: 'Increases the power bonus from created Homunculi by an additional 5%.',
        icon: '🔊',
        cost: 300000,
    },
    'probability_stabilizer': {
        id: 'probability_stabilizer',
        name: 'Probability Stabilizer',
        description: 'Provides a flat +5% chance to save Legendary parts.',
        icon: '🎲',
        cost: 1000000,
    }
};