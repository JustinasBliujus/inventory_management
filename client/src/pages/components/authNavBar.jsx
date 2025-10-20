import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../appContext';
import './darkMode.css';
import { FaSun , FaRegMoon } from "react-icons/fa";

function AuthNavbar() {
  const { i18n } = useTranslation();
  const { darkMode, toggleTheme, toggleLanguage } = useAppContext();

  return (
    <Navbar
      className='position-relative top-0 start-0'
      expand="lg"
      variant={darkMode ? "dark" : "light"}
      bg={darkMode ? "dark" : "light"}
    >
      <Container fluid>
        <div className='d-none d-lg-block px-5'></div>
          <Nav className="ms-auto align-items-center nav-items-collapsed">

            <Form.Group className="d-flex align-items-center mx-3">
                <Form.Check
                type="switch"
                id="theme-switch"
                checked={darkMode}
                onChange={toggleTheme}
                className="form-switch big-switch"
                />
                <Form.Label htmlFor="theme-switch" className="ms-2">
                    {darkMode ? <FaSun  color="white"></FaSun > : <FaRegMoon color="black"></FaRegMoon>}
                </Form.Label>
            </Form.Group>
            
            <div className="vr mx-2 d-none d-lg-block"></div>

            <Form.Group className="d-flex align-items-center mx-3">
                <Form.Check
                    type="switch"
                    id="language-switch"
                    checked={i18n.language === 'lt'}
                    onChange={toggleLanguage}
                    className="form-switch big-switch"
                />
                <Form.Label htmlFor="language-switch" className="ms-2">
                    {i18n.language.toUpperCase()}
                </Form.Label>
            </Form.Group>

          </Nav>
        <div className='d-none d-lg-block px-5'></div>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;
