/**
 * Unit Tests für ErrorMessage-Komponente
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('sollte die Fehlermeldung anzeigen', () => {
    render(<ErrorMessage message="Ein Fehler ist aufgetreten" />);
    
    expect(screen.getByText('Ein Fehler ist aufgetreten')).toBeInTheDocument();
  });

  it('sollte ein Alert mit variant="danger" rendern', () => {
    render(<ErrorMessage message="Testfehler" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert-danger');
  });
});
