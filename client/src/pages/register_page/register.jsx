import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Here you can do login logic (API call, validation, etc.)

    // Redirect to dashboard (or any route)
    navigate('/dashboard');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-lg-4">
        <Form className="p-5 border rounded shadow" onSubmit={handleSubmit}>
            <h2 className="mb-4 text-center">Register</h2>
            
            <Form.Group className="mb-4" controlId="formEmail">
                <Form.Control className='mb-1' type="email" placeholder="Enter email" size="lg" required/>
                <Form.Text className="text-muted">
                    We will send you a verification message
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
                <Form.Control type="password" placeholder="Password" size="lg" required/>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPasswordRepeat">
                <Form.Control type="password" placeholder="Repeat password" size="lg" required/>
            </Form.Group>

            <Button variant="primary" type="submit" className='w-100 mb-1' size='lg'>
                Register
            </Button>

            <Form.Text>
                <a href="/">Already Have an account?</a>
            </Form.Text>

        </Form>
        </div>
    </div>
  );
}

export default RegisterPage;
