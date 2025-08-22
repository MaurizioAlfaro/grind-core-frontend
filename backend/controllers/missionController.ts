import asyncHandler from 'express-async-handler';
import { startMission as startMissionLogic, claimMission as claimMissionLogic, cancelMission as cancelMissionLogic } from '../logic';

// Note: In this simplified model, `activeMission` is stored on the client.
// A more robust backend would store this in the database as well.
// For this project, we receive the activeMission from the client to claim it.

export const startMission = asyncHandler(async (req: any, res: any) => {
    const { zoneId, durationKey, isDevMode } = req.body;
    const player = req.player.toObject();
    
    const result = startMissionLogic(player, zoneId, durationKey, isDevMode);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
});

export const claimMission = asyncHandler(async (req: any, res: any) => {
    const { activeMission } = req.body;
    const playerDoc = req.player;

    const result = claimMissionLogic(playerDoc.toObject(), activeMission);
    
    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});

export const cancelMission = asyncHandler(async (req: any, res: any) => {
    const playerDoc = req.player;
    const result = cancelMissionLogic(playerDoc.toObject());

    if (result.success && result.newPlayerState) {
        Object.assign(playerDoc, result.newPlayerState);
        await playerDoc.save();
        res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
    } else {
        res.status(400).json(result);
    }
});
