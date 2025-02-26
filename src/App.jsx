import React, { useEffect, useState } from 'react';
import {
    Route,
    Routes,
    Link,
    Navigate,
    useNavigate, // Importe useNavigate
} from 'react-router-dom';
import './App.css';

import UsuarioList from './components/UsuarioList';
import FormUsers from './components/FormUsers';
import ObservacoesUsuario from './components/ObservacoesUsuario';
import FormObservation from './components/FormObservation';
import EditUser from './components/EditUser';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar autenticação
    const navigate = useNavigate(); // useNavigate agora funciona corretamente

    // Função para buscar os usuários
    const buscarUsuarios = async () => {
        const token = localStorage.getItem('token'); // Recupera o token do localStorage

        if (!token) {
            setCarregando(false); // Atualiza o estado para evitar o loop
            navigate('/login', { replace: true }); // Redireciona para a página de login
            return;
        }

        try {
            const resposta = await fetch(
                'https://api-cfnp.onrender.com/usuarios',
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao carregar usuários');
            }

            const dados = await resposta.json();
            setUsuarios(dados);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    // Função para adicionar um usuário
    const adicionarUsuario = async (novoUsuario) => {
        const token = localStorage.getItem('token'); // Recupera o token

        if (!token) {
            navigate('/login', { replace: true }); // Redireciona para o login se não houver token
            return;
        }

        try {
            const resposta = await fetch(
                'https://api-cfnp.onrender.com/usuarios',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                    body: JSON.stringify(novoUsuario),
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao adicionar usuário');
            }

            const dados = await resposta.json();
            console.log('Usuário adicionado:', dados); // Depuração
            await buscarUsuarios(); // Atualiza a lista de usuários
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para deletar um usuário
    const deletarUsuario = async (cpf) => {
        const token = localStorage.getItem('token'); // Recupera o token do localStorage

        if (!token) {
            console.error('Token não encontrado. Redirecione para o login.'); // Depuração
            return;
        }

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao deletar usuário');
            }

            setUsuarios((prevUsuarios) =>
                prevUsuarios.filter((usuario) => usuario.cpf !== cpf)
            );
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para filtrar usuários por nome ou CPF
    const filtrarUsuarios = (usuarios, termo) => {
        if (!termo) return usuarios; // Retorna todos os usuários se não houver termo de pesquisa

        return usuarios.filter((usuario) => {
            const nomeMatch = usuario.nome
                .toLowerCase()
                .includes(termo.toLowerCase());
            const cpfMatch = usuario.cpf.includes(termo);
            return nomeMatch || cpfMatch; // Retorna true se o nome ou CPF corresponderem
        });
    };

    // Função para atualizar um usuário
    const atualizarUsuario = (cpf, novoNome) => {
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((usuario) =>
                usuario.cpf === cpf ? { ...usuario, nome: novoNome } : usuario
            )
        );
    };

    // Função para fazer logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o token do localStorage
        setIsAuthenticated(false); // Atualiza o estado de autenticação
        navigate('/login', { replace: true }); // Redireciona para a página de login
    };

    // useEffect para buscar os usuários ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem('token'); // Verifica o token

        if (token) {
            setIsAuthenticated(true); // Define o estado de autenticação como true
            buscarUsuarios(); // Chama buscarUsuarios apenas se houver token
        } else {
            console.log('Token não encontrado, redirecionando para /login'); // Depuração
            setCarregando(false); // Atualiza o estado para evitar o loop
            navigate('/login', { replace: true }); // Redireciona para o login se não houver token
        }
    }, [navigate]);

    if (carregando) {
        return <div>Carregando usuários...</div>;
    }

    if (erro) {
        return <div>Erro: {erro}</div>;
    }

    return (
        <div>
            <nav>
                <h1>Alunos CFNP</h1>
                <div>
                    {/* Mostra os botões apenas se o usuário estiver autenticado */}
                    {isAuthenticated && (
                        <>
                            <Link to="/">
                                <button className="button-primary">
                                    Lista de Usuários
                                </button>
                            </Link>
                            <Link to="/formusers">
                                <button className="button-primary">
                                    Adicionar Usuário
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="button-primary"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                {/* Rota pública */}
                <Route path="/login" element={<Login />} />

                {/* Rotas protegidas */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="container-userslist">
                                <div className="container-input">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por nome ou CPF..."
                                        value={termoPesquisa}
                                        onChange={(e) =>
                                            setTermoPesquisa(e.target.value)
                                        }
                                    />
                                </div>
                                <UsuarioList
                                    usuarios={filtrarUsuarios(
                                        usuarios,
                                        termoPesquisa
                                    )}
                                    onDelete={deletarUsuario}
                                />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/formusers"
                    element={
                        <ProtectedRoute>
                            <FormUsers adicionarUsuario={adicionarUsuario} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios/:cpf/observacoes"
                    element={
                        <ProtectedRoute>
                            <ObservacoesUsuario />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios/:cpf/observacoes/adicionar"
                    element={
                        <ProtectedRoute>
                            <FormObservation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios/:cpf/editar"
                    element={
                        <ProtectedRoute>
                            <EditUser atualizarUsuario={atualizarUsuario} />
                        </ProtectedRoute>
                    }
                />

                {/* Rota padrão para redirecionar para o login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
};

export default App;
