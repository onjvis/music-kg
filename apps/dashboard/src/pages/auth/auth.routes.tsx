import { RouteObject } from 'react-router-dom';

import { AppRoute } from '../../models/enums/app-route.enum';
import { Auth } from './auth';

export const AuthRoutes: RouteObject = {
  path: AppRoute.AUTH,
  element: <Auth />,
};
