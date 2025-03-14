import express from 'express';
import { TRACKING } from '../enums/api.enum';
import { LandingController } from '../controllers/tracking.controller';

const trackingRouter = express.Router();

trackingRouter.post(TRACKING.WINE_CLUB_SIGN_UP, LandingController.trackSignup);

export default trackingRouter;
