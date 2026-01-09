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
import { useState } from 'react';
import { Alert, Badge, Button, Card, Col, ListGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DELETE_BUCH_MUTATION } from '../graphql/mutations';
import { GET_BUCH } from '../graphql/queries';
import type { Buch } from '../types';

interface BuchResponse {
  buch: Buch;
}

export const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State für Delete-Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, loading, error } = useQuery<BuchResponse>(GET_BUCH, {
    variables: { id },
    skip: !id,
  });

  const [deleteBuch, { loading: deleteLoading }] = useMutation(DELETE_BUCH_MUTATION, {
    onCompleted: () => {
      navigate('/suche');
    },
    onError: (err) => {
      setShowDeleteModal(false); // Modal schließen bei Fehler
      alert(`Fehler beim Löschen: ${err.message}`);
    },
  });

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deleteBuch({ variables: { id } });
    // Modal schließt automatisch durch Navigate, oder wir setzen es hier explizit false falls loading länger dauert
  };

  if (loading) {
    // ... loading spinner unchanged
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Lade Buchdetails...</span>
        </Spinner>
        <p className="mt-2 text-muted">Lade Buchdetails...</p>
      </div>
    );
  }

  if (error || !data?.buch) {
    // ... error alert unchanged
    return (
      <Alert variant="danger" className="mt-4">
        <Alert.Heading>Fehler beim Laden</Alert.Heading>
        <p>
          Das Buch konnte nicht geladen werden. Möglicherweise wurde es gelöscht oder die ID ist
          ungültig.
        </p>
        <hr />
        <Link to="/suche" className="btn btn-outline-danger">
          Zurück zur Suche
        </Link>
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
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>ISBN:</strong> <code>{buch.isbn}</code>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Preis:</strong>{' '}
                  <span className="fs-5 text-primary fw-bold">{buch.preis.toFixed(2)} €</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Bewertung:</strong> {'⭐'.repeat(buch.rating ?? 0)} ({buch.rating ?? 0}{' '}
                  von 5)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Lieferbar:</strong>{' '}
                  {buch.lieferbar ? (
                    <Badge bg="success">Ja</Badge>
                  ) : (
                    <Badge bg="danger">Nein</Badge>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Erscheinungsdatum:</strong> {buch.datum}
                </ListGroup.Item>
              </ListGroup>
            </Col>

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
                      {buch.schlagwoerter.map((sw: string, index: number) => (
                        <Badge key={index} bg="secondary" pill>
                          {sw}
                        </Badge>
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
            {isAuthenticated && (
              <Button variant="danger" onClick={handleDeleteClick} disabled={deleteLoading}>
                {deleteLoading ? <Spinner size="sm" /> : '🗑 Buch löschen'}
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Buch löschen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Möchten Sie das Buch <strong>{buch.titel.titel}</strong> wirklich unwiderruflich
            löschen?
          </p>
          <p className="text-danger small">Diese Aktion kann nicht rückgängig gemacht werden.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Abbrechen
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Lösche...
              </>
            ) : (
              'Ja, löschen'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
