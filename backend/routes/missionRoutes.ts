import express from 'express';
import { startMission, claimMission, cancelMission } from '../controllers/missionController';
import { playerMiddleware } from '../middleware/playerMiddleware';

const router = express.Router();

router.post('/start', playerMiddleware, startMission);
router.post('/claim', playerMiddleware, claimMission);
router.post('/cancel', playerMiddleware, cancelMission);

export default router;
