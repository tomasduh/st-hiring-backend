import { createGetEventsListController } from '../../controllers/get-events-list';
import { EventDAL, EventSummary } from '../../dal/events.dal';
import { Request, Response } from 'express';

const mockEventsSummary: EventSummary[] = [
  { id: 1, name: 'Rock Concert' },
  { id: 2, name: 'Jazz Festival' },
];

const mockDAL: EventDAL = {
  getEvents: jest.fn(),
  getEventsSummary: jest.fn(),
};

const mockRes = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;

beforeEach(() => jest.clearAllMocks());

describe('createGetEventsListController', () => {
  it('returns the list of events with only id and name', async () => {
    (mockDAL.getEventsSummary as jest.Mock).mockResolvedValue(mockEventsSummary);
    const handler = createGetEventsListController({ eventsDAL: mockDAL });
    await handler({} as Request, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(mockEventsSummary);
  });

  it('returns an empty array when there are no events', async () => {
    (mockDAL.getEventsSummary as jest.Mock).mockResolvedValue([]);
    const handler = createGetEventsListController({ eventsDAL: mockDAL });
    await handler({} as Request, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });

  it('calls getEventsSummary once per request', async () => {
    (mockDAL.getEventsSummary as jest.Mock).mockResolvedValue(mockEventsSummary);
    const handler = createGetEventsListController({ eventsDAL: mockDAL });
    await handler({} as Request, mockRes);
    expect(mockDAL.getEventsSummary).toHaveBeenCalledTimes(1);
  });
});
