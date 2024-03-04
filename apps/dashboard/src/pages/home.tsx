import { Outlet } from 'react-router-dom';

import Navbar from '../components/layout/navbar/navbar';
import CurrentUserProvider from '../contexts/current-user.context';

export const Home = () => {
  return (
    <CurrentUserProvider>
      <Navbar />
      <div className="flex flex-grow flex-col p-16">
        <Outlet />
      </div>
    </CurrentUserProvider>
  );
};

export default Home;
