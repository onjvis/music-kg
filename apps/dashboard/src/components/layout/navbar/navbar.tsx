import { IconContext } from 'react-icons';
import { FaHeadphones, FaHouse, FaSpotify, FaUser } from 'react-icons/fa6';

import { useCurrentUser } from '../../../contexts/current-user.context';
import { AppRoute } from '../../../models/enums/app-route.enum';
import CurrentUser from './current-user';
import NavbarLink from './navbar-link';

export const Navbar = () => {
  const { currentUser } = useCurrentUser();

  return (
    <div className="flex flex-row items-center justify-between gap-8 bg-white p-4 text-2xl">
      <div className="flex flex-row gap-8">
        <div className="flex flex-row items-center gap-4">
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <FaHeadphones />
            </div>
          </IconContext.Provider>
          <span>Music KG Dashboard</span>
        </div>
        <nav className="flex flex-row items-center gap-4">
          <NavbarLink to={AppRoute.HOME}>
            <FaHouse />
          </NavbarLink>
          <NavbarLink to={AppRoute.AUTH}>
            <FaUser />
          </NavbarLink>
          {currentUser?.id && currentUser?.email && (
            <NavbarLink to={AppRoute.SPOTIFY}>
              <FaSpotify />
            </NavbarLink>
          )}
        </nav>
      </div>
      <CurrentUser />
    </div>
  );
};

export default Navbar;
