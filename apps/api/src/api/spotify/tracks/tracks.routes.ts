import { Router } from 'express';

import { provideSpotifyApi } from '../spotify.middleware';
import { getTrack } from './tracks.handlers';

const tracksRoutes: Router = Router();

tracksRoutes.get('/:id', provideSpotifyApi, getTrack);

export default tracksRoutes;
