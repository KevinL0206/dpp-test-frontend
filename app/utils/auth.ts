import { loginSuccess, setAuthenticated, restoreSession } from '../store/authSlice';
import { AppDispatch } from '../store/store';

export const checkAndRestoreSession = async (dispatch: AppDispatch) => {
  try {
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('userData');
    
    if (token && userDataString) {
      const userData = JSON.parse(userDataString);
      dispatch(restoreSession({ token, user: userData }));
    } else {
      // If no valid session data, ensure the state is cleared
      dispatch(setAuthenticated(false));
    }
  } catch (error) {
    console.error('Error restoring session:', error);
    // Clear the invalid session data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch(setAuthenticated(false));
  }
};
