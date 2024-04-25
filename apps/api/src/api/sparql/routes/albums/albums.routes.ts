import { Router } from 'express';

import { doCommonChecks, doCreateRequirementsCheck, doUpdateRequirementsCheck } from '../../sparql.middleware';
import {
  handleCreateAlbum,
  handleDeleteAlbum,
  handleFindAlbum,
  handleGetAlbum,
  handleGetAllAlbums,
  handleUpdateAlbum,
} from './handlers';

const albumsRoutes: Router = Router();
albumsRoutes.get('/', doCommonChecks, handleGetAllAlbums);
albumsRoutes.post('/', doCommonChecks, doCreateRequirementsCheck, handleCreateAlbum);
albumsRoutes.get('/find', doCommonChecks, handleFindAlbum);
albumsRoutes.delete('/:id', doCommonChecks, handleDeleteAlbum);
albumsRoutes.get('/:id', doCommonChecks, handleGetAlbum);
albumsRoutes.put('/:id', doCommonChecks, doUpdateRequirementsCheck, handleUpdateAlbum);

export default albumsRoutes;
