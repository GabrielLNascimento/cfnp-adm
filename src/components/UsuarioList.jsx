import React from 'react';
import UsuarioItem from './UsuarioItem';
import './css/UsuarioList.css';

const UsuarioList = ({ usuarios, onDelete, userRole }) => {
    return (
        <ul>
            {usuarios.map((usuario) => (
                <UsuarioItem
                    key={usuario.id}
                    usuario={usuario}
                    onDelete={onDelete}
                    userRole={userRole}
                />
                // <div key={usuario.cpf} className="usuario-item">
                //     <span>{usuario.nome}</span>
                //     <span>{usuario.cpf}</span>
                //     {userRole === 'admin' && (
                //         <button onClick={() => onDelete(usuario.cpf)}>
                //             Deletar
                //         </button>
                //     )}
                // </div>
            ))}
        </ul>
    );
};

export default UsuarioList;
