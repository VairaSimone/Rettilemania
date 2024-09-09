import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (!name || !email || !password) {
            setError('I campi sono obbligatori');
            return;
        }
    
        // Invia i dati come JSON
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Imposta il tipo di contenuto a JSON
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),  // Trasforma i dati in formato JSON
        });
    
        if (response.ok) {
            navigate('/login');
        } else {
            const data = await response.json();
            setError(data.message || 'Registrazione errata');
        }
    };
    
    return (
        <div className="form-container">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit" className="btn btn-primary btn-block">Registrati</button>
            </form>
            <p className="mt-3">Possiedi già un account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
