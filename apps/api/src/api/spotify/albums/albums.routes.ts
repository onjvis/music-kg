import { Router } from 'express';

import { provideSpotifyApi } from '../spotify.middleware';
import { getAlbum } from './albums.handlers';

const albumsRoutes: Router = Router();

albumsRoutes.get('/:id', provideSpotifyApi, getAlbum);

export default albumsRoutes;
