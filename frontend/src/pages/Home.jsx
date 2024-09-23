import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useSelector } from 'react-redux';
import { Modal, Button, Card, Spinner, Pagination } from 'react-bootstrap';
import { FaTrash, FaEdit, FaInfoCircle, FaUtensils } from 'react-icons/fa';
import ReptileCreateModal from '../components/ReptileCreateModal.jsx';
import ReptileEditModal from '../components/ReptileEditModal.jsx';
import FeedingModal from '../components/FeedingModal.jsx';
import { selectUser } from '../features/userSlice.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  const [reptiles, setReptiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);
  const [selectedReptile, setSelectedReptile] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFeedingModal, setShowFeedingModal] = useState(false);

  useEffect(() => {
    const fetchReptiles = async () => {
      try {
        const { data } = await api.get(`/reptile/${user?._id}/allreptile`, {
          params: { page },
        });

        setReptiles(data.dati || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Non hai rettili registrati.');
        setLoading(false);
      }
    };

    fetchReptiles();
  }, [user, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleClose = () => setShowModal(false);
  const handleShow = (reptile) => {
    setSelectedReptile(reptile);
    setShowModal(true);
  };

  const handleEditClose = () => setShowEditModal(false);
  const handleEditShow = (reptile) => {
    setSelectedReptile(reptile);
    setShowEditModal(true);
  };

  const handleFeedingClose = () => setShowFeedingModal(false);
  const handleFeedingShow = (reptile) => {
    setSelectedReptile(reptile);
    setShowFeedingModal(true);
  };

  const deleteReptile = async (id) => {
    try {
      await api.delete(`/reptile/${id}`);
      setReptiles(reptiles.filter((reptile) => reptile._id !== id));
    } catch (err) {
      console.error('Error deleting reptile:', err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Caricamento in corso...</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">La tua Dashboard dei Rettili</h2>

      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crea Nuovo Rettile
      </Button>

      <ReptileCreateModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        setReptiles={setReptiles}
      />

      {error ? (
        <p className="mt-4 text-center">{error}</p>
      ) : reptiles.length === 0 ? (
        <p className="mt-4 text-center">Non hai rettili registrati. Crea uno nuovo!</p>
      ) : (
        <div>
          <div className="row mt-4">
            {reptiles.map((reptile) => (
              <div key={reptile._id} className="col-md-6 col-lg-4">
                <Card className="mb-4 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={reptile.image || 'https://via.placeholder.com/300x200'}
                    alt={reptile.name}
                  />
                  <Card.Body>
                    <Card.Title>{reptile.name}</Card.Title>
                    <Card.Text>
                      <strong>Specie:</strong> {reptile.species}
                      <br />
                      <strong>Morph:</strong> {reptile.morph || 'Non specificato'}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="info" onClick={() => handleShow(reptile)}>
                        <FaInfoCircle /> Impostazioni
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteReptile(reptile._id)}
                      >
                        <FaTrash /> Elimina
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      <ReptileEditModal
        show={showEditModal}
        handleClose={handleEditClose}
        reptile={selectedReptile}
        setReptiles={setReptiles}
      />

      <FeedingModal
        show={showFeedingModal}
        handleClose={handleFeedingClose}
        reptileId={selectedReptile?._id}
      />

      {selectedReptile && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Impostazione di {selectedReptile.name}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Link className="btn" to={`/reptiles/${selectedReptile._id}`}>
              Dettagli rettili
            </Link>            
            <Button variant="secondary" onClick={handleClose}>
              Chiudi
            </Button>
            <Button
              variant="primary"
              onClick={() => handleEditShow(selectedReptile)}
            >
              <FaEdit /> Modifica
            </Button>
            <Button
              variant="warning"
              onClick={() => handleFeedingShow(selectedReptile)}
            >
              <FaUtensils /> Pasti
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Home;
