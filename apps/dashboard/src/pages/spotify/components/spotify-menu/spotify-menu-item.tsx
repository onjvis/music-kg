import { Link } from 'react-router-dom';

import { AppRoute } from '../../../../models/enums/app-route.enum';

type SpotifyMenuItemProps = {
  className?: string;
  handleSelect: (to: AppRoute) => void;
  isSelected: boolean;
  title: string;
  to: AppRoute;
};

export const SpotifyMenuItem = ({ className, handleSelect, isSelected, title, to }: SpotifyMenuItemProps) => {
  const handleClick = () => handleSelect(to);

  return (
    <Link
      className={`flex-1 p-4 text-center font-bold hover:bg-blue-700 hover:text-white ${
        isSelected ? 'bg-blue-500 text-white' : ''
      } ${className}`}
      onClick={handleClick}
      to={to}
    >
      {title}
    </Link>
  );
};
