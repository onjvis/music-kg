import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  handleCreateAlbum,
  handleDeleteAlbum,
  handleFindAlbum,
  handleGetAlbum,
  handleGetAllAlbums,
  handleUpdateAlbum,
} from './albums.handlers';

const albumsRoutes: Router = Router();
albumsRoutes.get('/', authenticateToken, handleGetAllAlbums);
albumsRoutes.post('/', authenticateToken, handleCreateAlbum);
albumsRoutes.get('/find', authenticateToken, handleFindAlbum);
albumsRoutes.delete('/:id', authenticateToken, handleDeleteAlbum);
albumsRoutes.get('/:id', authenticateToken, handleGetAlbum);
albumsRoutes.put('/:id', authenticateToken, handleUpdateAlbum);

export default albumsRoutes;
