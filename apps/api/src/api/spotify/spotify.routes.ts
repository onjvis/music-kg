import { Router } from 'express';

import { getRecentlyPlayed } from './spotify.handlers';
import { provideSpotifyApi } from './spotify.middleware';

const spotifyRoutes: Router = Router();
spotifyRoutes.get('/recently-played', provideSpotifyApi, getRecentlyPlayed);

export default spotifyRoutes;
