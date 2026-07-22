import { createGetSettingsController } from '../../controllers/get-settings';
import { SettingsDAL } from '../../dal/settings.dal';
import { Request, Response } from 'express';
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

beforeEach(() => jest.clearAllMocks());

describe('createGetSettingsController', () => {
  it('returns 404 when no settings exist', async () => {
    (mockDAL.getSettings as jest.Mock).mockResolvedValue(null);
    const handler = createGetSettingsController({ settingsDAL: mockDAL });
    await handler({} as Request, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Settings not found' });
  });

  it('returns settings document when it exists', async () => {
    (mockDAL.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    const handler = createGetSettingsController({ settingsDAL: mockDAL });
    await handler({} as Request, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(mockSettings);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('calls getSettings once per request', async () => {
    (mockDAL.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    const handler = createGetSettingsController({ settingsDAL: mockDAL });
    await handler({} as Request, mockRes);
    expect(mockDAL.getSettings).toHaveBeenCalledTimes(1);
  });
});
