/**
 * Footer-Komponente
 *
 * Einfacher Footer mit Copyright-Hinweis.
 * Wird am unteren Rand jeder Seite angezeigt.
 */
import { Container } from 'react-bootstrap';

export const Footer = () => {
  // Aktuelles Jahr für Copyright dynamisch berechnen
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container className="text-center">
        <small>
          © {currentYear} Buchverwaltung - Aufgabe 3 SPA
        </small>
      </Container>
    </footer>
  );
};
