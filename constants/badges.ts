
import type { Badge } from '../types';
import { progressionBadges } from './badges/progression';
import { wealthBadges } from './badges/wealth';
import { missionBadges } from './badges/missions';
import { bossBadges } from './badges/bosses';
import { collectionBadges } from './badges/collection';
import { forgeBadges } from './badges/forge';
import { labBadges } from './badges/lab';
import { storeBadges } from './badges/store';
import { miscellaneousBadges } from './badges/miscellaneous';
import { secretBadges } from './badges/secret';

export * from './badges/unlock_conditions';

export const BADGES: { [key: string]: Badge } = {
    ...progressionBadges,
    ...wealthBadges,
    ...missionBadges,
    ...bossBadges,
    ...collectionBadges,
    ...forgeBadges,
    ...labBadges,
    ...storeBadges,
    ...miscellaneousBadges,
    ...secretBadges,
};
