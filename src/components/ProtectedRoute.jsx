// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Verifica o token

    if (!token) {
        // Se não houver token, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se houver token, renderiza o componente filho
    return children;
};

export default ProtectedRoute;
