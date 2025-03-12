import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/FormUsers.css"

const FormUsers = ({ adicionarUsuario }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const navigate = useNavigate();

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Criar o objeto do usuário
        const novoUsuario = {
            nome,
            cpf,
        };

        try {
            // Adicionar o usuário e recarregar a lista
            await adicionarUsuario(novoUsuario);

            // Redirecionar para a lista de usuários após o sucesso
            navigate('/');
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <div className='container-formuser'>
            <h1>Adicionar Usuário</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='button-primary'>Adicionar</button>
            </form>
        </div>
    );
};

export default FormUsers;
