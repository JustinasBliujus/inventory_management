import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../appContext';
import './darkMode.css';
import { FaSun , FaRegMoon } from "react-icons/fa";
import { useNavigate } from "react-router";

function SharedNavbar({ onSearch }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme, toggleLanguage, user } = useAppContext();

  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <Navbar
      className='position-relative top-0 start-0'
      expand="lg"
      variant={darkMode ? "dark" : "light"}
      bg={darkMode ? "dark" : "light"}
    >
      <Container fluid>
        <div className='d-none d-lg-block px-5'></div>
        <Navbar.Brand style={{cursor: "pointer"}} onClick={() => navigate('/main')} className="fw-bold d-none d-md-block">{t('projectName')}</Navbar.Brand>

        <Form className="d-flex me-auto ms-3" onSubmit={handleSubmit}>
          <Form.Control
            type="search"
            placeholder={t('search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={darkMode ? 'textarea-dark me-2' : 'me-2'}
          />
          <Button variant={darkMode ? 'outline-light' : 'outline-success'} type="submit">{t('search')}</Button>
        </Form>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center nav-items-collapsed">

            {/* User Info */}
            <div title="Admin" className="d-flex align-items-center gap-2 d-none d-lg-flex" style={{cursor: "pointer"}} onClick={() => navigate('/personal')}>
              <span className="fw-medium">{user?.name || ""}</span>
            </div>

            <Button
              className="d-lg-none w-100 my-2"
              variant={darkMode ? 'outline-light' : 'outline-dark'}
              onClick={toggleTheme}
            >
              {darkMode ? t('darkMode') : t('lightMode')}
            </Button>
            <div className="vr mx-2 d-none d-lg-block"></div>
            <Form.Group className="d-none d-lg-flex align-items-center mx-3">
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
            <Button
              className="d-lg-none w-100 my-2"
              variant="outline-primary"
              onClick={toggleLanguage}
            >
              {i18n.language.toUpperCase()}
            </Button>

            <Form.Group className="d-none d-lg-flex align-items-center mx-3">
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
            <div className="vr mx-2 d-none d-lg-block"></div>
            <Button variant="outline-danger" className="w-100 w-lg-auto my-2">{t('logout')}</Button>

          </Nav>
        </Navbar.Collapse>
        <div className='d-none d-lg-block px-5'></div>
      </Container>
    </Navbar>
  );
}

export default SharedNavbar;
