import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';

function RegisterPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault(); 

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

            <Button variant="primary" type="submit" className='w-100 mb-4' size='lg'>
                Register
            </Button>

            <p className="text-center text-muted mb-3">or register with other accounts</p>

            <div className="d-flex flex-column gap-2 align-items-center mb-3">
                <GoogleButton />
            </div>

            <Form.Text className='d-block text-center'>
                <a href="/">Already Have an account?</a>
            </Form.Text>

        </Form>
        </div>
    </div>
  );
}

export default RegisterPage;
