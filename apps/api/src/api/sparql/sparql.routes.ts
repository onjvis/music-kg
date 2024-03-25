import { Router } from 'express';

import recordingsRoutes from './recordings/recordings.routes';
import usersRoutes from './users/users.routes';
import recordingsRoutes from './routes/recordings/recordings.routes';
import usersRoutes from './routes/users/users.routes';

const sparqlRoutes: Router = Router();
sparqlRoutes.use('/recordings', recordingsRoutes);
sparqlRoutes.use('/users', usersRoutes);

export default sparqlRoutes;
