import { IconContext } from 'react-icons';
import { IoWarning } from 'react-icons/io5';

import { Alert } from './alert';
import { SharedAlertProps } from './models/shared-alert-props.model';

export const WarningAlert = ({ message }: SharedAlertProps) => {
  return (
    <Alert
      className="alert--warning"
      icon={
        <IconContext.Provider value={{ className: 'fill-yellow-400', size: '1.5em' }}>
          <IoWarning />
        </IconContext.Provider>
      }
      message={message}
    />
  );
};
