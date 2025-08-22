import type { PlayerState, HomunculusClothingItem } from '../../types';
import { ItemType } from '../../types';
import { ITEMS } from '../../constants/index';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';
import type { EngineResult } from './_internal/types';

export const equipHomunculusItem = (playerState: PlayerState, homunculusId: number, itemId: string): EngineResult<{}> => {
    const itemToEquip = ITEMS[itemId] as HomunculusClothingItem;
    if (!itemToEquip || itemToEquip.type !== ItemType.HomunculusClothing) {
        return { success: false, message: "Invalid item." };
    }
    
    const inventoryItem = playerState.inventory.find(i => i.itemId === itemId);
    if (!inventoryItem || inventoryItem.quantity < 1) {
        return { success: false, message: "Item not in inventory." };
    }

    let newPlayerState = { ...playerState };
    const homunculusIndex = newPlayerState.homunculi.findIndex(h => h.id === homunculusId);
    if (homunculusIndex === -1) {
        return { success: false, message: "Homunculus not found." };
    }

    const homunculus = { ...newPlayerState.homunculi[homunculusIndex] };
    homunculus.equipment = { ...(homunculus.equipment || {}) };
    
    const slotToEquip = itemToEquip.slot;
    const currentlyEquippedItemId = homunculus.equipment[slotToEquip];
    
    let newInventory = [...newPlayerState.inventory];

    // Unequip current item in that slot, if any
    if (currentlyEquippedItemId) {
        const existingInvItem = newInventory.find(i => i.itemId === currentlyEquippedItemId);
        if (existingInvItem) {
            existingInvItem.quantity += 1;
        } else {
            newInventory.push({ itemId: currentlyEquippedItemId, quantity: 1 });
        }
    }

    // Equip the new item
    homunculus.equipment[slotToEquip] = itemId;

    // Remove new item from inventory
    const newInvItem = newInventory.find(i => i.itemId === itemId)!;
    newInvItem.quantity -= 1;
    newInventory = newInventory.filter(i => i.quantity > 0);
    
    // Update state
    const updatedHomunculi = [...newPlayerState.homunculi];
    updatedHomunculi[homunculusIndex] = homunculus;
    newPlayerState.homunculi = updatedHomunculi;
    newPlayerState.inventory = newInventory;
    
    newPlayerState = { ...newPlayerState, power: calculatePlayerPower(newPlayerState) };

    return { success: true, message: "Item equipped.", newPlayerState };
};
