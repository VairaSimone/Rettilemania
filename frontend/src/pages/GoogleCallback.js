import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';

const GoogleCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            dispatch(login(token));
            navigate('/home');
        } else {
            setError('Autenticazione con Google fallita');
            navigate('/login');
        }
    }, [location, navigate, dispatch]);

    return (
        <div className="container">
            {error ? <h3>{error}</h3> : <h3>Login con Google completato. Reindirizzamento...</h3>}
        </div>
    );
};

export default GoogleCallback;
