import { RouteObject } from 'react-router-dom';

import { AppRoute } from '../../models/enums/app-route.enum';
import User from './user';

export const UserRoutes: RouteObject = {
  path: AppRoute.USER,
  element: <User />,
};

export default UserRoutes;
