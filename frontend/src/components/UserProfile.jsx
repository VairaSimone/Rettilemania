import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/api/v1/me');
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setAvatar(data.avatar);
      } catch (err) {
        setError('Errore nel caricamento del profilo utente');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/user/${user._id}`, {
        name,
        email,
        password,
        avatar,
      });
      setUser(data);
      setError('');
    } catch (err) {
      setError('Errore nell\'aggiornamento del profilo');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/user/${user._id}`);
      dispatch(logoutUser());
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setError('Errore durante l\'eliminazione dell\'account');
    }
  };

  if (!user) {
    return <div>Caricamento profilo...</div>;
  }

  return (

    <div className="container">
      <Link className="nav-link" to="/home">Torna indietro</Link>

      <h2>Profilo Utente</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleUpdateProfile}>
        <div className="mb-3">
          <label>Nome</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password (lascia vuoto se non vuoi cambiare)</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Cambia la tua password"
          />
        </div>
        <div className="mb-3">
          <label>Avatar (URL)</label>
          <input
            type="text"
            className="form-control"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Aggiorna Profilo</button>
      </form>

      <hr />

      <h3>Elimina Account</h3>
      <p className="text-danger">Attenzione! Questa azione è irreversibile.</p>
      <button className="btn btn-danger" onClick={handleDeleteAccount}>
        Elimina Account
      </button>
    </div>
  );
};

export default UserProfile;
