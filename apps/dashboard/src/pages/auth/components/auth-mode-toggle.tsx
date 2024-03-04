import { ReactNode } from 'react';

type AuthModeToggleProps = {
  children: ReactNode;
};

export const AuthModeToggle = ({ children }: AuthModeToggleProps) => {
  return <div className="flex flex-row justify-between rounded-t-lg border-b-2">{children}</div>;
};

export default AuthModeToggle;
