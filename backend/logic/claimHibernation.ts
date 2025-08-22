import type { PlayerState } from "../../types";
import type { EngineResult } from "./_internal/types";
import { clockService } from "../../services/clockService";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";
import { checkForBadgeUnlocks } from "./_internal/checkForBadgeUnlocks";

export const claimHibernation = (
  playerState: PlayerState,
  homunculusId: number
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

  if (
    homunculus.hibernationEndTime === null ||
    clockService.getCurrentTime() < homunculus.hibernationEndTime
  ) {
    return { success: false, message: "Hibernation is not yet complete." };
  }

  const updatedHomunculus = {
    ...homunculus,
    isAdult: true,
    hibernationEndTime: null,
  };
  const updatedHomunculi = [...newPlayerState.homunculi];
  updatedHomunculi[homunculusIndex] = updatedHomunculus;
  newPlayerState.homunculi = updatedHomunculi;

  newPlayerState.power = calculatePlayerPower(newPlayerState);
  const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

  return {
    success: true,
    message: "The creature has matured into an Adult Reptilianz!",
    newPlayerState: badgeCheckResult.newPlayerState,
    newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
  };
};
