import { createContext, useState } from "react";


const PantallasContext = createContext();

export const PantallasProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [nombre, setNombre] = useState("");
    const [cursos, setCursos] = useState([]);
    const [cursosSelect, setCursosSelect] = useState([]);
    const [proyects, setProyects] = useState([]);
    const [myProyects, setMyProyects] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [nombreChat,setNombreChat] = useState("");
    const [idChat,setIdChat] = useState("");
    const [chat,setChat]=useState('');
    const [esteProyecto,setEsteProyecto]=useState('');
    return (
        <PantallasContext.Provider value={{ user, setUser, nombre, setNombre,cursos, setCursos,proyects, setProyects,cursosSelect, setCursosSelect,nombreChat,setNombreChat,myProyects, setMyProyects,notificaciones, setNotificaciones,idChat,setIdChat,chat,setChat,esteProyecto,setEsteProyecto}}>
            {children}
        </PantallasContext.Provider>
    )
}

export default PantallasContext;