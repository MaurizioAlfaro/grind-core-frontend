import asyncHandler from 'express-async-handler';
import { upgradeItem as upgradeItemLogic, enchantItem as enchantItemLogic, rerollEnchantment as rerollEnchantmentLogic } from '../logic';

export const upgradeItem = asyncHandler(async (req: any, res: any) => {
    const { slot, isSafe } = req.body;
    const playerDoc = req.player;
    
    const result = upgradeItemLogic(playerDoc.toObject(), slot, isSafe);

    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});

export const enchantItem = asyncHandler(async (req: any, res: any) => {
    const { slot, costMultiplier } = req.body;
    const playerDoc = req.player;
    
    const result = enchantItemLogic(playerDoc.toObject(), slot, costMultiplier);
    
    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});

export const rerollEnchantment = asyncHandler(async (req: any, res: any) => {
    const { slot, enchantmentIndex, costMultiplier } = req.body;
    const playerDoc = req.player;

    const result = rerollEnchantmentLogic(playerDoc.toObject(), slot, enchantmentIndex, costMultiplier);
    
    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});
