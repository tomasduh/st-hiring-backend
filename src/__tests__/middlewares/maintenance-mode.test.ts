import { createMaintenanceModeMiddleware } from '../../middlewares/maintenance-mode';
import { SettingsDAL } from '../../dal/settings.dal';
import { NextFunction, Request, Response } from 'express';
import { Settings } from '../../entity/settings';

const mockSettings: Settings = {
  maxTicketsPerBooking: 10,
  currency: 'USD',
  maintenanceMode: false,
  ticketSalesCutoffHours: 2,
  refundWindowDays: 7,
  supportEmail: 'support@eventim.com',
  defaultEventCapacity: 500,
};

const mockDAL: SettingsDAL = {
  getSettings: jest.fn(),
  upsertSettings: jest.fn(),
};

const mockRes = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;

const mockNext: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe('createMaintenanceModeMiddleware', () => {
  it('calls next when maintenanceMode is false', async () => {
    (mockDAL.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    const middleware = createMaintenanceModeMiddleware({ settingsDAL: mockDAL });
    await middleware({} as Request, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('calls next when there is no settings document yet', async () => {
    (mockDAL.getSettings as jest.Mock).mockResolvedValue(null);
    const middleware = createMaintenanceModeMiddleware({ settingsDAL: mockDAL });
    await middleware({} as Request, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('returns 503 and does not call next when maintenanceMode is true', async () => {
    (mockDAL.getSettings as jest.Mock).mockResolvedValue({ ...mockSettings, maintenanceMode: true });
    const middleware = createMaintenanceModeMiddleware({ settingsDAL: mockDAL });
    await middleware({} as Request, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith({
      maintenanceMode: true,
      error: 'Service is currently under maintenance',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
