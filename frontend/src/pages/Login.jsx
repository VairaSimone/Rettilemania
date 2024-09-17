import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/login`, { email, password });
      const { accessToken } = res.data;

      localStorage.setItem('token', accessToken);

      const userRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(loginUser(userRes.data));

      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Errore durante il login.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/login-google`;
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <hr />
      <button className="btn btn-danger" onClick={handleGoogleLogin}>
        Login con Google
      </button>
    </div>
  );
};

export default Login;
