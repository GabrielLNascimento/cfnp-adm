import './css/TelaImpressao.css';
import PropTypes from 'prop-types';

const TelaImpressao = ({ observacoes, nomeAluno, onClose, cpfAluno }) => {
    return (
        <div className="tela-impressao">
            <div className="conteudo-impressao">
                <div>
                    <img
                        src="/cabecalho.png"
                        alt="Cabeçalho"
                        className="cabecalho-imagem"
                    />
                </div>
                <h1>
                    {nomeAluno} - {cpfAluno}
                </h1>{' '}
                <table>
                    <thead>
                        <tr>
                            <th>Observação</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {observacoes.map((observacao, index) => (
                            <tr key={index}>
                                <td>
                                    {observacao.texto == 'Outro'
                                        ? observacao.complemento
                                        : observacao.texto || ''}
                                </td>
                                <td>
                                    {new Date(
                                        observacao.data
                                    ).toLocaleDateString('pt-BR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <img
                        src="/rodape.png"
                        alt="Rodapé"
                        className="rodape-imagem"
                    />
                </div>
                <button onClick={onClose}>Fechar</button>
                <button onClick={() => window.print()}>Imprimir</button>
            </div>
        </div>
    );
};

TelaImpressao.propTypes = {
    observacoes: PropTypes.array.isRequired,
    nomeAluno: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    cpfAluno: PropTypes.string.isRequired,
};

export default TelaImpressao;
