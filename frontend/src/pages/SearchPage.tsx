/**
 * SearchPage - Buchsuche mit umfangreichem Suchformular
 *
 * Diese Seite demonstriert ALLE geforderten Formular-Elementtypen:
 * - Textfelder (Titel, ISBN)
 * - Dropdown/Select (Buchart)
 * - Radio-Buttons (Rating)
 * - Checkboxen (Lieferbar, Schlagwörter)
 * - Pagination für Ergebnisse
 *
 * Die Suche verwendet GraphQL-Queries zum Backend.
 */
import { useQuery } from '@apollo/client/react';
import { useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/common/Pagination';
import { GET_BUECHER } from '../graphql/queries';
import type { Buch, Buchart, SuchparameterInput } from '../types';

// Anzahl der Ergebnisse pro Seite
const ITEMS_PER_PAGE = 5;

/**
 * Interface für die GraphQL-Response
 */
interface BuecherResponse {
  buecher: Buch[];
}

export const SearchPage = () => {
  // ========== FORMULAR-STATE ==========

  // Textfelder
  const [titel, setTitel] = useState('');
  const [isbn, setIsbn] = useState('');

  // Dropdown (Buchart)
  const [art, setArt] = useState<Buchart | ''>('');

  // Radio-Buttons (Rating)
  const [rating, setRating] = useState<number | null>(null);

  // Checkboxen
  const [lieferbar, setLieferbar] = useState<boolean | null>(null);
  const [javascript, setJavascript] = useState(false);
  const [typescript, setTypescript] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Ob die Suche bereits durchgeführt wurde
  const [hasSearched, setHasSearched] = useState(false);

  // ========== GRAPHQL QUERY ==========

  /**
   * Baut die Suchparameter aus dem Formular-State
   */
  const buildSearchParams = (): SuchparameterInput | undefined => {
    const params: SuchparameterInput = {};

    if (titel.trim()) params.titel = titel.trim();
    if (isbn.trim()) params.isbn = isbn.trim();
    if (art) params.art = art;
    if (rating !== null) params.rating = rating;
    if (lieferbar !== null) params.lieferbar = lieferbar;

    // Schlagwörter zusammenstellen
    const schlagwoerter: string[] = [];
    if (javascript) schlagwoerter.push('JAVASCRIPT');
    if (typescript) schlagwoerter.push('TYPESCRIPT');
    if (schlagwoerter.length > 0) params.schlagwoerter = schlagwoerter;

    // Nur Parameter zurückgeben wenn mindestens einer gesetzt ist
    return Object.keys(params).length > 0 ? params : undefined;
  };

  // GraphQL Query - wird nur ausgeführt wenn hasSearched true ist
  const { data, loading, error, refetch } = useQuery<BuecherResponse>(GET_BUECHER, {
    variables: { suchparameter: buildSearchParams() },
    skip: !hasSearched, // Query erst nach Klick auf "Suchen" ausführen
  });

  // ========== EVENT HANDLERS ==========

  /**
   * Formular-Submit: Führt die Suche aus
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Zurück zur ersten Seite
    setHasSearched(true);
    refetch(); // Query neu ausführen
  };

  /**
   * Formular zurücksetzen
   */
  const handleReset = () => {
    setTitel('');
    setIsbn('');
    setArt('');
    setRating(null);
    setLieferbar(null);
    setJavascript(false);
    setTypescript(false);
    setHasSearched(false);
    setCurrentPage(1);
  };

  // ========== PAGINATION ==========

  const allBooks = data?.buecher || [];
  const totalPages = Math.ceil(allBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = allBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ========== RENDER ==========

  return (
    <div>
      <h1 className="mb-4">📚 Buchsuche</h1>

      {/* ========== SUCHFORMULAR ========== */}
      <Card className="mb-4">
        <Card.Header as="h5">Suchkriterien</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* ===== TEXTFELDER ===== */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="titel">
                  <Form.Label>Titel</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="z.B. Alpha"
                    value={titel}
                    onChange={(e) => setTitel(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Teilstring-Suche (z.B. "Alph" findet "Alpha")
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="isbn">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="z.B. 978-3-89790"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* ===== DROPDOWN (SELECT) ===== */}
              <Col md={4}>
                <Form.Group className="mb-3" controlId="art">
                  <Form.Label>Buchart (Dropdown)</Form.Label>
                  <Form.Select value={art} onChange={(e) => setArt(e.target.value as Buchart | '')}>
                    <option value="">-- Alle --</option>
                    <option value="EPUB">EPUB</option>
                    <option value="HARDCOVER">Hardcover</option>
                    <option value="PAPERBACK">Paperback</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* ===== RADIO-BUTTONS ===== */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Mindestbewertung (Radio)</Form.Label>
                  <div>
                    {[null, 1, 2, 3, 4, 5].map((value) => (
                      <Form.Check
                        key={value ?? 'any'}
                        inline
                        type="radio"
                        id={`rating-${value ?? 'any'}`}
                        name="rating"
                        label={value === null ? 'Alle' : `${value}⭐`}
                        checked={rating === value}
                        onChange={() => setRating(value)}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>

              {/* ===== CHECKBOX (Lieferbar) ===== */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Lieferbar (Checkbox)</Form.Label>
                  <div>
                    <Form.Check
                      type="checkbox"
                      id="lieferbar"
                      label="Nur lieferbare Bücher"
                      checked={lieferbar === true}
                      onChange={(e) => setLieferbar(e.target.checked ? true : null)}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* ===== CHECKBOXEN (Schlagwörter) ===== */}
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Schlagwörter (Checkboxen)</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="checkbox"
                      id="javascript"
                      label="JavaScript"
                      checked={javascript}
                      onChange={(e) => setJavascript(e.target.checked)}
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      id="typescript"
                      label="TypeScript"
                      checked={typescript}
                      onChange={(e) => setTypescript(e.target.checked)}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* ===== BUTTONS ===== */}
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Suche läuft...
                  </>
                ) : (
                  '🔍 Suchen'
                )}
              </Button>
              <Button variant="secondary" type="button" onClick={handleReset}>
                Zurücksetzen
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* ========== ERGEBNISSE ========== */}
      {error && (
        <Alert variant="danger">
          <strong>Fehler bei der Suche:</strong> {error.message}
        </Alert>
      )}

      {hasSearched && !loading && !error && (
        <Card>
          <Card.Header as="h5">Ergebnisse ({allBooks.length} Bücher gefunden)</Card.Header>
          <Card.Body>
            {allBooks.length === 0 ? (
              <p className="text-muted text-center py-4">
                Keine Bücher gefunden. Versuche andere Suchkriterien.
              </p>
            ) : (
              <>
                {/* Ergebnistabelle */}
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Titel</th>
                      <th>ISBN</th>
                      <th>Art</th>
                      <th>Rating</th>
                      <th>Preis</th>
                      <th>Lieferbar</th>
                      <th>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBooks.map((buch) => (
                      <tr key={buch.id}>
                        <td>
                          <strong>{buch.titel.titel}</strong>
                          {buch.titel.untertitel && (
                            <small className="text-muted d-block">{buch.titel.untertitel}</small>
                          )}
                        </td>
                        <td>
                          <code>{buch.isbn}</code>
                        </td>
                        <td>
                          <Badge bg="info">{buch.art}</Badge>
                        </td>
                        <td>{'⭐'.repeat(buch.rating ?? 0)}</td>
                        <td>{buch.preis.toFixed(2)} €</td>
                        <td>
                          {buch.lieferbar ? (
                            <Badge bg="success">✓ Ja</Badge>
                          ) : (
                            <Badge bg="secondary">✗ Nein</Badge>
                          )}
                        </td>
                        <td>
                          <Link to={`/buch/${buch.id}`} className="btn btn-sm btn-outline-primary">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
