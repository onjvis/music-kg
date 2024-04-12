import { useState } from 'react';

import { AppRoute } from '../../../models/enums/app-route.enum';
import { NavigationMenuOption } from './models/navigation-menu-option.model';
import { NavigationMenuProps } from './models/navigation-menu-props.model';
import { NavigationMenuItem } from './navigation-menu-item';

export const VerticalNavigationMenu = ({ defaultOption, menuOptions }: NavigationMenuProps) => {
  const [selectedTab, setSelectedTab] = useState<AppRoute | null>(defaultOption ?? null);

  return (
    <div className="flex flex-col justify-start divide-y-2 rounded-lg border-2">
      {menuOptions.map((option: NavigationMenuOption) => (
        <NavigationMenuItem
          key={option.to}
          className="flex-grow-0 first:rounded-t-lg last:rounded-b-lg"
          handleSelect={() => setSelectedTab(option.to)}
          isSelected={selectedTab === option.to}
          title={option.title}
          to={option.to}
        />
      ))}
    </div>
  );
};
