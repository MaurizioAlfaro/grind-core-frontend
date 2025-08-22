import type { PlayerState } from '../../types';
import { EquipmentSlot } from '../../types';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';

export const unequipItem = (playerState: PlayerState, slot: EquipmentSlot): PlayerState => {
    const itemId = playerState.equipment[slot];
    if (!itemId) return playerState;

    const newEquipment = { ...playerState.equipment };
    delete newEquipment[slot];

    const newEquipmentUpgrades = { ...playerState.equipmentUpgrades };
    delete newEquipmentUpgrades[slot];
    
    const newState = { ...playerState, equipment: newEquipment, equipmentUpgrades: newEquipmentUpgrades };
    newState.power = calculatePlayerPower(newState);
    return newState;
};
