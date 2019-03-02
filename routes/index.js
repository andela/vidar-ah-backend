
import express from 'express';
import apiRoutes from './v1';

const router = express.Router();

router.use(apiRoutes);
router.use('/v1', apiRoutes);

export default router;
