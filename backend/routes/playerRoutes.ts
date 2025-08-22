import express from 'express';
import { getPlayer, resetPlayer, equipItem, unequipItem, unlockZone } from '../controllers/playerController';
import { playerMiddleware } from '../middleware/playerMiddleware';

const router = express.Router();

router.get('/', playerMiddleware, getPlayer);
router.post('/reset', playerMiddleware, resetPlayer);
router.post('/equip', playerMiddleware, equipItem);
router.post('/unequip', playerMiddleware, unequipItem);
router.post('/unlockZone', playerMiddleware, unlockZone);

export default router;
