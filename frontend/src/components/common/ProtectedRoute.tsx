/**
 * ProtectedRoute - Schützt Routen vor nicht-authentifizierten Benutzern
 *
 * Diese Komponente prüft ob der Benutzer eingeloggt ist.
 * Falls nicht, wird er zur Login-Seite weitergeleitet.
 */
import { Container, Spinner } from 'react-bootstrap';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Während die Auth-Daten geladen werden, Spinner anzeigen
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Laden...</span>
        </Spinner>
      </Container>
    );
  }

  // Nicht eingeloggt -> zur Login-Seite weiterleiten
  // Die ursprüngliche URL wird gespeichert für Redirect nach Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Eingeloggt -> Kinder-Komponenten rendern
  return <>{children}</>;
};
