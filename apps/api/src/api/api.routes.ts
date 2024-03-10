import { Router } from 'express';

import authRoutes from './auth/auth.routes';
import sparqlRoutes from './sparql/sparql.routes';
import spotifyRoutes from './spotify/spotify.routes';

const apiRoutes: Router = Router();
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/sparql', sparqlRoutes);
apiRoutes.use('/spotify', spotifyRoutes);

export default apiRoutes;
