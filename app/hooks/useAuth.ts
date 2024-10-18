import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAuth = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  const getToken = (): string | null => {
    // First, try to get the token from Redux state
    if (token) {
      return token;
    }
    // If not in Redux state, try to get from localStorage
    return localStorage.getItem('token');
  };

  return {
    getToken,
    isAuthenticated: !!user,
    user,
  };
};

