
import type { PlayerState } from '../../types';
import { LAB_EQUIPMENT } from '../../constants/index';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';

export const purchaseLabEquipment = (playerState: PlayerState, equipmentId: string): EngineResult<{}> => {
    const equipment = LAB_EQUIPMENT[equipmentId];
    if (!equipment) {
        return { success: false, message: "Equipment not found." };
    }
    if (playerState.purchasedLabEquipmentIds.includes(equipmentId)) {
        return { success: false, message: "Equipment already purchased." };
    }
    if (playerState.gold < equipment.cost) {
        return { success: false, message: "Not enough gold." };
    }

    let newPlayerState = { ...playerState };
    newPlayerState.gold -= equipment.cost;
    
    const newPurchasedIds = [...newPlayerState.purchasedLabEquipmentIds];
    if (!newPurchasedIds.includes(equipmentId)) {
        newPurchasedIds.push(equipmentId);
    }
    newPlayerState.purchasedLabEquipmentIds = newPurchasedIds;

    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

    return {
        success: true,
        message: `${equipment.name} purchased and installed.`,
        newPlayerState: badgeCheckResult.newPlayerState,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges
    };
};
