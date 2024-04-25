import { Router } from 'express';

import { doCommonChecks, doCreateRequirementsCheck, doUpdateRequirementsCheck } from '../../sparql.middleware';
import {
  handleCreateArtist,
  handleDeleteArtist,
  handleFindArtist,
  handleGetAllArtists,
  handleGetArtist,
  handleUpdateArtist,
} from './handlers';

const artistsRoutes: Router = Router();
artistsRoutes.get('/', doCommonChecks, handleGetAllArtists);
artistsRoutes.post('/', doCommonChecks, doCreateRequirementsCheck, handleCreateArtist);
artistsRoutes.get('/find', doCommonChecks, handleFindArtist);
artistsRoutes.delete('/:id', doCommonChecks, handleDeleteArtist);
artistsRoutes.get('/:id', doCommonChecks, handleGetArtist);
artistsRoutes.put('/:id', doCommonChecks, doUpdateRequirementsCheck, handleUpdateArtist);

export default artistsRoutes;
