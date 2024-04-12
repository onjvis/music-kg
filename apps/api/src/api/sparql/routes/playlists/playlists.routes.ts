import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  handleCreatePlaylist,
  handleDeletePlaylist,
  handleFindPlaylist,
  handleGetAllPlaylists,
  handleGetPlaylist,
  handleUpdatePlaylist,
} from './playlists.handlers';

const playlistsRoutes: Router = Router();
playlistsRoutes.get('/', authenticateToken, handleGetAllPlaylists);
playlistsRoutes.post('/', authenticateToken, handleCreatePlaylist);
playlistsRoutes.get('/find', authenticateToken, handleFindPlaylist);
playlistsRoutes.delete('/:id', authenticateToken, handleDeletePlaylist);
playlistsRoutes.get('/:id', authenticateToken, handleGetPlaylist);
playlistsRoutes.put('/:id', authenticateToken, handleUpdatePlaylist);

export default playlistsRoutes;
