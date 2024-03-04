import { Router } from 'express';

import { createUser, getUser } from './users.handlers';
import { authenticateToken } from '../../auth/auth.middleware';

const usersRoutes: Router = Router();
usersRoutes.post('/', authenticateToken, createUser);
usersRoutes.get('/:id', authenticateToken, getUser);

export default usersRoutes;
