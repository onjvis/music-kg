import { Fragment } from 'react';
import { IconContext } from 'react-icons';
import { FaUserPen } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { useCurrentUser } from '../../../contexts/current-user.context';
import { AppRoute } from '../../../models/enums/app-route.enum';

export const CurrentUser = () => {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const userIconClickHandler = () => {
    if (currentUser?.email) {
      navigate(AppRoute.USER);
    } else {
      navigate(AppRoute.AUTH);
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <IconContext.Provider value={{ color: 'blue', size: '2em' }}>
        <div
          className="hover:cursor-pointer"
          title={currentUser?.email ? 'User profile' : 'Register or login'}
          onClick={userIconClickHandler}
        >
          <FaUserPen />
        </div>
      </IconContext.Provider>
      <div className="flex flex-col gap-1 text-sm">
        {currentUser?.email ? (
          <Fragment>
            <span>Logged as:</span>
            <span>{currentUser?.email}</span>
          </Fragment>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </div>
  );
};

export default CurrentUser;
