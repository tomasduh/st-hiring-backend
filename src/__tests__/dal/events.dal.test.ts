import { createEventDAL, EventSummary } from '../../dal/events.dal';
import { Knex } from 'knex';

describe('getEventsSummary', () => {
  it('returns events with only id and name', async () => {
    const mockEvents: EventSummary[] = [
      { id: 1, name: 'Rock Concert' },
      { id: 2, name: 'Jazz Festival' },
    ];
    const select = jest.fn().mockResolvedValue(mockEvents);
    const knexMock = jest.fn(() => ({ select })) as unknown as Knex;

    const dal = createEventDAL(knexMock);
    const result = await dal.getEventsSummary();

    expect(result).toEqual(mockEvents);
  });

  it('queries the events table selecting only id and name', async () => {
    const select = jest.fn().mockResolvedValue([]);
    const knexMock = jest.fn(() => ({ select })) as unknown as Knex;

    const dal = createEventDAL(knexMock);
    await dal.getEventsSummary();

    expect(knexMock).toHaveBeenCalledWith('events');
    expect(select).toHaveBeenCalledWith('id', 'name');
  });
});
