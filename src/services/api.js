import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'https://api-cfnp.onrender.com/',
});

// Interceptor para adicionar o token ao cabeçalho
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
});

// Interceptor para verificar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token'); // Remove o token inválido
            const navigate = useNavigate();
            navigate('/login'); // Redireciona para a página de login
        }
        return Promise.reject(error);
    }
);

export default api;
