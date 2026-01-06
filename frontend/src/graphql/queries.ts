/**
 * GraphQL Queries für die Buch-Suche und -Anzeige
 *
 * Diese Datei enthält alle Query-Definitionen für das Lesen von Daten.
 * Die Queries entsprechen dem GraphQL-Schema des Backends.
 */
import { gql } from '@apollo/client/core';

/**
 * Query: Alle Bücher mit optionalen Suchparametern abrufen
 *
 * Verwendung: Auf der Such-Seite für die Bücherliste
 * Parameter: Alle optional - Titel, ISBN, Rating, Art, Lieferbar
 */
export const GET_BUECHER = gql`
  query GetBuecher($suchparameter: SuchparameterInput) {
    buecher(suchparameter: $suchparameter) {
      id
      isbn
      rating
      art
      preis
      lieferbar
      datum
      homepage
      schlagwoerter
      titel {
        titel
        untertitel
      }
    }
  }
`;

/**
 * Query: Einzelnes Buch anhand der ID abrufen
 *
 * Verwendung: Auf der Detail-Seite für die vollständige Buchansicht
 * Parameter: id (Pflicht) - Die ID des Buches
 */
export const GET_BUCH = gql`
  query GetBuch($id: ID!) {
    buch(id: $id) {
      id
      version
      isbn
      rating
      art
      preis
      lieferbar
      datum
      homepage
      schlagwoerter
      titel {
        titel
        untertitel
      }
      rabatt
    }
  }
`;
