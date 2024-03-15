import { Router } from 'express';

import playlistsRoutes from './playlists/playlists.routes';
import { getRecentlyPlayed } from './spotify.handlers';
import { provideSpotifyApi } from './spotify.middleware';

const spotifyRoutes: Router = Router();
spotifyRoutes.use('/playlists', playlistsRoutes);
spotifyRoutes.get('/recently-played', provideSpotifyApi, getRecentlyPlayed);

export default spotifyRoutes;
