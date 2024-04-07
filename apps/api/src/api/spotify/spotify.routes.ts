import { Router } from 'express';

import albumsRoutes from './albums/albums.routes';
import artistsRoutes from './artists/artists.routes';
import playlistsRoutes from './playlists/playlists.routes';
import tracksRoutes from './tracks/tracks.routes';
import { getRecentlyPlayed, handleSpotifySearch } from './spotify.handlers';
import { provideSpotifyApi, provideSpotifyApiSimple } from './spotify.middleware';

const spotifyRoutes: Router = Router();
spotifyRoutes.use('/albums', albumsRoutes);
spotifyRoutes.use('/artists', artistsRoutes);
spotifyRoutes.use('/playlists', playlistsRoutes);
spotifyRoutes.get('/recently-played', provideSpotifyApi, getRecentlyPlayed);
spotifyRoutes.get('/search', provideSpotifyApiSimple, handleSpotifySearch);
spotifyRoutes.use('/tracks', tracksRoutes);

export default spotifyRoutes;
