import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { userService } from '../../api/userService';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(location.state?.error?.message || "");
  const [success, setSuccess] = useState(location.state?.success?.message || "");

  const clearError = () => setError("");
  const clearSuccess = () => setSuccess("");

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  } 
  
  const handleLoginGoogle = async (email) => {
    clearError();
    clearSuccess(); 

    try {
      await userService.loginGoogle({ email });

      const checkSession = await userService.isLoggedIn(); 

      if (checkSession.status !== 200) {
        setError("Session not set. Login failed.");
        return;
      }

      navigate('/main');
    } 
    catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    clearError();
    clearSuccess(); 

    try {
      const { email, password } = formData;
      await userService.login({ email, password });
      const checkSession = await userService.isLoggedIn(); 
      if (checkSession.status !== 200) {
        setError("Session not set. Login failed.");
        return;
      }
      navigate('/main');
    } 
    catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-lg-4">
        <Form className="p-4 border rounded shadow" onSubmit={handleLogin}>
          <h2 className="mb-4 text-center">Login</h2>

          <Form.Group className="mb-4" controlId="email">
            <Form.Control
              type="email"
              placeholder="Enter email"
              size="lg"
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              size="lg"
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-4" size="lg">
            Login
          </Button>

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <p className="text-center text-muted mb-3">or login with other accounts</p>

          {/* Social login buttons */}
          <div className="d-flex flex-column gap-2 align-items-center mb-3">
            
            <GoogleLogin 
            onSuccess={(credentials) => {
              const credential = jwtDecode(credentials.credential);
              handleLoginGoogle(credential.email);
            }}
            onError={() => console.log("Login Failed")}
            />

          </div>

          <Form.Text className="d-block text-center">
            <a
              style={{ cursor: "pointer" }}
              onClick={() => navigate('/register')}
            >
              Don't have an account yet?
            </a>
          </Form.Text>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
