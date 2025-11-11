import React, { createContext,useState} from 'react';

export const UsuariosContext = createContext();

export const UsuariosProvider= ({children}) => {
    const [listaDeUsuarios, setListaDeUsuarios]= useState([]);

    const adicionarUsuarios =(usuarios) =>{
        setListaDeUsuarios((prev) => [...prev, usuarios]);
    };

    return (
        <UsuariosContext.Provider value={{listaDeUsuarios, adicionarUsuarios}}>
            {children}
        </UsuariosContext.Provider>
    );
};