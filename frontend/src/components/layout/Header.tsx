/**
 * Header-Komponente mit Responsive Navigation
 *
 * Verwendet React-Bootstrap Navbar für eine mobile-freundliche Navigation.
 * Zeigt Login/Logout-Button abhängig vom Auth-Status.
 */
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Logout-Handler
   * Ruft die Logout-Funktion auf und leitet zur Login-Seite weiter
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Logo/Markenname - Link zur Startseite */}
        <Navbar.Brand as={Link} to="/">
          📚 Buchverwaltung
        </Navbar.Brand>

        {/* Hamburger-Menü für mobile Ansicht */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Navigationslinks */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {/* Diese Links nur anzeigen wenn eingeloggt */}
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/suche">
                  Suche
                </Nav.Link>
                <Nav.Link as={Link} to="/neu">
                  Neues Buch
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Rechte Seite: Login/Logout */}
          <Nav>
            {isAuthenticated ? (
              <>
                {/* Benutzername anzeigen */}
                <Navbar.Text className="me-3">
                  Eingeloggt als: <strong>{user?.username}</strong>
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
