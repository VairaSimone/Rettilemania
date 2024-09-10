import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import GoogleLogin from '../components/GoogleLogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Sono richiesti email e password');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Credenziali invalide.');
                return;
            }

            if (data.accessToken) {
                dispatch(login(data.accessToken));
                navigate('/home');
            } else {
                setError('Login errato. Token non ricevuto.');
            }
        } catch (err) {
            setError('Errore di rete, riprovare più tardi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading ? 'Caricamento...' : 'Login'}
                </button>
            </form>
            <p className="mt-3">Non hai un account? <Link to="/register">Registrati</Link></p>
            <GoogleLogin />
        </div>
    );
};

export default Login;
