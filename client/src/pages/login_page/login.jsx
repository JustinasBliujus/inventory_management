import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { userService } from '../../api/userService';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router";
import { jwtDecode } from 'jwt-decode'
import { useTranslation } from 'react-i18next';
import '../components/darkMode.css'
import { useAppContext } from '../../appContext';
import GoogleButton from "../components/googleButton";
import AuthNavbar from '../components/authNavBar';

function LoginPage() {
  const { darkMode } = useAppContext();

  const { t } = useTranslation();
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
   <div>
     <AuthNavbar></AuthNavbar>
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-lg-4">
        <Form className="p-4 border rounded shadow" onSubmit={handleLogin}>
          <h2 className="mb-4 text-center">{t('login')}</h2>

          <Form.Group className="mb-4" controlId="email">
            <Form.Control
              type="email"
              placeholder={t('enterEmail')}
              size="lg"
              required
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Control
              type="password"
              placeholder={t('password')}
              size="lg"
              required
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-4" size="lg">
            {t('login')}
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

          <p className="text-center mb-3">{t('loginOther')}</p>

          <div className="d-flex flex-column gap-2 align-items-center mb-3">
            <GoogleButton
              text="signin_with"
              type="standard"
              size="large"
              theme={darkMode ? "filled_black" : "outline"} 
              width="250"
              onSuccess={(credentials) => {
                const credential = jwtDecode(credentials.credential);
                handleLoginGoogle(credential.email);
              }}
              onError={() => console.log("Login Failed")}
            />
          </div>

          <Form.Text className="d-block text-center" style={{ color: darkMode ? '#ccc' : undefined }}>
            <a
              style={{ cursor: "pointer" }}
              onClick={() => navigate('/register')}
            >
              {t('noAccountYet')}
            </a>
          </Form.Text>
        </Form>
      </div>
    </div>
   </div>
  );
}

export default LoginPage;
