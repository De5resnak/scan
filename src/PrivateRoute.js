// src/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { authData } = useContext(AuthContext);

    // Проверка наличия токена в контексте или localStorage
    const isAuthenticated = authData || localStorage.getItem('accessToken');

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
