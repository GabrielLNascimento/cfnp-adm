// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Verifica o token

    if (!token) {
        // Se não houver token, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se houver token, renderiza o componente filho
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
