/**
 * TypeScript Interfaces für Authentifizierung
 *
 * Diese Typen werden für die JWT-basierte Authentifizierung verwendet.
 * Sie entsprechen dem TokenPayload aus dem GraphQL-Schema.
 */

/**
 * Token-Antwort vom Backend bei erfolgreichem Login
 * Entspricht dem GraphQL-Type "TokenPayload"
 */
export interface TokenPayload {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

/**
 * Benutzerinformationen die aus dem JWT-Token extrahiert werden
 */
export interface User {
  username: string;
  roles?: string[];
}

/**
 * Login-Daten für die Token-Mutation
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Zustand des Auth-Contexts
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
}
