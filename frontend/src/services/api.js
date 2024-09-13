import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/authSlice';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Interceptor to intercept 401 (expired token) responses
api.interceptors.response.use(
    response => response,
    async (error) => {
        const dispatch = useDispatch();

        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Make a request to get a new access token
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/refresh-token`, null, {
                    withCredentials: true, // This sends the HttpOnly cookie with the refresh token
                });

                if (data.accessToken) {
                    dispatch(login(data.accessToken));
                    localStorage.setItem('token', data.accessToken);

                    // Update the Authorization header for the original request and retry it
                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                dispatch(logout());
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
