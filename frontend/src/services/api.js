import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/authSlice';

// Configura l'istanza Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL, // Backend URL
});

// Interceptor per intercettare risposte 401 (token scaduto)
api.interceptors.response.use(
    response => response,
    async (error) => {
        const dispatch = useDispatch();

        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Effettua una richiesta per ottenere un nuovo access token
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/refresh-token`, null, {
                    withCredentials: true, // Questo invia il cookie HttpOnly con il refresh token
                });

                if (data.accessToken) {
                    // Aggiorna il token in Redux e localStorage
                    dispatch(login(data.accessToken));
                    localStorage.setItem('token', data.accessToken);
                    
                    // Aggiorna l'header Authorization per la richiesta originale e ripetila
                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Se il refresh token è scaduto, effettua il logout
                dispatch(logout());
                localStorage.removeItem('token');
                window.location.href = '/login'; // Reindirizza al login
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
