import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../../models/enums/app-route.enum';

type NavbarLinkProps = {
  children?: ReactNode;
  to: AppRoute;
};

export const NavbarLink = ({ to, children }: NavbarLinkProps) => {
  return (
    <Link to={to} className="rounded border-2 px-4 py-2 hover:bg-gray-50">
      {children}
    </Link>
  );
};
