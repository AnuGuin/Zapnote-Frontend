'use client'

import type { ComponentType } from 'react';
import LoginPage from "./login";
import SignupPage from "./signup";
import Background from '../ui/background';
import { ThemeToggleButton3 } from '@/src/theme/toggle-theme';

interface AuthPageProps {
  onAuthenticated: (user: { name: string; email: string} ) => void;
  mode?: 'login' | 'register';
}

const Login = LoginPage as unknown as ComponentType<{ onAuthenticated: (user: { name: string; email: string }) => void }>;
const Signup = SignupPage as unknown as ComponentType<{ onAuthenticated: (user: { name: string; email: string }) => void }>;

export function AuthPage({ onAuthenticated, mode = 'login' }: AuthPageProps) {
  return (
    <Background>
      <ThemeToggleButton3 className="fixed top-4 right-4 z-50 size-8 p-2" />
      {mode === 'login' ? (
        <Login onAuthenticated={onAuthenticated} />
      ) : (
        <Signup onAuthenticated={onAuthenticated} />
      )}
    </Background>
    
  )
  
}