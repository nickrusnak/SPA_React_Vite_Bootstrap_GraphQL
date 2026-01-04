/**
 * App-Komponente mit React-Router Konfiguration
 *
 * Definiert alle Routen der Anwendung:
 * - /login: Login-Seite (öffentlich)
 * - /suche: Buchsuche (geschützt)
 * - /buch/:id: Buch-Details (geschützt)
 * - /neu: Neues Buch anlegen (geschützt)
 * - /: Startseite, leitet zu /suche weiter
 */
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { apolloClient } from './apollo/client';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Platzhalter-Komponenten (werden später implementiert)
const LoginPage = () => <div>Login Page - Coming Soon</div>;
const SearchPage = () => <div>Search Page - Coming Soon</div>;
const DetailPage = () => <div>Detail Page - Coming Soon</div>;
const CreatePage = () => <div>Create Page - Coming Soon</div>;

/**
 * Haupt-App-Komponente
 * Wrapped alles in Provider und Router
 */
function App() {
  return (
    // Apollo Provider für GraphQL-Zugriff in der gesamten App
    <ApolloProvider client={apolloClient}>
      {/* Auth Provider für Login-State in der gesamten App */}
      <AuthProvider>
        {/* Browser Router für clientseitiges Routing */}
        <BrowserRouter>
          <Routes>
            {/* Öffentliche Route: Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Geschützte Routen: Nur für eingeloggte Benutzer */}
            <Route
              path="/suche"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buch/:id"
              element={
                <ProtectedRoute>
                  <DetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/neu"
              element={
                <ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>
              }
            />

            {/* Startseite: Weiterleitung zur Suche */}
            <Route path="/" element={<Navigate to="/suche" replace />} />

            {/* 404: Unbekannte Routen zur Startseite */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
