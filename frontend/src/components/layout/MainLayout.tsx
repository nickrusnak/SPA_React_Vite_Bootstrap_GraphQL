/**
 * MainLayout-Komponente
 *
 * Diese Komponente dient als Wrapper für alle Seiten.
 * Sie enthält den Header, den Hauptinhalt und den Footer.
 * Verwendet Flexbox um den Footer immer unten zu halten (Sticky Footer).
 */
import { Container } from 'react-bootstrap';
import { Footer } from './Footer';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // Flex-Container für Sticky Footer (Footer immer am unteren Rand)
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation am oberen Rand */}
      <Header />

      {/* Hauptinhalt - flex-grow-1 sorgt dafür dass es den verfügbaren Platz füllt */}
      <main className="flex-grow-1 py-4">
        <Container>{children}</Container>
      </main>

      {/* Footer am unteren Rand */}
      <Footer />
    </div>
  );
};
