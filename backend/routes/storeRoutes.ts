import express from 'express';
import { purchaseStoreItem, useConsumableItem } from '../controllers/storeController';
import { playerMiddleware } from '../middleware/playerMiddleware';

const router = express.Router();

router.post('/purchase', playerMiddleware, purchaseStoreItem);
router.post('/use', playerMiddleware, useConsumableItem);

export default router;
