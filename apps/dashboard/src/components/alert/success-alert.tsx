import { IconContext } from 'react-icons';
import { IoCheckmark } from 'react-icons/io5';

import { Alert } from './alert';
import { SharedAlertProps } from './models/shared-alert-props.model';

export const SuccessAlert = ({ message }: SharedAlertProps) => {
  return (
    <Alert
      className="alert--success"
      icon={
        <IconContext.Provider value={{ color: 'green', size: '1.5em' }}>
          <IoCheckmark />
        </IconContext.Provider>
      }
      message={message}
    />
  );
};
