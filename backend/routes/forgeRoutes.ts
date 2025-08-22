import express from 'express';
import { upgradeItem, enchantItem, rerollEnchantment } from '../controllers/forgeController';
import { playerMiddleware } from '../middleware/playerMiddleware';

const router = express.Router();

router.post('/upgrade', playerMiddleware, upgradeItem);
router.post('/enchant', playerMiddleware, enchantItem);
router.post('/reroll', playerMiddleware, rerollEnchantment);

export default router;
