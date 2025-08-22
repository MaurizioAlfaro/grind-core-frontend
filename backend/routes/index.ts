import express from 'express';
import missionRoutes from './missionRoutes';
import playerRoutes from './playerRoutes';
import forgeRoutes from './forgeRoutes';
import storeRoutes from './storeRoutes';
import bossRoutes from './bossRoutes';
import labRoutes from './labRoutes';

const router = express.Router();

router.use('/missions', missionRoutes);
router.use('/player', playerRoutes);
router.use('/forge', forgeRoutes);
router.use('/store', storeRoutes);
router.use('/bosses', bossRoutes);
router.use('/lab', labRoutes);

export default router;
