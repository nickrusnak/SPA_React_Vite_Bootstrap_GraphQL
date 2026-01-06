/**
 * DetailPage - Zeigt Details eines Buches an
 *
 * Funktionen:
 * - Lädt Buchdaten per GraphQL anhand der ID aus der URL
 * - Zeigt alle Buchdetails übersichtlich an
 * - Ermöglicht das Löschen des Buches (mit Sicherheitsabfrage)
 * - Verlinkt zur Bearbeiten-Seite (kommt später)
 */
import { useMutation, useQuery } from '@apollo/client/react';
import { Alert, Badge, Button, Card, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DELETE_BUCH_MUTATION } from '../graphql/mutations';
import { GET_BUCH } from '../graphql/queries';
import type { Buch } from '../types';

/**
 * Interface für Query-Response
 */
interface BuchResponse {
  buch: Buch;
}

export const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Prüfen ob User eingeloggt ist (für Löschen-Button)

  // Query: Buch laden
  const { data, loading, error } = useQuery<BuchResponse>(GET_BUCH, {
    variables: { id },
    skip: !id, // Query nicht ausführen wenn keine ID da ist
  });

  // Mutation: Buch löschen
  const [deleteBuch, { loading: deleteLoading }] = useMutation(DELETE_BUCH_MUTATION, {
    onCompleted: () => {
      // Nach erfolgreichem Löschen zur Suche zurück
      navigate('/suche');
    },
    onError: (err) => {
      alert(`Fehler beim Löschen: ${err.message}`);
    },
    // Cache aktualisieren wäre hier gut, aber Refetch auf der Suchseite reicht auch
  });

  /**
   * Löschen-Handler mit Sicherheitsabfrage
   */
  const handleDelete = async () => {
    if (window.confirm('Wollen Sie dieses Buch wirklich unwiderruflich löschen?')) {
      await deleteBuch({ variables: { id } });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Lade Buchdetails...</span>
        </Spinner>
        <p className="mt-2 text-muted">Lade Buchdetails...</p>
      </div>
    );
  }

  // Error State
  if (error || !data?.buch) {
    return (
      <Alert variant="danger" className="mt-4">
        <Alert.Heading>Fehler beim Laden</Alert.Heading>
        <p>Das Buch konnte nicht geladen werden. Möglicherweise wurde es gelöscht oder die ID ist ungültig.</p>
        <hr />
        <Link to="/suche" className="btn btn-outline-danger">Zurück zur Suche</Link>
      </Alert>
    );
  }

  const { buch } = data;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📖 Buchdetails</h1>
        <Link to="/suche" className="btn btn-outline-secondary">
          ⬅ Zurück zur Liste
        </Link>
      </div>

      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-light d-flex justify-content-between align-items-center">
          <span>{buch.titel.titel}</span>
          <Badge bg="info">{buch.art}</Badge>
        </Card.Header>
        
        <Card.Body>
          {buch.titel.untertitel && (
            <Card.Subtitle className="mb-3 text-muted display-6 fs-4">
              {buch.titel.untertitel}
            </Card.Subtitle>
          )}

          <Row className="mt-4">
            {/* Linke Spalte: Basisdaten */}
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>ISBN:</strong> <code>{buch.isbn}</code>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Preis:</strong> <span className="fs-5 text-primary fw-bold">{buch.preis.toFixed(2)} €</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Bewertung:</strong> {'⭐'.repeat(buch.rating ?? 0)} ({buch.rating ?? 0} von 5)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Lieferbar:</strong> {buch.lieferbar ? <Badge bg="success">Ja</Badge> : <Badge bg="danger">Nein</Badge>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Erscheinungsdatum:</strong> {buch.datum}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* Rechte Spalte: Zusätzliche Infos */}
            <Col md={6}>
              <ListGroup variant="flush">
                 <ListGroup.Item>
                  <strong>Homepage:</strong>{' '}
                  {buch.homepage ? (
                    <a href={buch.homepage} target="_blank" rel="noopener noreferrer">
                      {buch.homepage}
                    </a>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Schlagwörter:</strong>{' '}
                  {buch.schlagwoerter && buch.schlagwoerter.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {buch.schlagwoerter.map((sw, index) => (
                        <Badge key={index} bg="secondary" pill>{sw}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">Keine</span>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Interne ID:</strong> <small className="text-muted">{buch.id}</small>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="bg-white p-3">
          <div className="d-flex gap-2 justify-content-end">
             {/* Später noch Bearbeiten-Button hinzufügen */}
             {isAuthenticated && (
               <Button 
                variant="danger" 
                onClick={handleDelete} 
                disabled={deleteLoading}
              >
                {deleteLoading ? <Spinner size="sm" /> : '🗑 Buch löschen'}
              </Button>
             )}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};
