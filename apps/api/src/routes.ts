import { Express } from 'express';

import apiRoutes from './api/api.routes';

export const setRoutes = (app: Express) => {
  app.use('/api', apiRoutes);
};
