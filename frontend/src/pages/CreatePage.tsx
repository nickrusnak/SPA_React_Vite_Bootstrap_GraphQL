/**
 * CreatePage - Formular zum Anlegen eines neuen Buches
 *
 * Ermöglicht das Erfassen aller Buchdaten inkl. Untertitel und Schlagwörter.
 * Validiert die Eingaben vor dem Absenden.
 */
import { useMutation } from '@apollo/client/react';
import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CREATE_BUCH_MUTATION } from '../graphql/mutations';
import { Buchart, type BuchInput } from '../types';

// Interface für Mutation-Response
interface CreateBuchResponse {
  create: {
    id: string;
  };
}

export const CreatePage = () => {
  const navigate = useNavigate();

  // Formular-State
  const [titel, setTitel] = useState('');
  const [untertitel, setUntertitel] = useState('');
  const [isbn, setIsbn] = useState('');
  const [preis, setPreis] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [art, setArt] = useState<Buchart>(Buchart.PAPERBACK);
  const [lieferbar, setLieferbar] = useState(true);
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]); // Heute als Standard
  const [homepage, setHomepage] = useState('');
  const [schlagwoerter, setSchlagwoerter] = useState(''); // Kommagetrennt

  // UI-State
  const [error, setError] = useState<string | null>(null);

  // Mutation
  const [createBuch, { loading }] = useMutation<CreateBuchResponse>(CREATE_BUCH_MUTATION, {
    onCompleted: (data) => {
      // Nach erfolgreichem Erstellen zur Detailseite des neuen Buches
      const newId = data.create.id;
      navigate(`/buch/${newId}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validierung
    if (!titel.trim()) {
      setError('Der Titel ist ein Pflichtfeld.');
      return;
    }
    if (!isbn.trim()) {
      setError('Die ISBN ist ein Pflichtfeld.');
      return;
    }
    const preisNum = parseFloat(preis.replace(',', '.'));
    if (isNaN(preisNum) || preisNum < 0) {
      setError('Bitte einen gültigen Preis eingeben.');
      return;
    }

    // Input-Objekt zusammenbauen
    const input: BuchInput = {
      isbn: isbn.trim(),
      titel: {
        titel: titel.trim(),
        untertitel: untertitel.trim() || undefined,
      },
      preis: preisNum,
      rating: rating,
      art: art,
      lieferbar: lieferbar,
      datum: datum,
      homepage: homepage.trim() || undefined,
      schlagwoerter: schlagwoerter
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    };

    try {
      await createBuch({ variables: { input } });
    } catch (err) {
      // Fehler wird bereits im onError Handler behandelt
      console.error('Fehler beim Erstellen:', err);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">✨ Neues Buch anlegen</h1>

      <Card>
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Titel & Untertitel */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="titel">
                  <Form.Label>Titel *</Form.Label>
                  <Form.Control
                    type="text"
                    value={titel}
                    onChange={(e) => setTitel(e.target.value)}
                    required
                    placeholder="Titel des Buches"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="untertitel">
                  <Form.Label>Untertitel</Form.Label>
                  <Form.Control
                    type="text"
                    value={untertitel}
                    onChange={(e) => setUntertitel(e.target.value)}
                    placeholder="Optionaler Untertitel"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* ISBN & Preis */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="isbn">
                  <Form.Label>ISBN *</Form.Label>
                  <Form.Control
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                    placeholder="978-..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="preis">
                  <Form.Label>Preis (€) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={preis}
                    onChange={(e) => setPreis(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Art & Datum */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="art">
                  <Form.Label>Buchart</Form.Label>
                  <Form.Select value={art} onChange={(e) => setArt(e.target.value as Buchart)}>
                    <option value={Buchart.HARDCOVER}>Hardcover</option>
                    <option value={Buchart.PAPERBACK}>Paperback</option>
                    <option value={Buchart.EPUB}>eBook (EPUB)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="datum">
                  <Form.Label>Erscheinungsdatum</Form.Label>
                  <Form.Control
                    type="date"
                    value={datum}
                    onChange={(e) => setDatum(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Rating & Lieferbar */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Rating ({rating} Sterne)</Form.Label>
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Range
                      min={0}
                      max={5}
                      step={1}
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    />
                    <span>{'⭐'.repeat(rating)}</span>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="lieferbar"
                  label="Buch ist lieferbar"
                  checked={lieferbar}
                  onChange={(e) => setLieferbar(e.target.checked)}
                />
              </Col>
            </Row>

            {/* Homepage & Schlagwörter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="homepage">
                  <Form.Label>Homepage URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={homepage}
                    onChange={(e) => setHomepage(e.target.value)}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="schlagwoerter">
                  <Form.Label>Schlagwörter</Form.Label>
                  <Form.Control
                    type="text"
                    value={schlagwoerter}
                    onChange={(e) => setSchlagwoerter(e.target.value)}
                    placeholder="JavaScript, Programmierung, ..."
                  />
                  <Form.Text className="text-muted">Mehrere Begriffe mit Komma trennen</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                Abbrechen
              </Button>
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Speichern...
                  </>
                ) : (
                  '💾 Buch anlegen'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
