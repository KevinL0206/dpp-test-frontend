'use client'
import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { checkAndRestoreSession } from '../utils/auth';
import { AppDispatch } from '../store/store';
import { useEffect } from 'react';
const AuthInitializer: React.FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      checkAndRestoreSession(dispatch);
    }, [dispatch]);
  return <>{children}</>;
};

export default AuthInitializer;
