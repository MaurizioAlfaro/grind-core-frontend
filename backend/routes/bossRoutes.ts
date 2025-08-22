import express from 'express';
import { fightBoss } from '../controllers/bossController';
import { playerMiddleware } from '../middleware/playerMiddleware';

const router = express.Router();

router.post('/fight', playerMiddleware, fightBoss);

export default router;
