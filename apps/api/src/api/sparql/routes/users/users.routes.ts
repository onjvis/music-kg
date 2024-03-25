import { Router } from 'express';

import { authenticateToken } from '../../../auth/auth.middleware';
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUser,
  handleUpdateUser,
} from './users.handlers';
import { checkUserId } from './users.middleware';

const usersRoutes: Router = Router();
usersRoutes.get('/', authenticateToken, handleGetAllUsers);
usersRoutes.post('/', authenticateToken, checkUserId, handleCreateUser);
usersRoutes.delete('/:id', authenticateToken, checkUserId, handleDeleteUser);
usersRoutes.get('/:id', authenticateToken, handleGetUser);
usersRoutes.put('/:id', authenticateToken, checkUserId, handleUpdateUser);

export default usersRoutes;
