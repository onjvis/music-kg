import { RouteObject } from 'react-router-dom';

import { AppRoute } from '../../models/enums/app-route.enum';
import { UploadFile } from './upload-file';

export const UploadRoutes: RouteObject = {
  path: AppRoute.UPLOAD,
  element: <UploadFile />,
};
