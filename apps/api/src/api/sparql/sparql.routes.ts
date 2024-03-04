import { Router } from 'express';

import usersRoutes from './users/users.routes';

const sparqlRoutes: Router = Router();
sparqlRoutes.use('/users', usersRoutes);

export default sparqlRoutes;
