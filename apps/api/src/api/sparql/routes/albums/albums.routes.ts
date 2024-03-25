import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  createAlbumHandler,
  deleteAlbumHandler,
  getAlbumHandler,
  getAllAlbumsHandler,
  updateAlbumHandler,
} from './albums.handlers';

const albumsRoutes: Router = Router();
albumsRoutes.get('/', authenticateToken, getAllAlbumsHandler);
albumsRoutes.post('/', authenticateToken, createAlbumHandler);
albumsRoutes.delete('/:id', authenticateToken, deleteAlbumHandler);
albumsRoutes.get('/:id', authenticateToken, getAlbumHandler);
albumsRoutes.put('/:id', authenticateToken, updateAlbumHandler);

export default albumsRoutes;
