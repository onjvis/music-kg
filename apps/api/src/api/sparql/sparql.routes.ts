import { Router } from 'express';

import albumsRoutes from './routes/albums/albums.routes';
import artistsRoutes from './routes/artists/artists.routes';
import playlistsRoutes from './routes/playlists/playlists.routes';
import recordingsRoutes from './routes/recordings/recordings.routes';
import usersRoutes from './routes/users/users.routes';

const sparqlRoutes: Router = Router();
sparqlRoutes.use('/albums', albumsRoutes);
sparqlRoutes.use('/artists', artistsRoutes);
sparqlRoutes.use('/playlists', playlistsRoutes);
sparqlRoutes.use('/recordings', recordingsRoutes);
sparqlRoutes.use('/users', usersRoutes);

export default sparqlRoutes;
