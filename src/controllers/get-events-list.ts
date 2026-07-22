import { EventDAL } from '../dal/events.dal';
import { Request, Response } from 'express';

export const createGetEventsListController = ({
  eventsDAL,
}: {
  eventsDAL: EventDAL;
}) =>
  async (_req: Request, res: Response): Promise<void> => {
    const events = await eventsDAL.getEventsSummary();
    res.json(events);
  };
