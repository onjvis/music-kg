import { Router } from 'express';

import { getCurrentUser, loginUser, registerUser } from './auth.handlers';
import { authenticateToken } from './auth.middleware';

const authRoutes: Router = Router();
authRoutes.get('/current', authenticateToken, getCurrentUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/register', registerUser);

export default authRoutes;
