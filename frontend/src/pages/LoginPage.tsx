/**
 * LoginPage - Anmeldeseite für die Buchverwaltung
 *
 * Diese Seite ermöglicht es Benutzern, sich mit ihren Credentials anzumelden.
 * Nach erfolgreicher Anmeldung wird der Benutzer zur Suchseite weitergeleitet.
 *
 * Features:
 * - Formular mit Username und Passwort
 * - Fehleranzeige bei falschen Credentials
 * - Redirect zur ursprünglichen Seite nach Login
 * - Loading-State während der Authentifizierung
 */
import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Interface für den Location-State (von ProtectedRoute übergeben)
 */
interface LocationState {
  from?: {
    pathname: string;
  };
}

export const LoginPage = () => {
  // Auth-Context für Login-Funktion
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Formular-State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // UI-State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zielseite nach Login (von ProtectedRoute übergeben oder /suche als Standard)
  const from = (location.state as LocationState)?.from?.pathname || '/suche';

  // Wenn bereits eingeloggt, zur Zielseite weiterleiten
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  /**
   * Formular-Submit-Handler
   * Ruft die Login-Funktion auf und behandelt Erfolg/Fehler
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validierung
    if (!username.trim() || !password.trim()) {
      setError('Bitte Benutzername und Passwort eingeben');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await login({ username, password });

      if (success) {
        // Bei Erfolg zur Zielseite navigieren
        navigate(from, { replace: true });
      } else {
        // Bei Fehler Meldung anzeigen
        setError('Anmeldung fehlgeschlagen. Bitte Zugangsdaten überprüfen.');
      }
    } catch (err) {
      // Unerwarteter Fehler
      console.error('Login-Fehler:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte später erneut versuchen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Header as="h4" className="text-center bg-primary text-white">
          🔐 Anmeldung
        </Card.Header>
        <Card.Body>
          {/* Fehlermeldung anzeigen */}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Benutzername */}
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Benutzername</Form.Label>
              <Form.Control
                type="text"
                placeholder="Benutzername eingeben"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
                required
              />
            </Form.Group>

            {/* Passwort */}
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </Form.Group>

            {/* Submit-Button */}
            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Anmeldung läuft...
                  </>
                ) : (
                  'Anmelden'
                )}
              </Button>
            </div>
          </Form>


        </Card.Body>
      </Card>
    </div>
  );
};
