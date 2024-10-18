import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Dispatch logout action immediately
    dispatch(logout());

    // Clear all relevant localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // Add any other items that need to be cleared

    // Use a short timeout to ensure state updates have propagated
    setTimeout(() => {
      // Refresh the page
      window.location.reload();

    }, 1000);
  };

  return { handleLogout, isLoggingOut };
};
