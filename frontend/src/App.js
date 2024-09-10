import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GoogleCallback from './pages/GoogleCallback';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { logout } from './features/authSlice';

function App() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Router>
            {isAuthenticated && <NavBar onLogout={handleLogout} />}
            <div className="content">
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
                    <Route path="/login-google-callback" element={<GoogleCallback />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
                    <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </div>
            {isAuthenticated && <Footer />}
        </Router>
    );
}

export default App;