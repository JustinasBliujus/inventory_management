import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-lg-4">
        <Form className="p-4 border rounded shadow" onSubmit={handleSubmit}>
          <h2 className="mb-4 text-center">Login</h2>

          <Form.Group className="mb-4" controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              size="lg"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              size="lg"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-4" size="lg">
            Login
          </Button>

          <p className="text-center text-muted mb-3">or login with other accounts</p>

          {/* Social login buttons */}
          <div className="d-flex flex-column gap-2 align-items-center mb-3">
            <GoogleButton />
          </div>

          <Form.Text className="d-block text-center">
            <a href="/register">Don't have an account yet?</a>
          </Form.Text>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
