import { MongoClient } from 'mongodb';

export const createMongoClient = async (uri: string): Promise<MongoClient> => {
  const client = new MongoClient(uri);
  await client.connect();
  return client;
};
