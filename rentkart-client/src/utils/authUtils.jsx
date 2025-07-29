import { toast } from 'react-toastify';

export const requireAuth = (navigate) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.warn("Please login to continue");
    setTimeout(() => {
      navigate('/login');
    }, 2000); // 2-second delay for user to read the toast
    return false;
  }
  return true;
};
