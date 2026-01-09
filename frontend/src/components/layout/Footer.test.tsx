/**
 * Unit Tests für Footer-Komponente
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('sollte das aktuelle Jahr anzeigen', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('sollte "Abgabe 3 SPA" im Text enthalten', () => {
    render(<Footer />);

    expect(screen.getByText(/Abgabe 3 SPA/i)).toBeInTheDocument();
  });

  it('sollte "Buchverwaltung" im Text enthalten', () => {
    render(<Footer />);

    expect(screen.getByText(/Buchverwaltung/i)).toBeInTheDocument();
  });
});
