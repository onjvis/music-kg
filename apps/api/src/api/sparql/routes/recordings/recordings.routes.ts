import { Router } from 'express';

import { doCommonChecks, doCreateRequirementsCheck, doUpdateRequirementsCheck } from '../../sparql.middleware';
import {
  handleCreateRecording,
  handleDeleteRecording,
  handleFindRecording,
  handleGetAllRecordings,
  handleGetRecording,
  handleUpdateRecording,
} from './handlers';

const recordingsRoutes: Router = Router();
recordingsRoutes.get('/', doCommonChecks, handleGetAllRecordings);
recordingsRoutes.post('/', doCommonChecks, doCreateRequirementsCheck, handleCreateRecording);
recordingsRoutes.get('/find', doCommonChecks, handleFindRecording);
recordingsRoutes.delete('/:id', doCommonChecks, handleDeleteRecording);
recordingsRoutes.get('/:id', doCommonChecks, handleGetRecording);
recordingsRoutes.put('/:id', doCommonChecks, doUpdateRequirementsCheck, handleUpdateRecording);

export default recordingsRoutes;
