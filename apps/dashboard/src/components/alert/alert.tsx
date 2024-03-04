import { ReactNode } from 'react';

type AlertProps = {
  className: string;
  icon: ReactNode;
  message: string;
};

export const Alert = ({ className, icon, message }: AlertProps) => {
  return (
    <div className={`alert ${className}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};
