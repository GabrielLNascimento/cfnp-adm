import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/RelatorioAluno.css';

const RelatorioAluno = () => {
    const { cpf } = useParams();
    const [relatorio, setRelatorio] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    // Função para buscar o relatório do aluno
    const buscarRelatorio = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao carregar relatório');
            }

            const dados = await resposta.json();
            setRelatorio(dados.relatorio || ''); // Define o relatório no estado
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    // Função para salvar o relatório
    const salvarRelatorio = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/${cpf}/relatorio`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ relatorio }),
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao salvar relatório');
            }

            alert('Relatório salvo com sucesso!');
            navigate(-1); // Redireciona para a página anterior
        } catch (error) {
            console.error('Erro ao salvar relatório:', error);
            alert('Erro ao salvar relatório.');
        }
    };

    useEffect(() => {
        buscarRelatorio();
    }, [cpf]);

    if (carregando) {
        return <div className="loading">Carregando relatório...</div>;
    }

    if (erro) {
        return <div className="error">Erro: {erro}</div>;
    }

    return (
        <div className="container-relatorio">
            <h1>Relatório do Aluno</h1>
            <textarea
                value={relatorio}
                onChange={(e) => setRelatorio(e.target.value)}
                placeholder="Digite o relatório do aluno..."
            />
            <button onClick={salvarRelatorio} className="button-primary">
                Salvar Relatório
            </button>
        </div>
    );
};

export default RelatorioAluno;
