import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import api from '../services/api';
import { Modal, Button, Badge } from 'react-bootstrap';
import Notifications from './Notifications';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice'; // Assicurati di importare l'azione per il logout
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Chiamata API opzionale per invalidare il token sul server
      await api.post('/api/v1/logout', null, {
        withCredentials: true, // Assicurati di includere i cookie
      });
      // Reset dello stato utente nel Redux store
      dispatch(logoutUser());
      localStorage.removeItem('token');
      // Reindirizza l'utente alla pagina di login
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };
  // Function to retrieve the count of unread notifications
  const fetchNotificationsCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread/count');
      setNotificationsCount(data.unreadCount);
    } catch (err) {
      console.error('Error getting notification count:', err);
    }
  };

  useEffect(() => {
    fetchNotificationsCount();

    // Polling every 30 seconds to update the unread notification count
    const intervalId = setInterval(fetchNotificationsCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyApp</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Button variant="info" onClick={handleShow}>
                <FaBell size={20} />
                {notificationsCount > 0 && <Badge bg="danger" pill>{notificationsCount}</Badge>}
              </Button>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">Profilo</NavLink>
            </li>
            <li className="nav-item">
              <Button className="nav-link btn btn-link" onClick={handleLogout}>Logout</Button>
            </li>
          </ul>
        </div>

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Notifiche</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Notifications onNotificationRead={fetchNotificationsCount} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Chiudi</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </nav>
  );
};

export default Navbar;
