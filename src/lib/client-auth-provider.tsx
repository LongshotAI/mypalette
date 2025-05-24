'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
