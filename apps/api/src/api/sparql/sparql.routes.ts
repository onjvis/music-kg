import { Router } from 'express';

import { handleGetEntityLinks } from './handlers/handle-get-entity-links';
import albumsRoutes from './routes/albums/albums.routes';
import artistsRoutes from './routes/artists/artists.routes';
import playlistsRoutes from './routes/playlists/playlists.routes';
import recordingsRoutes from './routes/recordings/recordings.routes';
import usersRoutes from './routes/users/users.routes';
import { doCommonChecks } from './sparql.middleware';

const sparqlRoutes: Router = Router();
sparqlRoutes.use('/albums', albumsRoutes);
sparqlRoutes.use('/artists', artistsRoutes);
sparqlRoutes.use('/playlists', playlistsRoutes);
sparqlRoutes.use('/recordings', recordingsRoutes);
sparqlRoutes.use('/users', usersRoutes);
sparqlRoutes.get('/links', doCommonChecks, handleGetEntityLinks);

export default sparqlRoutes;
