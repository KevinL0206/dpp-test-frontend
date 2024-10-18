'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAndRestoreSession } from './utils/auth';
import { AppDispatch } from './store/store';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await checkAndRestoreSession(dispatch);
      } catch (error) {
        console.error('Error restoring session:', error);
      }
    };

    restoreSession();
  }, [dispatch]);

  return <>{children}</>;
}
