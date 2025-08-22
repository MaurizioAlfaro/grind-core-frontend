
import type { PlayerState } from '../../types';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';

export const recalculatePower = (playerState: PlayerState): PlayerState => {
    const newPower = calculatePlayerPower(playerState);
    return { ...playerState, power: newPower };
};
