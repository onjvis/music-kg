import { AppRoute } from '../../../../models/enums/app-route.enum';
import { NavigationMenuOption } from './navigation-menu-option.model';

export type NavigationMenuProps = {
  defaultOption?: AppRoute;
  menuOptions: NavigationMenuOption[];
};
