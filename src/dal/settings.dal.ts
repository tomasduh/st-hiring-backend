import { Collection, Filter } from 'mongodb';
import { Settings } from '../entity/settings';

const SETTINGS_FILTER: Filter<Settings> = {};

export interface SettingsDAL {
  getSettings(): Promise<Settings | null>;
  upsertSettings(data: Partial<Settings>): Promise<Settings>;
}

export const createSettingsDAL = (collection: Collection<Settings>): SettingsDAL => {
  return {
    async getSettings(): Promise<Settings | null> {
      return collection.findOne(SETTINGS_FILTER, { projection: { _id: 0 } }) as Promise<Settings | null>;
    },

    async upsertSettings(data: Partial<Settings>): Promise<Settings> {
      const result = await collection.findOneAndUpdate(
        SETTINGS_FILTER,
        { $set: data },
        { upsert: true, returnDocument: 'after', projection: { _id: 0 } },
      );
      return result as Settings;
    },
  };
};
