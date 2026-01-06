/**
 * GraphQL Mutations für Authentifizierung und Buch-Verwaltung
 *
 * Diese Datei enthält alle Mutation-Definitionen für das Schreiben von Daten.
 * Die Mutations entsprechen dem GraphQL-Schema des Backends.
 */
import { gql } from '@apollo/client/core';

/**
 * Mutation: Login - Token vom Server anfordern
 *
 * Verwendung: Auf der Login-Seite
 * Parameter: username, password
 * Rückgabe: Access-Token und Refresh-Token
 */
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    token(username: $username, password: $password) {
      access_token
      expires_in
      refresh_token
      refresh_expires_in
    }
  }
`;

/**
 * Mutation: Token erneuern mit Refresh-Token
 *
 * Verwendung: Automatisch wenn Access-Token abgelaufen
 * Parameter: refreshToken
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refresh(refreshToken: $refreshToken) {
      access_token
      expires_in
      refresh_token
      refresh_expires_in
    }
  }
`;

/**
 * Mutation: Neues Buch anlegen
 *
 * Verwendung: Auf der "Neues Buch"-Seite
 * Parameter: input (BuchInput) - Alle Buchdaten
 * Rückgabe: ID des neu erstellten Buches
 */
export const CREATE_BUCH_MUTATION = gql`
  mutation CreateBuch($input: BuchInput!) {
    create(input: $input) {
      id
    }
  }
`;

/**
 * Mutation: Bestehendes Buch aktualisieren
 *
 * Verwendung: Auf der Bearbeiten-Seite
 * Parameter: input (BuchUpdateInput) - Geänderte Buchdaten
 * Rückgabe: Neue Version des Buches
 */
export const UPDATE_BUCH_MUTATION = gql`
  mutation UpdateBuch($input: BuchUpdateInput!) {
    update(input: $input) {
      version
    }
  }
`;

/**
 * Mutation: Buch löschen
 *
 * Verwendung: Auf der Detail-Seite (Löschen-Button)
 * Parameter: id - ID des zu löschenden Buches
 */
export const DELETE_BUCH_MUTATION = gql`
  mutation DeleteBuch($id: ID!) {
    delete(id: $id) {
      success
    }
  }
`;
