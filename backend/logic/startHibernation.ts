import type { PlayerState } from "../../types";
import type { EngineResult } from "./_internal/types";
import { clockService } from "../../services/clockService";

const HIBERNATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const startHibernation = (
  playerState: PlayerState,
  homunculusId: number,
  isDevMode: boolean
): EngineResult<{}> => {
  let newPlayerState = { ...playerState };
  const homunculusIndex = newPlayerState.homunculi.findIndex(
    (h) => h.id === homunculusId
  );

  if (homunculusIndex === -1) {
    return { success: false, message: "Homunculus not found." };
  }

  const homunculus = newPlayerState.homunculi[homunculusIndex];

  if (homunculus.isAdult) {
    return { success: false, message: "This creature is already an adult." };
  }
  if (homunculus.hibernationEndTime !== null) {
    return { success: false, message: "This creature is already hibernating." };
  }

  const now = clockService.getCurrentTime();
  const endTime = isDevMode ? now : now + HIBERNATION_DURATION_MS;

  const updatedHomunculus = { ...homunculus, hibernationEndTime: endTime };
  const updatedHomunculi = [...newPlayerState.homunculi];
  updatedHomunculi[homunculusIndex] = updatedHomunculus;
  newPlayerState.homunculi = updatedHomunculi;

  return {
    success: true,
    message: "Hibernation process initiated.",
    newPlayerState,
  };
};
