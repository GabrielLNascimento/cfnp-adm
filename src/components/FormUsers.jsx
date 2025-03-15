import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './css/FormUsers.css';

const FormUsers = ({ adicionarUsuario, usuarios }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        const novoUsuario = { nome, cpf };

        if (cpf.length !== 14) {
            setErro('CPF deve ter 14 digitos. Exemplo: (000.000.000-00)');
            return
        }

        const cpfExistente = usuarios.some((usuario) => usuario.cpf === cpf)
        if (cpfExistente) {
            setErro('CPF ja cadastrado')
            return
        }

        setErro('')

        try {
            await adicionarUsuario(novoUsuario);
            navigate('/');
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const formatarCpf = (cpf) => {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const cpfLimitado = cpfLimpo.slice(0, 11);

        let cpfFormatado = '';

        for (let i = 0; i < cpfLimitado.length; i++) {
            if (i === 3 || i === 6) {
                cpfFormatado += '.';
            } else if (i === 9) {
                cpfFormatado += '-';
            }
            cpfFormatado += cpfLimitado[i];
        }

        return cpfFormatado;
    };

    const handleSetNome = (e) => {
        const name = e.target.value;
        setNome(name.toUpperCase());
    };

    const handleSetCpf = (e) => {
        const cpf = e.target.value;
        const cpfFormatado = formatarCpf(cpf);
        setCpf(cpfFormatado);
    };

    return (
        <div className="container-formuser">
            <h1>Adicionar Usuário</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => handleSetNome(e)}
                        required
                    />
                </div>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => handleSetCpf(e)}
                        required
                    />
                </div>
                {erro && <p className='erro-msg'>Erro: {erro}</p>}
                <button type="submit" className="button-primary">
                    Adicionar
                </button>
            </form>
        </div>
    );
};

FormUsers.propTypes = {
    adicionarUsuario: PropTypes.func.isRequired,
    usuarios: PropTypes.array.isRequired,
};

export default FormUsers;
