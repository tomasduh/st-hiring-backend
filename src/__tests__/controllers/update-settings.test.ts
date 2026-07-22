import { createUpdateSettingsController } from '../../controllers/update-settings';
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
} as unknown as Response;

beforeEach(() => jest.clearAllMocks());

describe('createUpdateSettingsController', () => {
  it('upserts settings from request body and returns result', async () => {
    (mockDAL.upsertSettings as jest.Mock).mockResolvedValue(mockSettings);
    const handler = createUpdateSettingsController({ settingsDAL: mockDAL });
    const mockReq = { body: { currency: 'EUR' } } as Request;
    await handler(mockReq, mockRes);
    expect(mockDAL.upsertSettings).toHaveBeenCalledWith({ currency: 'EUR' });
    expect(mockRes.json).toHaveBeenCalledWith(mockSettings);
  });

  it('passes full body to upsertSettings', async () => {
    (mockDAL.upsertSettings as jest.Mock).mockResolvedValue(mockSettings);
    const handler = createUpdateSettingsController({ settingsDAL: mockDAL });
    const body = { currency: 'GBP', maintenanceMode: true, maxTicketsPerBooking: 5 };
    const mockReq = { body } as Request;
    await handler(mockReq, mockRes);
    expect(mockDAL.upsertSettings).toHaveBeenCalledWith(body);
  });

  it('calls upsertSettings exactly once per request', async () => {
    (mockDAL.upsertSettings as jest.Mock).mockResolvedValue(mockSettings);
    const handler = createUpdateSettingsController({ settingsDAL: mockDAL });
    await handler({ body: {} } as Request, mockRes);
    expect(mockDAL.upsertSettings).toHaveBeenCalledTimes(1);
  });
});
