import { Router } from 'express';

import { doCommonChecks, doCreateRequirementsCheck, doUpdateRequirementsCheck } from '../../sparql.middleware';
import {
  handleCreatePlaylist,
  handleDeletePlaylist,
  handleFindPlaylist,
  handleGetAllPlaylists,
  handleGetPlaylist,
  handleUpdatePlaylist,
} from './handlers';

const playlistsRoutes: Router = Router();
playlistsRoutes.get('/', doCommonChecks, handleGetAllPlaylists);
playlistsRoutes.post('/', doCommonChecks, doCreateRequirementsCheck, handleCreatePlaylist);
playlistsRoutes.get('/find', doCommonChecks, handleFindPlaylist);
playlistsRoutes.delete('/:id', doCommonChecks, handleDeletePlaylist);
playlistsRoutes.get('/:id', doCommonChecks, handleGetPlaylist);
playlistsRoutes.put('/:id', doCommonChecks, doUpdateRequirementsCheck, handleUpdatePlaylist);

export default playlistsRoutes;
