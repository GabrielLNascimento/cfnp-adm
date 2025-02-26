// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/Login.css"

const Login = () => {
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const resposta = await fetch('https://api-cfnp.onrender.com/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ senha }),
            });
    
            if (!resposta.ok) {
                throw new Error('Senha incorreta');
            }
    
            const dados = await resposta.json();
            const token = dados.token; // Supondo que a API retorne um token
    
            console.log('Token recebido:', token); // Depuração
            localStorage.setItem('token', token); // Salva o token no localStorage
    
            navigate('/', { replace: true }); // Redireciona para a página inicial após o login
        } catch (error) {
            console.error('Erro no login:', error); // Depuração
            setError(error.message);
        }
    };

    return (
        <div className='container-login'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder='Digite a senha'
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className='button-primary'>Login</button>
            </form>
        </div>
    );
};

export default Login;
