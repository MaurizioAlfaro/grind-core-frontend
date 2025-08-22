import asyncHandler from 'express-async-handler';
import { equipItem as equipItemLogic, unequipItem as unequipItemLogic, unlockZone as unlockZoneLogic, recalculatePower } from '../logic';
import { DEV_PLAYER_STATES } from '../../constants/index';

export const getPlayer = asyncHandler(async (req: any, res: any) => {
    res.status(200).json(req.player.toObject());
});

export const resetPlayer = asyncHandler(async (req: any, res: any) => {
    const { modeIndex } = req.body;
    const playerDoc = req.player;

    const initialState = DEV_PLAYER_STATES[modeIndex] || DEV_PLAYER_STATES[0];
    
    // Clear existing data but keep the _id
    const clearedData = {
        ...initialState,
        _id: playerDoc._id,
        createdAt: playerDoc.createdAt,
    };
    
    const finalState = recalculatePower(clearedData);

    playerDoc.overwrite(finalState);
    await playerDoc.save();
    
    res.status(200).json(playerDoc.toObject());
});

export const equipItem = asyncHandler(async (req: any, res: any) => {
    const { itemId } = req.body;
    const playerDoc = req.player;
    
    const result = equipItemLogic(playerDoc.toObject(), itemId);
    
    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});

export const unequipItem = asyncHandler(async (req: any, res: any) => {
    const { slot } = req.body;
    const playerDoc = req.player;

    const newPlayerState = unequipItemLogic(playerDoc.toObject(), slot);
    
    Object.assign(playerDoc, newPlayerState);
    await playerDoc.save();
    res.status(200).json({ success: true, newPlayerState: playerDoc.toObject() });
});

export const unlockZone = asyncHandler(async (req: any, res: any) => {
    const { zoneId } = req.body;
    const playerDoc = req.player;
    
    const newPlayerState = unlockZoneLogic(playerDoc.toObject(), zoneId);
    
    Object.assign(playerDoc, newPlayerState);
    await playerDoc.save();
    res.status(200).json({ success: true, newPlayerState: playerDoc.toObject() });
});