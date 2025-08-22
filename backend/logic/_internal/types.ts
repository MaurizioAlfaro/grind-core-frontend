
import type { PlayerState, Badge, Rewards } from '../../../types';

export type EngineResult<T> = {
    success: boolean;
    message: string;
    newPlayerState?: PlayerState;
    newlyUnlockedBadges?: Badge[];
} & T;
