import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { knex } from 'knex';
import dbConfig from './knexfile';
import { createMongoClient } from './database/mongo';
import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createSettingsDAL } from './dal/settings.dal';
import { createGetEventsController } from './controllers/get-events';
import { createGetEventsListController } from './controllers/get-events-list';
import { createGetSettingsController } from './controllers/get-settings';
import { createUpdateSettingsController } from './controllers/update-settings';
import { createMaintenanceModeMiddleware } from './middlewares/maintenance-mode';
import { Settings } from './entity/settings';

(async () => {
  const Knex = knex(dbConfig.development);
  const mongoClient = await createMongoClient(process.env.MONGO_URI ?? 'mongodb://root:example@localhost:27017');
  const settingsCollection = mongoClient.db('seetickets').collection<Settings>('settings');

  const eventDAL = createEventDAL(Knex);
  const ticketDAL = createTicketDAL(Knex);
  const settingsDAL = createSettingsDAL(settingsCollection);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/events', createMaintenanceModeMiddleware({ settingsDAL }));
  app.get('/events/list', createGetEventsListController({ eventsDAL: eventDAL }));
  app.use('/events', createGetEventsController({ eventsDAL: eventDAL, ticketsDAL: ticketDAL }));

  app.get('/settings', createGetSettingsController({ settingsDAL }));
  app.post('/settings', createUpdateSettingsController({ settingsDAL }));

  app.use('/', (_req, res) => {
    res.json({ message: 'Hello API' });
  });

  app.listen(3000, () => {
    console.log('Server Started');
  });
})();
