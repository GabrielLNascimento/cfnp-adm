import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/FormObservation.css';

const FormObservation = () => {
    const { cpf } = useParams(); // Obtém o CPF da URL
    const [texto, setTexto] = useState(''); // Estado para armazenar o texto da observação
    const [carregando, setCarregando] = useState(false); // Estado para controlar o carregamento
    const [erro, setErro] = useState(null); // Estado para armazenar erros
    const navigate = useNavigate(); // Hook para navegação

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        const token = localStorage.getItem('token'); // Recupera o token do localStorage

        if (!token) {
            navigate('/login', { replace: true }); // Redireciona para o login se não houver token
            return;
        }

        try {
            // Buscar o usuário pelo CPF para obter o ID
            const respostaUsuario = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                }
            );
            if (!respostaUsuario.ok) {
                throw new Error('Erro ao buscar usuário');
            }
            const usuario = await respostaUsuario.json();

            // Enviar a observação para o backend
            const respostaObservacao = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}/observacoes`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                    body: JSON.stringify({
                        texto,
                        usuarioId: usuario._id, // Usar o _id do usuário encontrado
                    }),
                }
            );

            if (!respostaObservacao.ok) {
                throw new Error('Erro ao adicionar observação');
            }

            // Redirecionar para a página de observações após o sucesso
            navigate(`/usuarios/${cpf}/observacoes`);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    const ajustarAlturaTextarea = (textarea) => {
        textarea.style.height = 'auto'; // Redefine a altura para recalcular
        textarea.style.height = `${textarea.scrollHeight + 10}px`; // Ajusta a altura com base no conteúdo
    };

    return (
        <div className="container-observation">
            <h1>Adicionar Observação</h1>
            <form onSubmit={handleSubmit} className="form-observation">
                <div>
                    <label>Observação:</label>
                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        required
                        onInput={(e) => ajustarAlturaTextarea(e.target)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={carregando}
                    className="button-primary"
                >
                    {carregando ? 'Adicionando...' : 'Adicionar'}
                </button>
            </form>
            {erro && <div style={{ color: 'red' }}>{erro}</div>}
        </div>
    );
};

export default FormObservation;
