import React from 'react';
import UsuarioItem from './UsuarioItem';
import './css/UsuarioList.css';

const UsuarioList = ({ usuarios, onDelete, userRole }) => {
    return (
        <div>
            {usuarios.map((usuario) => (
                <div key={usuario.cpf} className="usuario-item">
                    <span>{usuario.nome}</span>
                    <span>{usuario.cpf}</span>
                    {userRole === 'admin' && (
                        <button onClick={() => onDelete(usuario.cpf)}>
                            Deletar
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UsuarioList;
