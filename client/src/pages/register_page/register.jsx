import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { userService } from '../../api/userService';
import { useNavigate } from "react-router";
import { jwtDecode } from 'jwt-decode'
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../appContext';
import GoogleButton from "../components/googleButton";
import AuthNavbar from '../components/authNavBar';

function RegisterPage() {
  const { darkMode } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const clearError = () => {
    setError("");
  };

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegisterGoogle = async (credential) => {
  clearError();

    try {
      const name = credential.given_name || '';     
      const surname = credential.family_name || '';  
      const email = credential.email;
      await userService.registerGoogle({ name, surname, email });
      navigate('/login', { state: { success: { message: "Registration successful! Please login." } } });

    } catch (err) {
      console.error("Error from registerGoogle:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed!");
    }
  }


  const handleRegister = async (e) => {
    e.preventDefault(); 
    clearError();

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const { name, surname, email, password } = formData;
      
      await userService.register({ name, surname, email, password }); 

      navigate('/login', { state: { success: { message: "Registration successful! Please login." } } });

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div>
    <AuthNavbar></AuthNavbar>
    <div className="container d-flex justify-content-center align-items-center vh-90">
      <div className="col-12 col-lg-4">
        <Form className="p-5 border rounded shadow" onSubmit={handleRegister}>
          <h2 className="mb-4 text-center">{t('register')}</h2>

          <Form.Group className="mb-4" controlId="name">
            <Form.Control
              type="text"
              placeholder={t('firstName')}
              size="lg"
              required
              value={formData.name}
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="surname">
            <Form.Control
              type="text"
              placeholder={t('lastName')}
              size="lg"
              required
              value={formData.surname}
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Control
              type="email"
              placeholder={t('enterEmail')}
              size="lg"
              required
              value={formData.email}
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
            <Form.Text style={{ color: darkMode ? '#ccc' : undefined }} >
              {t('sendMessage')}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Control
              type="password"
              placeholder={t('password')}
              size="lg"
              required
              value={formData.password}
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="repeatPassword">
            <Form.Control
              type="password"
              placeholder={t('repeatPassword')}
              size="lg"
              required
              value={formData.repeatPassword}
              onChange={handleChange}
              className={darkMode ? 'textarea-dark' : ''}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-4" size="lg">
            Register
          </Button>

          {error && (<div className="alert alert-danger" role="alert">
            {error}
          </div>)}

          <p className="text-center mb-3">{t('registerOther')} </p>

          <div className="d-flex flex-column gap-2 align-items-center mb-3">
            <GoogleButton
              text="signup_with"
              type="standard"
              size="large"
              theme={darkMode ? "filled_black" : "outline"} 
              width="250"
              onSuccess={(credentials) => {
                const credential = jwtDecode(credentials.credential);
                handleRegisterGoogle(credential);
              }}
              onError={() => console.log("Register Failed")}
            />
          </div>

          <Form.Text className="d-block text-center" style={{ color: darkMode ? '#ccc' : undefined }}>
            <a style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>{t('alreadyHaveAccount')}</a>
          </Form.Text>
        </Form>
      </div>
    </div>
    </div>
  );
}

export default RegisterPage;
