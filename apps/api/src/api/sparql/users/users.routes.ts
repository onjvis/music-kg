import { Router } from 'express';

import { authenticateToken } from '../../auth/auth.middleware';
import { createUser, getUser } from './users.handlers';

const usersRoutes: Router = Router();
usersRoutes.post('/', authenticateToken, createUser);
usersRoutes.get('/:id', authenticateToken, getUser);

export default usersRoutes;
