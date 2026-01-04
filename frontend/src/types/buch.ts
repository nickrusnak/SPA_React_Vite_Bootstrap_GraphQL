/**
 * TypeScript Interfaces für Buch-Entität
 *
 * Diese Typen entsprechen dem GraphQL-Schema des Backends.
 * Sie werden für Type-Safety in der gesamten Anwendung verwendet.
 */

/**
 * Enum für die Art eines Buches
 * Muss mit dem Backend-Enum übereinstimmen
 */
export enum Buchart {
  EPUB = 'EPUB',
  HARDCOVER = 'HARDCOVER',
  PAPERBACK = 'PAPERBACK',
}

/**
 * Titel eines Buches mit optionalem Untertitel
 */
export interface Titel {
  titel: string;
  untertitel?: string;
}

/**
 * Hauptinterface für ein Buch
 * Entspricht dem GraphQL-Type "Buch"
 */
export interface Buch {
  id: string;
  version: number;
  isbn: string;
  rating?: number;
  art?: Buchart;
  preis: number;
  lieferbar?: boolean;
  datum?: string;
  homepage?: string;
  schlagwoerter?: string[];
  titel: Titel;
  rabatt?: string;
}

/**
 * Input-Typ für die Buchsuche
 * Entspricht dem GraphQL-Input "SuchparameterInput"
 */
export interface SuchparameterInput {
  titel?: string;
  isbn?: string;
  rating?: number;
  art?: Buchart;
  lieferbar?: boolean;
}

/**
 * Input-Typ für das Anlegen eines neuen Buches
 * Entspricht dem GraphQL-Input "BuchInput"
 */
export interface BuchInput {
  isbn?: string;
  rating?: number;
  art?: Buchart;
  preis?: number;
  rabatt?: number;
  lieferbar?: boolean;
  datum?: string;
  homepage?: string;
  schlagwoerter?: string[];
  titel: {
    titel: string;
    untertitel?: string;
  };
}

/**
 * Input-Typ für das Aktualisieren eines Buches
 * Entspricht dem GraphQL-Input "BuchUpdateInput"
 */
export interface BuchUpdateInput {
  id?: string;
  version?: number;
  isbn?: string;
  rating?: number;
  art?: Buchart;
  preis?: number;
  rabatt?: number;
  lieferbar?: boolean;
  datum?: string;
  homepage?: string;
  schlagwoerter?: string[];
}
