import { SettingsDAL } from '../dal/settings.dal';
import { Request, Response } from 'express';

export const createGetSettingsController = ({
  settingsDAL,
}: {
  settingsDAL: SettingsDAL;
}) =>
  async (_req: Request, res: Response): Promise<void> => {
    const settings = await settingsDAL.getSettings();
    if (!settings) {
      res.status(404).json({ error: 'Settings not found' });
      return;
    }
    res.json(settings);
  };
