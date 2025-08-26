import asyncHandler from "express-async-handler";
import {
  equipItem as equipItemLogic,
  unequipItem as unequipItemLogic,
  unlockZone as unlockZoneLogic,
  recalculatePower,
} from "../logic";
import { DEV_PLAYER_STATES } from "../../constants/index";

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

export const updateTutorialStep = asyncHandler(async (req: any, res: any) => {
  const { tutorialStep, tutorialCompleted } = req.body;
  const playerDoc = req.player;

  // Validate tutorial step - allow step 99 to disable tutorial
  if (
    typeof tutorialStep !== "number" ||
    tutorialStep < 1 ||
    (tutorialStep > 39 && tutorialStep !== 99)
  ) {
    res.status(400).json({
      success: false,
      message:
        "Invalid tutorial step. Must be between 1 and 39, or 99 to disable.",
    });
    return;
  }

  if (typeof tutorialCompleted !== "boolean") {
    res.status(400).json({
      success: false,
      message: "tutorialCompleted must be a boolean.",
    });
    return;
  }

  // Update tutorial state
  playerDoc.tutorialStep = tutorialStep;
  playerDoc.tutorialCompleted = tutorialCompleted;
  await playerDoc.save();

  res.status(200).json({
    success: true,
    message: "Tutorial step updated successfully",
    newPlayerState: playerDoc.toObject(),
  });
});

export const equipItem = asyncHandler(async (req: any, res: any) => {
  const { itemId } = req.body;
  const playerDoc = req.player;

  const result = equipItemLogic(playerDoc.toObject(), itemId);

  if (result.success && result.newPlayerState) {
    // WARNING: If the response does not have a specific field, it might be corrupted due to
    // Object.assign creating shared references that get corrupted by Mongoose's save operation.
    // Consider using deep copy instead: { ...result.newPlayerState }
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

  // WARNING: If the response does not have a specific field, it might be corrupted due to
  // Object.assign creating shared references that get corrupted by Mongoose's save operation.
  // Consider using deep copy instead: { ...newPlayerState }
  Object.assign(playerDoc, newPlayerState);
  res.status(200).json({ success: true, newPlayerState: playerDoc.toObject() });
});

export const unlockZone = asyncHandler(async (req: any, res: any) => {
  const { zoneId } = req.body;
  const playerDoc = req.player;

  const newPlayerState = unlockZoneLogic(playerDoc.toObject(), zoneId);

  // WARNING: If the response does not have a specific field, it might be corrupted due to
  // Object.assign creating shared references that get corrupted by Mongoose's save operation.
  // Consider using deep copy instead: { ...newPlayerState }
  Object.assign(playerDoc, newPlayerState);
  await playerDoc.save();
  res.status(200).json({ success: true, newPlayerState: playerDoc.toObject() });
});
