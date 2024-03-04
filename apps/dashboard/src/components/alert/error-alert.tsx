import { IconContext } from 'react-icons';
import { IoClose } from 'react-icons/io5';

import { Alert } from './alert';
import { SharedAlertProps } from './models/shared-alert-props.model';

export const ErrorAlert = ({ className, message }: SharedAlertProps) => {
  return (
    <Alert
      className={`alert--error ${className}`}
      icon={
        <IconContext.Provider value={{ color: 'red', size: '1.5em' }}>
          <div>
            <IoClose />
          </div>
        </IconContext.Provider>
      }
      message={message}
    />
  );
};

export default ErrorAlert;
