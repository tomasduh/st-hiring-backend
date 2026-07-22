import { SettingsDAL } from '../dal/settings.dal';
import { NextFunction, Request, Response } from 'express';

export const createMaintenanceModeMiddleware = ({
  settingsDAL,
}: {
  settingsDAL: SettingsDAL;
}) =>
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const settings = await settingsDAL.getSettings();
    if (settings?.maintenanceMode) {
      res.status(503).json({
        maintenanceMode: true,
        error: 'Service is currently under maintenance',
      });
      return;
    }
    next();
  };
