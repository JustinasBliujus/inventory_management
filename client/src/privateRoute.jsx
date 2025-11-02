import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Spinner } from 'react-bootstrap';
import { userService } from './api/userService';

const PrivateRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await userService.isLoggedIn();
        const currentUser = res.data.user;

        if (!currentUser) {
          navigate('/login', { state: { error: { message: 'Please log in to continue.' } } });
          return;
        }

        if (requiredRole && !currentUser[requiredRole]) {
          navigate('/login', { state: { error: { message: 'Access denied' } } });
          return;
        }

        setUser(currentUser);
      } catch (err) {
        navigate('/login', { state: { error: { message: err.response?.data?.message || err.message || 'Session expired. Please log in again.' } } });
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) return null;
  if (requiredRole && !user[requiredRole]) return null;

  return children;
};

export default PrivateRoute;
