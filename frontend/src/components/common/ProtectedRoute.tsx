/**
 * ProtectedRoute - Schützt Routen vor nicht-authentifizierten Benutzern
 *
 * Diese Komponente prüft ob der Benutzer eingeloggt ist.
 * Falls nicht, wird er zur Login-Seite weitergeleitet.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Nicht eingeloggt -> zur Login-Seite weiterleiten
  // Die ursprüngliche URL wird gespeichert für Redirect nach Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Eingeloggt -> Kinder-Komponenten rendern
  return <>{children}</>;
};
