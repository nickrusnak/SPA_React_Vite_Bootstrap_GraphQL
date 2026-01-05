/**
 * ErrorMessage-Komponente
 *
 * Zeigt Fehlermeldungen in einem Bootstrap-Alert an.
 * Unterstützt verschiedene Varianten (danger, warning, info).
 */
import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  /** Die Fehlernachricht die angezeigt werden soll */
  message: string;
  /** Optional: Überschrift für den Fehler */
  title?: string;
  /** Optional: Variante des Alerts (Standard: danger) */
  variant?: 'danger' | 'warning' | 'info';
  /** Optional: Callback wenn der Benutzer den Alert schließt */
  onClose?: () => void;
}

export const ErrorMessage = ({
  message,
  title = 'Fehler',
  variant = 'danger',
  onClose,
}: ErrorMessageProps) => {
  return (
    <Alert variant={variant} dismissible={!!onClose} onClose={onClose}>
      {title && <Alert.Heading>{title}</Alert.Heading>}
      <p className="mb-0">{message}</p>
    </Alert>
  );
};
