import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { RootState } from '../store/store';

interface LoginResponse {
  token: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}

export const useLogin = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());

    try {
      const response = await axios.post<LoginResponse>(`${process.env.BACKEND_URL}/api/login`, { email, password });
      
      const userData = {
        user_id: response.data.user_id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        profile_image: response.data.profile_image,
      };

      dispatch(loginSuccess({
        token: response.data.token,
        user: userData,
      }));

      // Store token and user data in localStorage for persistence
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userData', JSON.stringify(userData));

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        dispatch(loginFailure(err.response.data.error || 'An error occurred during login'));
      } else {
        dispatch(loginFailure('An unexpected error occurred'));
      }
      throw err;
    }
  };

  return { login, isLoading, error };
};
