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
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { apolloClient } from './apollo/client';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { AuthProvider } from './context/AuthContext';

// Platzhalter-Komponenten (werden in Phase 4 implementiert)
const LoginPage = () => (
  <div className="text-center py-5">
    <h1>Login</h1>
    <p className="text-muted">Kommt in Phase 4...</p>
  </div>
);

const SearchPage = () => (
  <div className="text-center py-5">
    <h1>Buchsuche</h1>
    <p className="text-muted">Kommt in Phase 4...</p>
  </div>
);

const DetailPage = () => (
  <div className="text-center py-5">
    <h1>Buch-Details</h1>
    <p className="text-muted">Kommt in Phase 4...</p>
  </div>
);

const CreatePage = () => (
  <div className="text-center py-5">
    <h1>Neues Buch anlegen</h1>
    <p className="text-muted">Kommt in Phase 4...</p>
  </div>
);

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
          {/* MainLayout für einheitliches Aussehen aller Seiten */}
          <MainLayout>
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
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
