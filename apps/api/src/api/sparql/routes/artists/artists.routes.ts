import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  handleCreateArtist,
  handleDeleteArtist,
  handleFindArtist,
  handleGetAllArtists,
  handleGetArtist,
  handleUpdateArtist,
} from './artists.handlers';

const artistsRoutes: Router = Router();
artistsRoutes.get('/', authenticateToken, handleGetAllArtists);
artistsRoutes.post('/', authenticateToken, handleCreateArtist);
artistsRoutes.get('/find', authenticateToken, handleFindArtist);
artistsRoutes.delete('/:id', authenticateToken, handleDeleteArtist);
artistsRoutes.get('/:id', authenticateToken, handleGetArtist);
artistsRoutes.put('/:id', authenticateToken, handleUpdateArtist);

export default artistsRoutes;
