import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  createArtistHandler,
  deleteArtistHandler,
  getAllArtistsHandler,
  getArtistHandler,
  updateArtistHandler,
} from './artists.handlers';

const artistsRoutes: Router = Router();
artistsRoutes.get('/', authenticateToken, getAllArtistsHandler);
artistsRoutes.post('/', authenticateToken, createArtistHandler);
artistsRoutes.delete('/:id', authenticateToken, deleteArtistHandler);
artistsRoutes.get('/:id', authenticateToken, getArtistHandler);
artistsRoutes.put('/:id', authenticateToken, updateArtistHandler);

export default artistsRoutes;
