import { Knex } from 'knex';
import { Event } from '../entity/event';

export type EventSummary = Pick<Event, 'id' | 'name'>;

export interface EventDAL {
  getEvents(limit: number): Promise<Event[]>;
  getEventsSummary(): Promise<EventSummary[]>;
}

export const createEventDAL = (knex: Knex): EventDAL => {
  return {
    async getEvents(limit): Promise<Event[]> {
      return await knex<Event>('events').select('*').limit(limit);
    },

    async getEventsSummary(): Promise<EventSummary[]> {
      return await knex<Event>('events').select('id', 'name');
    },
  };
}
