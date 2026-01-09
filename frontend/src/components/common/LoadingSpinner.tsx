/**
 * LoadingSpinner-Komponente
 *
 * Zeigt einen Ladeindikator während Daten geladen werden.
 * Kann optional eine Nachricht unter dem Spinner anzeigen.
 */
import { Container, Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  /** Optional: Text der unter dem Spinner angezeigt wird */
  message?: string;
  /** Optional: Zentriert den Spinner im Container */
  centered?: boolean;
}

export const LoadingSpinner = ({ message = 'Laden...', centered = true }: LoadingSpinnerProps) => {
  const spinner = (
    <div className="text-center">
      <Spinner animation="border" role="status" variant="primary">
        {/* Screenreader-Text für Accessibility */}
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && <p className="mt-2 text-muted">{message}</p>}
    </div>
  );

  // Wenn zentriert, zusätzlichen Container mit Flexbox verwenden
  if (centered) {
    return (
      <Container className="d-flex justify-content-center align-items-center py-5">
        {spinner}
      </Container>
    );
  }

  return spinner;
};
