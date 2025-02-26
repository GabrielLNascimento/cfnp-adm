import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './css/ObservacoesUsuario.css';

const ObservacoesUsuario = () => {
    const { cpf } = useParams(); // Obtém o CPF do usuário da URL
    const [observacoes, setObservacoes] = useState([]); // Estado para armazenar as observações
    const [carregando, setCarregando] = useState(true); // Estado para controlar o carregamento
    const [erro, setErro] = useState(null); // Estado para armazenar erros
    const navigate = useNavigate(); // Hook para navegação

    // Função para buscar as observações do usuário
    const buscarObservacoes = async () => {
        const token = localStorage.getItem('token'); // Recupera o token do localStorage

        if (!token) {
            navigate('/login', { replace: true }); // Redireciona para o login se não houver token
            return;
        }

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}/observacoes`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao carregar observações');
            }

            const dados = await resposta.json();
            setObservacoes(dados); // Atualiza o estado com as observações
        } catch (error) {
            setErro(error.message); // Atualiza o estado de erro
        } finally {
            setCarregando(false); // Finaliza o carregamento
        }
    };

    // useEffect para buscar as observações quando o componente for montado
    useEffect(() => {
        buscarObservacoes();
    }, [cpf, navigate]);

    // Exibir mensagem de carregamento
    if (carregando) {
        return <div>Carregando observações...</div>;
    }

    // Exibir mensagem de erro
    if (erro) {
        return <div>Erro: {erro}</div>;
    }

    // Exibir a lista de observações
    return (
        <div className="container-observation">
            <h1>Observações do Aluno</h1>
            <Link to={`/usuarios/${cpf}/observacoes/adicionar`}>
                <button className="button-primary">Adicionar Observação</button>
            </Link>
            <ul>
                {observacoes.length > 0 ? (
                    observacoes.map((observacao) => (
                        <li key={observacao._id}>{observacao.texto}</li>
                    ))
                ) : (
                    <li>Nenhuma observação encontrada.</li>
                )}
            </ul>
        </div>
    );
};

export default ObservacoesUsuario;
