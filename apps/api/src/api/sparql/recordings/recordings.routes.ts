import { Router } from 'express';

import { authenticateToken } from '../../auth/auth.middleware';
import {
  handleCreateRecording,
  handleDeleteRecording,
  handleGetAllRecordings,
  handleGetRecording,
  handleUpdateRecording,
} from './recordings.handlers';

const recordingsRoutes: Router = Router();
recordingsRoutes.get('/', authenticateToken, handleGetAllRecordings);
recordingsRoutes.post('/', authenticateToken, handleCreateRecording);
recordingsRoutes.delete('/:id', authenticateToken, handleDeleteRecording);
recordingsRoutes.get('/:id', authenticateToken, handleGetRecording);
recordingsRoutes.put('/:id', authenticateToken, handleUpdateRecording);

export default recordingsRoutes;
