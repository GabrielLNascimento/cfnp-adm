import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/FormObservation.css';
import { jwtDecode } from 'jwt-decode';

const FormObservation = () => {
    const { cpf } = useParams(); // Obtém o CPF da URL
    const [texto, setTexto] = useState(''); // Estado para armazenar o texto da observação
    const [data, setData] = useState(''); // Estado para armazenar a data da observação
    const [complemento, setComplemento] = useState(''); // Estado para armazenar o complemento da observação
    const [carregando, setCarregando] = useState(false); // Estado para controlar o carregamento
    const [erro, setErro] = useState(null); // Estado para armazenar erros
    const navigate = useNavigate(); // Hook para navegação

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        try {
            // Decodifica o token para obter o login do usuário
            const decoded = jwtDecode(token);
            const criadoPor = decoded.login;

            // Buscar o usuário pelo CPF para obter o ID
            const respostaUsuario = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!respostaUsuario.ok) {
                throw new Error('Erro ao buscar usuário');
            }
            const usuario = await respostaUsuario.json();

            // Determinar o texto a ser enviado
            const textoObservacao = texto === 'Outra' ? 'Outro' : texto;

            // Enviar a observação para o backend
            const respostaObservacao = await fetch(
                `https://api-cfnp.onrender.com/usuarios/cpf/${cpf}/observacoes`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        texto: textoObservacao,
                        data,
                        complemento,
                        usuarioId: usuario._id,
                        criadoPor: criadoPor,
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

    const deveMostrarTextarea =
        texto === 'Outra' ||
        texto === 'Intervenção Pedagógica: -40' ||
        texto === 'Intervenção Pedagógica: -80' ||
        texto === 'Matrícula Condicionada: -120' ||
        texto === 'Transferência Compulsória: -200';

    return (
        <div className="container-observation">
            <h1>Adicionar Observação</h1>
            <form onSubmit={handleSubmit} className="form-observation">
                <div>
                    <label>Tipo de Observação:</label>
                    <select
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma opção</option>
                        <option value="Medalha de Prata 1º Trimestre">
                            Medalha de Prata 1º Trimestre
                        </option>
                        <option value="Medalha de Prata 2º Trimestre">
                            Medalha de Prata 2º Trimestre
                        </option>
                        <option value="Medalha de Prata 3º Trimestre">
                            Medalha de Prata 3º Trimestre
                        </option>
                        <option value="Medalha de Ouro">Medalha de Ouro</option>
                        <option value="Medalha de Honra ao Mérito">
                            Medalha de Honra ao Mérito
                        </option>
                        <option value="Brasão Legionário Categoria Bronze">
                            Brasão Legionário Categoria Bronze
                        </option>
                        <option value="Brasão Legionário Categoria Prata">
                            Brasão Legionário Categoria Prata
                        </option>
                        <option value="Brasão Legionário Categoria Ouro">
                            Brasão Legionário Categoria Ouro
                        </option>
                        <option value="Intervenção Pedagógica: -40">
                            Intervenção Pedagógica: -40
                        </option>
                        <option value="Intervenção Pedagógica: -80">
                            Intervenção Pedagógica: -80
                        </option>
                        <option value="Matrícula Condicionada: -120">
                            Matrícula Condicionada: -120
                        </option>
                        <option value="Transferência Compulsória: -200">
                            Transferência Compulsória: -200
                        </option>
                        <option value="Outra">Outros</option>
                    </select>
                </div>
                {deveMostrarTextarea && (
                    <div>
                        <label>Digite sua observação:</label>
                        <textarea
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            onInput={(e) => ajustarAlturaTextarea(e.target)}
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Data:</label>
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        required
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
