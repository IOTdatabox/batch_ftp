import express from 'express';
import { ROUTES } from '../enums/api.enum';
import trackRouter from './track.route';

const router = express.Router();

router.use(ROUTES.TRACKING, trackRouter);

export default router;
