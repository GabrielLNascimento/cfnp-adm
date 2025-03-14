import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/EditUser.css';
import PropTypes from 'prop-types';


const EditUser = ({ atualizarUsuario }) => {
    const { cpf } = useParams(); // Obtém o CPF da URL
    const navigate = useNavigate(); // Hook para navegação
    const [nome, setNome] = useState('');
    const [cpfUsuario, setCpfUsuario] = useState(''); // Estado para o CPF
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // Buscar os dados do usuário ao carregar o componente
    useEffect(() => {
        const buscarUsuario = async () => {
            const token = localStorage.getItem('token'); // Recupera o token

            if (!token) {
                navigate('/login', { replace: true }); // Redireciona para o login se não houver token
                return;
            }

            try {
                const resposta = await fetch(
                    `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                        },
                    }
                );

                if (!resposta.ok) {
                    throw new Error('Erro ao carregar usuário');
                }

                const usuario = await resposta.json();
                setNome(usuario.nome); // Preenche o campo com o nome atual
                setCpfUsuario(usuario.cpf); // Preenche o campo com o CPF atual
                setCarregando(false);
            } catch (error) {
                setErro(error.message);
                setCarregando(false);
            }
        };

        buscarUsuario();
    }, [cpf, navigate]);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // Recupera o token

        if (!token) {
            navigate('/login', { replace: true }); // Redireciona para o login se não houver token
            return;
        }

        try {
            const resposta = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                    body: JSON.stringify({ nome, cpf: cpfUsuario }), // Envia o nome e o novo CPF
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao atualizar usuário');
            }

            // Atualiza a lista de usuários no componente pai (App)
            atualizarUsuario(cpf, nome, cpfUsuario);

            // Redireciona para a lista de usuários após a edição
            navigate('/');
        } catch (error) {
            setErro(error.message);
        }
    };

    if (carregando) {
        return <div className='loading'>Carregando...</div>;
    }

    if (erro) {
        return <div className='error'>Erro: {erro}</div>;
    }

    return (
        <div className="container-formuser">
            <h1>Editar Usuário</h1>
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
                        value={cpfUsuario}
                        onChange={(e) => setCpfUsuario(e.target.value)} // Permite editar o CPF
                        required
                    />
                </div>
                <button type="submit" className="button-primary">
                    Salvar
                </button>
            </form>
        </div>
    );
};

EditUser.propTypes = {
    atualizarUsuario: PropTypes.func.isRequired,
};

export default EditUser;
