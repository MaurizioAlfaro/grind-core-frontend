import express from 'express';
import {
    investLabXp,
    createHomunculus,
    purchaseLabEquipment,
    startHibernation,
    claimHibernation,
    feedHomunculus,
    assignToWork,
    collectPay,
    equipHomunculusItem,
    unequipHomunculusItem
} from '../controllers/labController';
import { playerMiddleware } from '../middleware/playerMiddleware';

const router = express.Router();

router.post('/invest', playerMiddleware, investLabXp);
router.post('/create', playerMiddleware, createHomunculus);
router.post('/purchase', playerMiddleware, purchaseLabEquipment);
router.post('/hibernate/start', playerMiddleware, startHibernation);
router.post('/hibernate/claim', playerMiddleware, claimHibernation);
router.post('/feed', playerMiddleware, feedHomunculus);
router.post('/work/assign', playerMiddleware, assignToWork);
router.post('/work/collect', playerMiddleware, collectPay);
router.post('/gear/equip', playerMiddleware, equipHomunculusItem);
router.post('/gear/unequip', playerMiddleware, unequipHomunculusItem);

export default router;
