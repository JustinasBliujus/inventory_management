import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaUser } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

function SharedNavbar() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.className = darkMode ? 'bg-dark text-white' : 'bg-light text-dark';
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
            <Navbar expand="lg" className={darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} style={{ borderBottom: darkMode ? '2px solid white' : '2px solid black' }}>
                <Container>
                    <Navbar.Brand href="#home" className="d-none d-md-inline">Final Project</Navbar.Brand>
         
                    <Form className="d-flex me-auto" style={{ maxWidth: '300px' }}>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" type="submit">Search</Button>
                    </Form>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
               
                        <Nav className="ms-auto" style={{ alignItems: 'center', gap: '15px' }}>

                            <div title="Admin" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaUser size={24} color="green" />
                                <Nav.Link href="#link" style={{ padding: 0 }}>Username</Nav.Link>
                            </div>
                
                            <Button onClick={toggleTheme} variant={darkMode ? 'outline-light' : 'outline-dark'}>
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </Button>
   
                            <DropdownButton
                                title="EN"
                                variant='outline-primary'
                                id="language-dropdown"
                            >
                                <Dropdown.Item href="#action/1">EN</Dropdown.Item>
                                <Dropdown.Item href="#action/2">LT</Dropdown.Item>
                            </DropdownButton>

                            <Button variant="outline-danger">Log out</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default SharedNavbar;