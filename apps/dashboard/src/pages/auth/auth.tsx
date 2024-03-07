import { useState } from 'react';

import AuthModeToggle from './components/auth-mode-toggle';
import AuthModeToggleOption from './components/auth-mode-toggle-option';
import LoginForm from './components/login-form';
import RegisterForm from './components/register-form';
import { AuthMode } from './models/auth-mode.type';

export const Auth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <div className="flex w-1/3 flex-col self-center rounded-lg border-2 bg-white">
      <AuthModeToggle>
        <AuthModeToggleOption
          authMode="register"
          className="rounded-tl-lg"
          handleClick={() => setAuthMode('register')}
          isSelected={authMode === 'register'}
        />
        <AuthModeToggleOption
          authMode="login"
          className="rounded-tr-lg"
          handleClick={() => setAuthMode('login')}
          isSelected={authMode === 'login'}
        />
      </AuthModeToggle>

      {authMode === 'register'
        ? <RegisterForm handleAfterRegister={() => setAuthMode('login')} />
        : <LoginForm />
      }
    </div>
  );
};

export default Auth;
