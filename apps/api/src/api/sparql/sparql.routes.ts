import { Router } from 'express';

import recordingsRoutes from './recordings/recordings.routes';
import usersRoutes from './users/users.routes';
import albumsRoutes from './routes/albums/albums.routes';
import playlistsRoutes from './routes/playlists/playlists.routes';
import recordingsRoutes from './routes/recordings/recordings.routes';
import usersRoutes from './routes/users/users.routes';

const sparqlRoutes: Router = Router();
sparqlRoutes.use('/albums', albumsRoutes);
sparqlRoutes.use('/playlists', playlistsRoutes);
sparqlRoutes.use('/recordings', recordingsRoutes);
sparqlRoutes.use('/users', usersRoutes);

export default sparqlRoutes;
