import { Router } from 'express';

import authRoutes from './auth/auth.routes';

const apiRoutes: Router = Router();
apiRoutes.use('/auth', authRoutes);

export default apiRoutes;
