import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { RootState } from '../store/store';

interface SignUpData {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  profile_image?: string;
}

interface SignUpResponse {
  token: string;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string;
  };
}

export const useSignUp = () => {
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const signUp = async (userData: SignUpData) => {
    dispatch(loginStart());
    try {
      const response = await axios.post<SignUpResponse>('https://verisart-kevin-core.eu.ngrok.io/api/signup', userData);
      
      const { token, user } = response.data;

      dispatch(loginSuccess({ token, user }));

      // Store token and user data in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        dispatch(loginFailure(err.response.data.error || 'An error occurred during sign up'));
      } else {
        dispatch(loginFailure('An unexpected error occurred'));
      }
      throw err;
    }
  };

  return { signUp, error, isAuthenticated };
};
