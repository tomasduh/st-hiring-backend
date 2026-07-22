import { SettingsDAL } from '../dal/settings.dal';
import { Request, Response } from 'express';

export const createUpdateSettingsController = ({
  settingsDAL,
}: {
  settingsDAL: SettingsDAL;
}) =>
  async (req: Request, res: Response): Promise<void> => {
    const settings = await settingsDAL.upsertSettings(req.body);
    res.json(settings);
  };
