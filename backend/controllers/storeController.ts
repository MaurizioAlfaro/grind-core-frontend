import asyncHandler from 'express-async-handler';
import { purchaseStoreItem as purchaseStoreItemLogic, useConsumableItem as useConsumableItemLogic } from '../logic';

export const purchaseStoreItem = asyncHandler(async (req: any, res: any) => {
    const { itemId } = req.body;
    const playerDoc = req.player;

    const result = purchaseStoreItemLogic(playerDoc.toObject(), itemId);

    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});

export const useConsumableItem = asyncHandler(async (req: any, res: any) => {
    const { itemId } = req.body;
    const playerDoc = req.player;

    const result = useConsumableItemLogic(playerDoc.toObject(), itemId);

    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});
