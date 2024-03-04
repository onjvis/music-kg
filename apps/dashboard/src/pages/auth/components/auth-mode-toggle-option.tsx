import { AuthMode } from '../models/auth-mode.type';

type AuthModeToggleOptionProps = {
  authMode: AuthMode;
  className: string;
  handleClick: () => void;
  isSelected: boolean;
};

export const AuthModeToggleOption = ({ authMode, className, handleClick, isSelected }: AuthModeToggleOptionProps) => {
  return (
    <div
      className={`flex w-1/2 cursor-pointer justify-center py-4 capitalize hover:bg-blue-700 hover:font-bold hover:text-white ${
        isSelected ? 'bg-blue-500 font-bold text-white' : ''
      } ${className}`}
      onClick={handleClick}
    >
      {authMode}
    </div>
  );
};

export default AuthModeToggleOption;
