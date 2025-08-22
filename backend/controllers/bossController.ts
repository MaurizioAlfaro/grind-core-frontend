import asyncHandler from 'express-async-handler';
import { fightBoss as fightBossLogic } from '../logic';

export const fightBoss = asyncHandler(async (req: any, res: any) => {
    const { bossId, isDevMode } = req.body;
    const playerDoc = req.player;
    
    const result = fightBossLogic(playerDoc.toObject(), bossId, isDevMode);

    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});
