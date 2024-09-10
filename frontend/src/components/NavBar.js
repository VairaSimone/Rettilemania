// NavBar.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const NavBar = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav>
            <ul>
                <li><button onClick={handleLogout}>Logout</button></li>
                {/* altri elementi del menu */}
            </ul>
        </nav>
    );
};

export default NavBar;
