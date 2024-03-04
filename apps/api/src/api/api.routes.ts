import { Router } from 'express';

import authRoutes from './auth/auth.routes';
import sparqlRoutes from './sparql/sparql.routes';

const apiRoutes: Router = Router();
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/sparql', sparqlRoutes);

export default apiRoutes;
