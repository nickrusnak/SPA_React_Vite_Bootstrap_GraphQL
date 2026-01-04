/**
 * Apollo Client Konfiguration
 *
 * Konfiguriert den GraphQL-Client mit:
 * - HTTP-Link zum Backend (über Vite-Proxy)
 * - Auth-Header für JWT-Token
 * - Error-Handling für Netzwerk- und GraphQL-Fehler
 * - In-Memory-Cache für optimierte Datenabfragen
 */
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';

// Token-Key für localStorage (gleich wie im AuthContext)
const TOKEN_KEY = 'access_token';

/**
 * HTTP-Link zum GraphQL-Endpoint
 * Der Pfad /graphql wird durch Vite an das Backend geproxied
 */
const httpLink = createHttpLink({
  uri: '/graphql',
});

/**
 * Auth-Link fügt den JWT-Token zu jedem Request hinzu
 * Der Token wird aus dem localStorage gelesen
 */
const authLink = setContext((_, { headers }) => {
  // Token aus localStorage holen
  const token = localStorage.getItem(TOKEN_KEY);

  // Header mit Authorization erweitern, falls Token vorhanden
  return {
    headers: {
      ...headers,
      // Bearer-Token im Authorization-Header (Standard für JWT)
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * Error-Link für globales Error-Handling
 * Loggt GraphQL- und Netzwerk-Fehler in die Konsole
 * Apollo Client v4 verwendet CombinedGraphQLErrors für Error-Typen
 */
const errorLink = new ErrorLink(({ error }) => {
  // GraphQL-Fehler (z.B. Validierungsfehler, nicht gefunden, etc.)
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  } else {
    // Netzwerk-Fehler (z.B. Server nicht erreichbar)
    console.error(`[Network Error]: ${error.message}`);
  }
});

/**
 * Apollo Client Instanz
 * Kombiniert alle Links und den Cache
 */
export const apolloClient = new ApolloClient({
  // Links in Reihenfolge: Error -> Auth -> HTTP
  link: from([errorLink, authLink, httpLink]),

  // In-Memory-Cache für Client-seitiges Caching
  cache: new InMemoryCache({
    // Typ-Policies für optimierte Cache-Updates
    typePolicies: {
      Query: {
        fields: {
          // Bücher-Liste: Immer neu laden, nicht aus Cache
          buecher: {
            merge: false,
          },
        },
      },
    },
  }),

  // Standard-Optionen für Queries
  defaultOptions: {
    watchQuery: {
      // Daten aus Cache UND Netzwerk laden
      fetchPolicy: 'cache-and-network',
    },
  },
});
