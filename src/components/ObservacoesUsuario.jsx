import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './css/ObservacoesUsuario.css';
import TelaImpressao from './TelaImpressao';
import { Trash2, Printer, FileText, CirclePlus } from 'lucide-react';

const ObservacoesUsuario = ({ userRole }) => {
    const { cpf } = useParams();
    const [observacoes, setObservacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [deletando, setDeletando] = useState(null);
    const [mostrarTelaImpressao, setMostrarTelaImpressao] = useState(false);
    const [nomeAluno, setNomeAluno] = useState('');
    const [cpfAluno, setCpfAluno] = useState('');
    const navigate = useNavigate();

    const buscarObservacoes = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        try {
            const respostaUsuario = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!respostaUsuario.ok) {
                throw new Error('Erro ao carregar dados do aluno');
            }

            const usuario = await respostaUsuario.json();
            setNomeAluno(usuario.nome);
            setCpfAluno(usuario.cpf);

            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}/observacoes`,
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
            setObservacoes(dados);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    const abrirTelaImpressao = () => {
        setMostrarTelaImpressao(true);
    };

    const fecharTelaImpressao = () => {
        setMostrarTelaImpressao(false);
    };

    const deletarObservacao = async (id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        setDeletando(id);

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}/observacoes/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao deletar observação');
            }

            buscarObservacoes();
        } catch (error) {
            setErro(error.message);
        } finally {
            setDeletando(null);
        }
    };

    useEffect(() => {
        buscarObservacoes();
    }, [cpf, navigate]);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        dataObj.setDate(dataObj.getDate() + 1);
        return dataObj.toLocaleDateString('pt-BR');
    };

    if (carregando) {
        return <div className="loading">Carregando observações...</div>;
    }

    if (erro) {
        return <div className="error">Erro: {erro}</div>;
    }

    return (
        <div className="container-observation">
            <h1>Observações de {nomeAluno}</h1>
            <div className="observations-actions">
                <Link to={`/usuarios/${cpf}/observacoes/adicionar`}>
                    <button className="button-primary add-user">
                        <CirclePlus />
                    </button>
                </Link>
                <button
                    onClick={() => navigate(`/usuarios/${cpf}/relatorio`)} // Redireciona para a página de relatório
                    className="button-primary"
                >
                    <FileText />
                </button>
                <button onClick={abrirTelaImpressao} className="button-primary">
                    <Printer />
                </button>
            </div>

            {mostrarTelaImpressao && (
                <TelaImpressao
                    observacoes={observacoes}
                    onClose={fecharTelaImpressao}
                    nomeAluno={nomeAluno}
                    cpfAluno={cpfAluno}
                />
            )}
            <ul>
                {observacoes.length > 0 ? (
                    observacoes.map((observacao) => (
                        <li key={observacao._id}>
                            <div className="container-info">
                                <span className="observacao-texto">
                                    <strong>Observação:</strong>{' '}
                                    {observacao.texto}
                                </span>
                                <span className="observacao-data">
                                    <strong>Data:</strong>{' '}
                                    {formatarData(observacao.data)}
                                </span>
                            </div>
                            <span className="observacao-criadoPor">
                                <strong>Criado por:</strong>{' '}
                                {observacao.criadoPor || 'Desconhecido'}
                            </span>
                            {observacao.complemento && (
                                <div className="complemento">
                                    <strong>Complemento:</strong>{' '}
                                    {observacao.complemento}
                                </div>
                            )}
                            {userRole === 'admin' && (
                                <button
                                    className="button-primary delete-button"
                                    onClick={() =>
                                        deletarObservacao(observacao._id)
                                    }
                                    disabled={deletando === observacao._id}
                                >
                                    {deletando === observacao._id ? (
                                        'Deletando...'
                                    ) : (
                                        <Trash2 />
                                    )}
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li>Nenhuma observação encontrada.</li>
                )}
            </ul>
        </div>
    );
};

export default ObservacoesUsuario;
