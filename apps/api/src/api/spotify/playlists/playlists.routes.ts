import { Router } from 'express';

import { provideSpotifyApi } from '../spotify.middleware';
import { getPlaylist, getUserPlaylists } from './playlists.handlers';

const playlistsRoutes: Router = Router();

playlistsRoutes.get('/', provideSpotifyApi, getUserPlaylists);
playlistsRoutes.get('/:id', provideSpotifyApi, getPlaylist);

export default playlistsRoutes;
