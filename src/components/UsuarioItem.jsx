import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Paperclip, Pencil } from 'lucide-react';
import './css/UsuarioItem.css';
import PropTypes from 'prop-types';

const UsuarioItem = ({ usuario, onDelete, userRole }) => {
    const [deletando, setDeletando] = useState(false); // Estado para controlar o carregamento do botão
    const navigate = useNavigate(); // Hook para navegação

    const handleDelete = async () => {
        if (deletando) return; // Evita múltiplos cliques

        const token = localStorage.getItem('token'); // Recupera o token do localStorage

        if (!token) {
            navigate('/login', { replace: true }); // Redireciona para o login se não houver token
            return;
        }

        setDeletando(true); // Desabilita o botão

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${usuario.cpf}`,
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

            onDelete(usuario.cpf); // Atualiza a lista de usuários no estado
            window.location.reload(); // Recarrega a página
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setDeletando(false); // Reabilita o botão
        }
    };

    return (
        <li>
            <div className="container-aluno">
                <span>
                    <strong>Nome:</strong> {usuario.nome}
                </span>
                <span>
                    <strong>CPF:</strong> {usuario.cpf}
                </span>
            </div>

            <div className="container-actions">
                <Link to={`/usuarios/${usuario.cpf}/editar`}>
                    <button className="button-primary">
                        <Pencil />
                    </button>
                </Link>

                <Link to={`/usuarios/${usuario.cpf}/observacoes`}>
                    <button className="button-primary">
                        <Paperclip />
                    </button>
                </Link>
                {userRole === 'admin' && (
                    <button
                        onClick={handleDelete}
                        disabled={deletando}
                        className="button-primary"
                    >
                        {deletando ? 'Deletando...' : <Trash2 />}
                    </button>
                )}
            </div>
        </li>
    );
};

UsuarioItem.propTypes = {
    usuario: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    userRole: PropTypes.string.isRequired,
};

export default UsuarioItem;
