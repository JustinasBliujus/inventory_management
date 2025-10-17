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
        setUser(res.data.user); 
        
        if (requiredRole && !res.data.user[requiredRole]) {
          navigate('/login', { state: { error: { message: "Access denied" } } });
        }
      } catch (err){
        navigate('/login', { state: { error: { message: err.response?.data?.message || err.message || "Session expired. Please log in again."} } });
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

  if (requiredRole && !user?.[requiredRole]) return null;

  return children;
};

export default PrivateRoute;
