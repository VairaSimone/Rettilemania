// NavBar.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { Link } from 'react-router-dom';


const NavBar = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">RETTILEMANIA</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">Chi siamo</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/services">Servizi</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contatti</Link>
                        </li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default NavBar;
