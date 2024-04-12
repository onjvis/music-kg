import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  handleCreateRecording,
  handleDeleteRecording,
  handleFindRecording,
  handleGetAllRecordings,
  handleGetRecording,
  handleUpdateRecording,
} from './recordings.handlers';

const recordingsRoutes: Router = Router();
recordingsRoutes.get('/', authenticateToken, handleGetAllRecordings);
recordingsRoutes.post('/', authenticateToken, handleCreateRecording);
recordingsRoutes.get('/find', authenticateToken, handleFindRecording);
recordingsRoutes.delete('/:id', authenticateToken, handleDeleteRecording);
recordingsRoutes.get('/:id', authenticateToken, handleGetRecording);
recordingsRoutes.put('/:id', authenticateToken, handleUpdateRecording);

export default recordingsRoutes;
