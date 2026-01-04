/**
 * AuthContext - Verwaltet den Authentifizierungszustand der Anwendung
 *
 * Dieser Context speichert das JWT-Token und stellt Login/Logout-Funktionen
 * für die gesamte App bereit. Die Implementierung nutzt die GraphQL-Token-Mutation
 * des Backends für die Authentifizierung.
 *
 * Features:
 * - Token-Speicherung in localStorage (persistent über Browser-Sessions)
 * - Automatische Token-Wiederherstellung beim App-Start
 * - Login/Logout-Funktionen für Komponenten
 * - Benutzerinformationen aus Token extrahieren
 */
import { gql } from '@apollo/client/core';
import { useMutation } from '@apollo/client/react';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LoginCredentials, TokenPayload, User } from '../types';

// GraphQL-Mutation für Token-Anforderung (Login)
const TOKEN_MUTATION = gql`
  mutation Token($username: String!, $password: String!) {
    token(username: $username, password: $password) {
      access_token
      expires_in
      refresh_token
      refresh_expires_in
    }
  }
`;

// Keys für localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

/**
 * Hilfsfunktion: Initialen Auth-State aus localStorage laden
 * Diese Funktion wird nur einmal beim Initialisieren des States aufgerufen
 */
const getInitialAuthState = () => {
  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);

  if (storedToken && storedUser) {
    return {
      isAuthenticated: true,
      accessToken: storedToken,
      refreshToken: storedRefreshToken,
      user: JSON.parse(storedUser) as User,
    };
  }

  return {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    user: null,
  };
};

/**
 * Interface für den AuthContext
 * Definiert alle Funktionen und Werte die der Context bereitstellt
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

// Context mit null als Initialwert (wird durch Provider ersetzt)
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Custom Hook für einfachen Zugriff auf den Auth-Context
 * Wirft einen Fehler wenn er außerhalb des Providers verwendet wird
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
};

/**
 * Props für den AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider-Komponente
 * Wrapped die Anwendung und stellt den Auth-Context bereit
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State mit initialem Wert aus localStorage (synchron, kein useEffect nötig)
  const initialState = useMemo(() => getInitialAuthState(), []);

  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [user, setUser] = useState<User | null>(initialState.user);
  const [accessToken, setAccessToken] = useState<string | null>(initialState.accessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(initialState.refreshToken);

  // GraphQL-Mutation für Login
  const [tokenMutation] = useMutation<{ token: TokenPayload }>(TOKEN_MUTATION);

  /**
   * Login-Funktion
   * Ruft die Token-Mutation auf und speichert die Tokens
   *
   * @param credentials - Benutzername und Passwort
   * @returns true bei erfolgreicher Anmeldung, false bei Fehler
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { data } = await tokenMutation({
        variables: {
          username: credentials.username,
          password: credentials.password,
        },
      });

      if (data?.token) {
        const { access_token, refresh_token } = data.token;

        // Benutzerinfo aus Token (vereinfacht - normalerweise würde man JWT dekodieren)
        const userInfo: User = {
          username: credentials.username,
          roles: ['user'], // Standardrolle, könnte aus JWT extrahiert werden
        };

        // State aktualisieren
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(userInfo);
        setIsAuthenticated(true);

        // In localStorage speichern für Persistenz
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(userInfo));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      return false;
    }
  };

  /**
   * Logout-Funktion
   * Entfernt alle Tokens und setzt den State zurück
   */
  const logout = () => {
    // State zurücksetzen
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // localStorage leeren
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Context-Wert mit allen Funktionen und State
  const value: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
