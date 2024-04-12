import { useState } from 'react';

import { AppRoute } from '../../../models/enums/app-route.enum';
import { NavigationMenuOption } from './models/navigation-menu-option.model';
import { NavigationMenuProps } from './models/navigation-menu-props.model';
import { NavigationMenuItem } from './navigation-menu-item';

export const HorizontalNavigationMenu = ({ defaultOption, menuOptions }: NavigationMenuProps) => {
  const [selectedTab, setSelectedTab] = useState<AppRoute | null>(defaultOption ?? null);

  return (
    <div className="flex flex-row divide-x-2 rounded border-2">
      {menuOptions.map((option: NavigationMenuOption) => (
        <NavigationMenuItem
          key={option.to}
          className="first:rounded-l last:rounded-r"
          handleSelect={() => setSelectedTab(option.to)}
          isSelected={selectedTab === option.to}
          title={option.title}
          to={option.to}
        />
      ))}
    </div>
  );
};
