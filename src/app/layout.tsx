import { ReactNode } from 'react';
import './globals.css';

// AuthProvider moved to a client component wrapper
import { ClientAuthProvider } from '@/lib/client-auth-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientAuthProvider>
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  );
}
