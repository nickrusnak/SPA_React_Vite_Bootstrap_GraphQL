/**
 * Unit Tests für LoadingSpinner-Komponente
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('sollte den Standard-Text "Laden..." anzeigen', () => {
    render(<LoadingSpinner />);
    
    // Der Text erscheint zweimal (visually-hidden + p-Tag), also getAllByText verwenden
    const elements = screen.getAllByText('Laden...');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('sollte eine benutzerdefinierte Nachricht anzeigen können', () => {
    render(<LoadingSpinner message="Daten werden geladen..." />);
    
    const elements = screen.getAllByText('Daten werden geladen...');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('sollte einen Spinner mit role="status" haben', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
