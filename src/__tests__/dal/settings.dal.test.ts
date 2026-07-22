import { createSettingsDAL, SettingsDAL } from '../../dal/settings.dal';
import { Collection } from 'mongodb';
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

const mockCollection = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
} as unknown as Collection<Settings>;

let dal: SettingsDAL;

beforeEach(() => {
  jest.clearAllMocks();
  dal = createSettingsDAL(mockCollection);
});

describe('getSettings', () => {
  it('returns null when no settings document exists', async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue(null);
    const result = await dal.getSettings();
    expect(result).toBeNull();
  });

  it('returns the settings document when it exists', async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue(mockSettings);
    const result = await dal.getSettings();
    expect(result).toEqual(mockSettings);
  });

  it('calls findOne with projection excluding _id', async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue(null);
    await dal.getSettings();
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ projection: { _id: 0 } }),
    );
  });
});

describe('upsertSettings', () => {
  it('returns the updated settings document', async () => {
    (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(mockSettings);
    const result = await dal.upsertSettings({ currency: 'EUR' });
    expect(result).toEqual(mockSettings);
  });

  it('calls findOneAndUpdate with $set, upsert and returnDocument after', async () => {
    (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(mockSettings);
    await dal.upsertSettings({ currency: 'EUR' });
    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      expect.any(Object),
      { $set: { currency: 'EUR' } },
      expect.objectContaining({ upsert: true, returnDocument: 'after' }),
    );
  });
});
