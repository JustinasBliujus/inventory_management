import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { userService } from '../../api/userService';
import { useNavigate } from "react-router";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'

function RegisterPage() {
  const navigate = useNavigate();

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

      console.log(name, surname, email);

      await userService.registerGoogle({ name, surname, email });

      navigate('/login', { state: { success: { message: "Registration successful! Please login." } } });

    } catch (err) {
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-lg-4">
        <Form className="p-5 border rounded shadow" onSubmit={handleRegister}>
          <h2 className="mb-4 text-center">Register</h2>

          <Form.Group className="mb-4" controlId="name">
            <Form.Control
              type="text"
              placeholder="First Name"
              size="lg"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="surname">
            <Form.Control
              type="text"
              placeholder="Last Name"
              size="lg"
              required
              value={formData.surname}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Control
              type="email"
              placeholder="Enter email"
              size="lg"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              We will send you a verification message
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              size="lg"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="repeatPassword">
            <Form.Control
              type="password"
              placeholder="Repeat password"
              size="lg"
              required
              value={formData.repeatPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-4" size="lg">
            Register
          </Button>

          {error && (<div className="alert alert-danger" role="alert">
            {error}
          </div>)}

          <p className="text-center text-muted mb-3">or register with other accounts</p>

          <div className="d-flex flex-column gap-2 align-items-center mb-3">
            <GoogleLogin 
              onSuccess={(credentials) => {
                const credential = jwtDecode(credentials.credential);
                handleRegisterGoogle(credential);
              }}
              onError={() => console.log("Register Failed")}
              />
          </div>

          <Form.Text className="d-block text-center">
            <a style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Already Have an account?</a>
          </Form.Text>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
