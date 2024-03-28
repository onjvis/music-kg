import { Router } from 'express';

import { provideSpotifyApi } from '../spotify.middleware';
import { getArtist } from './artists.handlers';

const artistsRoutes: Router = Router();

artistsRoutes.get('/:id', provideSpotifyApi, getArtist);

export default artistsRoutes;
