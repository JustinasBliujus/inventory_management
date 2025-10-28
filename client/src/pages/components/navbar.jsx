import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../appContext';
import './darkMode.css';
import { FaSun, FaRegMoon, FaExclamation } from "react-icons/fa";
import { useNavigate } from "react-router";
import { userService } from '../../api/userService';

function SharedNavbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme, toggleLanguage, user, setUser } = useAppContext();

  const [query, setQuery] = useState("");  

  useEffect(() => {
    if (!user) {
      userService.getCurrentUser("/session-user")
        .then(res => {
          if (res.data.success) setUser(res.data.user);
        })
        .catch(err => console.error("Failed to fetch user:", err));
    }
  }, [user, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await userService.search(query); 
      const searchResults = res.data || [];

      if (searchResults.length > 0) {
        navigate('/search', { state: { inventories: searchResults, query } });
      } else {
        navigate('/search', { state: {} });
      }
    } catch {
      navigate('/search', { state: {} });
    }
  };

  return (
    <Navbar
      expand="lg"
      variant={darkMode ? "dark" : "light"}
      bg={darkMode ? "dark" : "light"}
      className="sticky-top"
    >
      <Container >
        <Navbar.Brand
          style={{ cursor: "pointer", color: darkMode ? 'white' : 'black' }}
          className="fw-bold d-none d-md-block"
          onClick={() => navigate('/main')}
        >
          {t('projectName')}
        </Navbar.Brand>

        <Form className="d-flex me-auto ms-3" onSubmit={handleSubmit} style={{ maxWidth: '250px' }}>
          <Form.Control
            type="search"
            placeholder={t('fullSearch')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={darkMode ? 'textarea-dark me-2' : 'me-2'}
          />
          <Button variant={darkMode ? 'outline-light' : 'outline-success'} type="submit">
            {t('search')}
          </Button>
        </Form>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            {/* Collapsible menu items for mobile */}
            <div className="d-lg-none w-100 d-flex flex-column align-items-center text-center mt-3">
              <Nav.Link
                onClick={() => navigate('/main')}
                style={{ color: darkMode ? 'white' : 'black' }}
              >
                {t('main')}
              </Nav.Link>
              <hr className="my-2 w-75" />
              <Nav.Link
                onClick={() => navigate('/personal', { state: { userId: user?.id } })}
                style={{ color: darkMode ? 'white' : 'black' }}
              >
                {user?.name || 'Personal'} {user?.status !== 'verified' && <FaExclamation color="red" />}
              </Nav.Link>
              <hr className="my-2 w-75" />
              <Form.Check
                type="switch"
                id="theme-switch-mobile"
                checked={darkMode}
                onChange={toggleTheme}
                className="my-2 d-flex align-items-center justify-content-center"
                label={darkMode ? <FaSun className="me-1 mx-2" /> : <FaRegMoon className="me-1 mx-2" />}
              />
              <hr className="my-2 w-75" />
              <Form.Check
                type="switch"
                id="language-switch-mobile"
                checked={i18n.language === 'lt'}
                onChange={toggleLanguage}
                className="my-2"
                label={i18n.language.toUpperCase()}
              />
              <hr className="my-2 w-75" />
              <Button
                variant="danger"
                className="w-75"
                onClick={async () => {
                  try {
                    await userService.logout();
                    navigate('/login'); 
                  } catch (err) {
                    console.error("Logout failed:", err);
                  }
                }}
              >
                {t('logout')}
              </Button>
              <hr className="my-2 w-75" />
            </div>

            {/* Desktop view */}
            <div className="d-none d-lg-flex align-items-center">
              {/* User Info */}
              <div
                title={user?.status !== 'verified' ? t('verifyTooltip') : user?.role || 'User'}
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer", position: "relative", color: darkMode ? 'white' : 'black', fontWeight: 500 }}
                onClick={() => navigate('/personal', { state: { userId: user?.id } })}
              >
                <span>{user?.name || ""}</span>
                {user?.status !== 'verified' && <FaExclamation color="red" />}
              </div>

              <div className="vr mx-2"></div>

              {/* Theme Switch */}
              <Form.Group className="d-flex align-items-center mx-3">
                <Form.Check
                  type="switch"
                  id="theme-switch"
                  checked={darkMode}
                  onChange={toggleTheme}
                  className="form-switch big-switch"
                />
                <Form.Label htmlFor="theme-switch" className="ms-2 d-flex align-items-center">
                  {darkMode ? <FaSun className="me-1" color="white" /> : <FaRegMoon className="me-1" color="black" />}
                </Form.Label>
              </Form.Group>

              <div className="vr mx-2"></div>

              {/* Language Switch */}
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

              <div className="vr mx-2"></div>

              {/* Logout */}
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await userService.logout();
                    navigate('/login'); 
                  } catch (err) {
                    console.error("Logout failed:", err);
                  }
                }}
              >
                {t('logout')}
              </Button>
            </div>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SharedNavbar;
