import { Request, Response, NextFunction } from 'express';
import { IBatchType, IFile } from '../types/batch.type';
import { SIGNUP_TRACK } from '../enums/track.enum';
import { generateCSV, hashEmail, uploadToFTP } from '../services/signup.service';

export class LandingController {
  static async trackSignup(req: Request, res: Response, next: NextFunction) {
    const { irclickid, email } = req.body;
    if (!irclickid) {
      res.json({ message: 'failed' });
      return;
    }

    const signup: IBatchType = {
      CampaignId: SIGNUP_TRACK.CAMPAIGN_ID,
      ActionTrackerId: SIGNUP_TRACK.ACTION_TRACKER_ID,
      EventDate: new Date().toISOString(),
      ClickId: irclickid,
      CustomerEmail: email ? hashEmail(email) : '',
      CustomerId: '',
      OrderId: '',
    };

    const fileInfo = await generateCSV(signup);
    await uploadToFTP(fileInfo as IFile);

    res.json({ message: 'success' });
  }
}
