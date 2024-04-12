import { AppRoute } from '../../../../models/enums/app-route.enum';

export type NavigationMenuOption = {
  to: AppRoute;
  title: string;
};
