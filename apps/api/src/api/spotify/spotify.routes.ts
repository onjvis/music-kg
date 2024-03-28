import { Router } from 'express';

import albumsRoutes from './albums/albums.routes';
import artistsRoutes from './artists/artists.routes';
import playlistsRoutes from './playlists/playlists.routes';
import { getRecentlyPlayed } from './spotify.handlers';
import { provideSpotifyApi } from './spotify.middleware';

const spotifyRoutes: Router = Router();
spotifyRoutes.use('/albums', albumsRoutes);
spotifyRoutes.use('/artists', artistsRoutes);
spotifyRoutes.use('/playlists', playlistsRoutes);
spotifyRoutes.get('/recently-played', provideSpotifyApi, getRecentlyPlayed);

export default spotifyRoutes;
