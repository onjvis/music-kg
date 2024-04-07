import { IconContext } from 'react-icons';
import { BsInfoCircle } from 'react-icons/bs';

import { Alert } from './alert';
import { SharedAlertProps } from './models/shared-alert-props.model';

export const InfoAlert = ({ message }: SharedAlertProps) => {
  return (
    <Alert
      className="alert--info"
      icon={
        <IconContext.Provider value={{ color: 'dodgerblue', size: '1.5em' }}>
          <BsInfoCircle />
        </IconContext.Provider>
      }
      message={message}
    />
  );
};
