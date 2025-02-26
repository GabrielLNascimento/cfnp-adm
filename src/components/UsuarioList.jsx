import React from 'react';
import UsuarioItem from './UsuarioItem';
import "./css/UsuarioList.css"

const UsuarioList = ({ usuarios, onDelete }) => {
    return (
        <ul>
            {usuarios.map((usuario) => (
                <UsuarioItem
                    key={usuario._id}
                    usuario={usuario}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default UsuarioList;
