import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

import UsuarioList from './components/UsuarioList';
import FormUsers from './components/FormUsers';
import ObservacoesUsuario from './components/ObservacoesUsuario';
import FormObservation from './components/FormObservation';
import EditUser from './components/EditUser';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RelatorioAluno from './components/RelatorioAluno';

const App = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [observacoes, setObservacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // Estado para armazenar a role do usuário
    const navigate = useNavigate();

    // Função para decodificar o token e obter a role
    const decodificarToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.role; // Retorna a role do usuário
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            return null;
        }
    };

    // Função para buscar os usuários
    const buscarUsuarios = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setCarregando(false);
            navigate('/login', { replace: true });
            return;
        }

        // Decodifica o token e define a role do usuário
        const role = decodificarToken(token);
        setUserRole(role);

        try {
            const resposta = await fetch(
                'https://api-cfnp.onrender.com/usuarios',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

    const buscarObservacoes = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token não encontrado. Redirecione para o login.');
            return;
        }

        try {
            const resposta = await fetch(
                'https://api-cfnp.onrender.com/observacoes',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao carregar observações');
            }

            const dados = await resposta.json();
            setObservacoes(dados); // Atualiza o estado com as observações
        } catch (error) {
            console.error('Erro ao buscar observações:', error);
            setErro(error.message);
        }
    };

    // Função para adicionar um usuário
    const adicionarUsuario = async (novoUsuario) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        try {
            const resposta = await fetch(
                'https://api-cfnp.onrender.com/usuarios',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(novoUsuario),
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao adicionar usuário');
            }

            const dados = await resposta.json();
            console.log('Usuário adicionado:', dados);
            await buscarUsuarios(); // Atualiza a lista de usuários
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para deletar um usuário
    const deletarUsuario = async (cpf) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token não encontrado. Redirecione para o login.');
            return;
        }

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
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

    const filtrarUsuarios = (usuarios, termo, observacoes) => {
        if (!termo) return usuarios; // Retorna todos os usuários se não houver termo de pesquisa

        return usuarios.filter((usuario) => {
            const nomeMatch = usuario.nome
                ? usuario.nome.toLowerCase().includes(termo.toLowerCase())
                : false; // Verifica se o nome existe antes de usar toLowerCase

            const cpfMatch = usuario.cpf ? usuario.cpf.includes(termo) : false; 

            // Filtra por observações (texto e data)
            const observacaoMatch = observacoes
                .filter((observacao) => observacao.usuarioId === usuario._id) 
                .some((observacao) => {
                    const textoMatch = observacao.texto
                        ? observacao.texto
                              .toLowerCase()
                              .includes(termo.toLowerCase())
                        : false; 

                    // Filtra por data
                    const dataMatch = observacao.data
                        ? new Date(observacao.data)
                              .toISOString()
                              .split('T')[0]
                              .includes(termo)
                        : false; 

                    return textoMatch || dataMatch; 
                });

            return nomeMatch || cpfMatch || observacaoMatch; // Retorna usuários que correspondem ao nome, CPF ou observações
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
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
    };

    // useEffect para buscar os usuários ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            setIsAuthenticated(true);
            buscarUsuarios();
            buscarObservacoes();
        } else {
            console.log('Token não encontrado, redirecionando para /login');
            setCarregando(false);
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    if (carregando) {
        return <div className="loading">Carregando usuários...</div>;
    }

    if (erro) {
        return <div className="error">Erro: {erro}</div>;
    }

    return (
        <div>
            <nav>
                <h1>Alunos CFNP</h1>
                <div>
                    {isAuthenticated && (
                        <>
                            <Link to="/">
                                <button className="button-primary">
                                    Lista de Alunos
                                </button>
                            </Link>
                            <Link to="/formusers">
                                <button className="button-primary">
                                    Adicionar Aluno
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
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="container-userslist">
                                <div className="container-input">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por nome, CPF ou observações..."
                                        value={termoPesquisa}
                                        onChange={(e) =>
                                            setTermoPesquisa(e.target.value)
                                        }
                                    />
                                </div>
                                <UsuarioList
                                    usuarios={filtrarUsuarios(
                                        usuarios,
                                        termoPesquisa,
                                        observacoes
                                    )}
                                    onDelete={deletarUsuario}
                                    userRole={userRole} // Passa a role do usuário logado
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
                            <ObservacoesUsuario userRole={userRole} />
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
                <Route
                    path="/usuarios/:cpf/relatorio"
                    element={
                        <ProtectedRoute>
                            <RelatorioAluno />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
};

export default App;
